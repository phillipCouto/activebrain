package main

import (
	"encoding/csv"
	"errors"
	"flag"
	"fmt"
	"github.com/gin-gonic/gin"
	"net"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"
)

var (
	errInvalidFormat = errors.New("invalid account format")
	errNoToken       = errors.New("no token found")

	address             string
	accounts            map[string]string
	accountTime         time.Time
	accountCheckSeconds time.Duration
	acctsMu             sync.RWMutex
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

func authenticated() gin.HandlerFunc {
	return func(c *gin.Context) {
		if strings.Contains(c.Request.URL.String(), "/login") {
			return
		}
		var tokenID string
		if cookie, err := c.Request.Cookie("X-Auth-Token"); err != nil {
			c.Redirect(303, "/login")
			c.Abort(303)
			return
		} else {
			tokenID = cookie.Value
		}

		token, err := tokens.Get(tokenID)
		if err != nil {
			c.Redirect(303, "/login")
			c.Abort(303)
			return
		}

		c.Set("token", token)
	}
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
	c.HTML(200, "login.tmpl", gin.H{})
}

func postLogin(c *gin.Context) {
	var req AuthenticateRequest
	c.Bind(&req)

}
