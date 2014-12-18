package main

import (
	"encoding/csv"
	"errors"
	"flag"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/nu7hatch/gouuid"
	"net"
	"net/http"
	"os"
	"strconv"
	"time"
)

var (
	errInvalidFormat = errors.New("invalid account format")
	errNoToken       = errors.New("no token found")

	address             string
	accounts            = NewAccounts()
	accountCheckSeconds time.Duration
	tokens              = NewAuthTokens()
	tokenExpiration     time.Duration
)

func main() {

	flag.StringVar(&address, "address", ":8080", "defines the IP and port for the web server to bind to")
	acs := flag.Int64("checkAccount", 30, "time in seconds to check the accounts file")
	tExp := flag.Int64("tokenExpiry", 86400, "maximum time a token is valid")
	flag.Parse()

	tokenExpiration, _ = time.ParseDuration(strconv.FormatInt(*tExp, 10) + "s")
	accountCheckSeconds, _ = time.ParseDuration(strconv.FormatInt(*acs, 10) + "s")

	go accounts.AccountsService()
	go tokens.TokenService()

	fileServer := http.FileServer(http.Dir("web/"))
	r := gin.Default()
	r.Use(authenticated())
	r.LoadHTMLTemplates("*.tmpl")

	r.POST("/results", postResults)
	r.GET("/login", getLogin)
	r.POST("/login", postLogin)

	r.NoRoute(func(c *gin.Context) {
		fileServer.ServeHTTP(c.Writer, c.Request)
	})

	r.Run(address)
}

type Trial struct {
	ID      int
	RT      int
	Correct bool
}

func (t *Trial) ToCSVStrings() []string {
	return []string{
		strconv.FormatInt(int64(t.ID), 10),
		strconv.FormatInt(int64(t.RT), 10),
		strconv.FormatBool(t.Correct),
	}
}

func postResults(c *gin.Context) {
	var results []Trial
	c.Bind(&results)

	token := c.MustGet("token").(*AuthToken)
	host, _, _ := net.SplitHostPort(c.Request.RemoteAddr)
	filename := fmt.Sprintf("results/%v-%v-%v.csv", token.user, host, time.Now().Format("2006.01.02-15.04.05"))
	f, err := os.OpenFile(filename, os.O_WRONLY|os.O_TRUNC|os.O_CREATE, os.ModePerm)
	if err != nil {
		c.Fail(500, err)
		return
	}
	defer f.Close()

	writer := csv.NewWriter(f)

	for _, result := range results {
		writer.Write(result.ToCSVStrings())
	}
	writer.Flush()
	if err = writer.Error(); err != nil {
		c.Fail(500, err)
		return
	}
}

func getLogin(c *gin.Context) {
	if retry := c.Request.URL.Query().Get("retry"); retry != "" {
		c.HTML(200, "login.tmpl", gin.H{
			"message": "Please check credentials and try again.",
		})
	} else {
		c.HTML(200, "login.tmpl", gin.H{})
	}
}

func postLogin(c *gin.Context) {
	var req AuthenticateRequest

	if err := binding.Form.Bind(c.Request, &req); err != nil {
		c.Fail(500, err)
	}

	if accounts.Challenge(&req) {
		id, err := uuid.NewV4()
		if err != nil {
			c.Fail(500, err)
		}
		token := &AuthToken{
			id:         id.String(),
			user:       req.Username,
			expiration: time.Now().Add(tokenExpiration),
		}
		tokens.Set(token)
		cookie := &http.Cookie{
			Name:     "X-Auth-Token",
			Value:    token.id,
			Path:     "/",
			Expires:  token.expiration,
			HttpOnly: true,
		}
		http.SetCookie(c.Writer, cookie)
		c.Redirect(303, "/")
	} else {
		c.Redirect(303, "/login?retry=1")
	}
}
