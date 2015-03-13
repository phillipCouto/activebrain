/*
activebrain is the web server used for serving the frontend web application and receiving the
results from the tests in csv files for later processing.
*/
package main

import (
	"encoding/hex"
	"errors"
	"flag"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"time"

	"github.com/boltdb/bolt"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

var (
	errInvalidFormat = errors.New("invalid account format")
	errNoToken       = errors.New("no token found")

	accountPath     string
	httpAddr        string
	httpsAddr       string
	keyPath         string
	certPath        string
	dbPath          string
	outputPath      string
	accountCheck    time.Duration
	tokenExpiration time.Duration
	db              *bolt.DB

	accounts = NewAccounts()
)

func init() {
	flag.StringVar(&httpAddr, "http", "localhost:8080", "defines the IP and port for the web server to bind http to")
	flag.StringVar(&httpsAddr, "https", "", "defines the IP and Port for the web server to bind https to")
	flag.StringVar(&keyPath, "key", "", "the path to the private key used for https")
	flag.StringVar(&certPath, "cert", "", "the path to the public key used for https")
	flag.StringVar(&dbPath, "dbpath", "activebrain.db", "path to store the embedded database")
	flag.StringVar(&outputPath, "results", "results", "folder path to create csv files in")
	flag.StringVar(&accountPath, "accounts", "accounts", "path to the accounts file")

	acs := flag.Int64("checkAccount", 30, "time in seconds to check the accounts file")
	tExp := flag.Int64("tokenExpiry", 900, "maximum time a token is valid")

	flag.Parse()

	//Create the needed Duration objects from falgs
	tokenExpiration, _ = time.ParseDuration(strconv.FormatInt(*tExp, 10) + "s")
	accountCheck, _ = time.ParseDuration(strconv.FormatInt(*acs, 10) + "s")
}

func main() {

	sig := make(chan os.Signal, 1)
	signal.Notify(sig, os.Kill, os.Interrupt)

	//Open the database file to temporarily store results
	bdb, err := bolt.Open(dbPath, 0600, &bolt.Options{Timeout: 1 * time.Second})
	if err != nil {
		log.Fatalln(err)
	}
	db = bdb
	defer db.Close()

	//Make sure buckets exist in the database
	if err = CheckAuthTokensBucket(); err != nil {
		log.Fatalln(err)
	}

	//Start up the background services that keep the application in check
	go accounts.AccountsService()
	go TokenCleanupService()

	fileServer := http.FileServer(http.Dir("web/"))
	gin.SetMode(gin.ReleaseMode)

	//Setup Gin
	r := gin.Default()
	r.Use(authenticated())
	r.LoadHTMLTemplates("*.tmpl")

	r.POST("/results", postResults)
	r.GET("/login", getLogin)
	r.POST("/login", postLogin)
	r.GET("/logout", getLogout)
	r.GET("/session", getSession)
	r.GET("/subject", getSubject)

	r.NoRoute(func(c *gin.Context) {
		fileServer.ServeHTTP(c.Writer, c.Request)
	})

	//Start up the http and https servers based on the configuration
	if httpsAddr != "" {

		if keyPath == "" || certPath == "" {
			log.Println("please provide both key and public certificate paths for https")
			flag.PrintDefaults()
			return
		}

		mux := http.NewServeMux()
		mux.HandleFunc("/", httpRedirect)

		go httpServer(mux)
		go httpsServer(r)

	} else {
		go httpServer(r)
	}

	s := <-sig
	log.Println("OS Signal ", s)
}

/*
httpRedirect is used to bounce http connections to https
*/
func httpRedirect(w http.ResponseWriter, req *http.Request) {
	newURL := req.URL
	newURL.Scheme = "https"
	w.Header().Set("Location", newURL.String())
	w.WriteHeader(http.StatusMovedPermanently)
}

/*
httpServer creates and runs the http server
*/
func httpServer(handler http.Handler) {
	s := &http.Server{
		Addr:           httpAddr,
		Handler:        handler,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}
	if err := s.ListenAndServe(); err != nil {
		log.Fatalln(err)
	}
}

/*
httpsServer creates and runs the https server
*/
func httpsServer(handler http.Handler) {
	s := &http.Server{
		Addr:           httpsAddr,
		Handler:        handler,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	if err := s.ListenAndServeTLS(certPath, keyPath); err != nil {
		log.Fatalln(err)
	}
}

/*
authenticated is a middleware to make sure access to the service is only granted to authenticated
users.
*/
func authenticated() gin.HandlerFunc {
	return func(c *gin.Context) {
		if strings.Contains(c.Request.URL.String(), "/login") {
			return
		}
		var tokenID string
		cookie, err := c.Request.Cookie("X-Auth-Token")
		if err != nil {
			c.Redirect(303, "/login")
			c.Abort()
			return
		}
		tokenID = cookie.Value

		tid, err := hex.DecodeString(tokenID)
		if err != nil {
			c.Redirect(303, "/login")
			c.Abort()
			return
		}

		token, err := GetAuthToken(tid)
		if err != nil {
			c.Redirect(303, "/login")
			c.Abort()
			return
		}

		c.Set("token", token)
	}
}

/*
getLogin handles displaying the login screen.
*/
func getLogin(c *gin.Context) {
	if retry := c.Request.URL.Query().Get("retry"); retry != "" {
		c.HTML(200, "login.tmpl", gin.H{
			"message": "Please check credentials and try again.",
		})
	} else {
		c.HTML(200, "login.tmpl", gin.H{})
	}
}

/*
getLogout handles a logout request that forcefully expires the token and writes out
pending results
*/
func getLogout(c *gin.Context) {
	token := c.MustGet("token").(*AuthToken)

	if err := ExpireToken(token); err != nil {
		c.Fail(500, err)
		return
	}
	c.Redirect(303, "/login")
}

/*
postLogin handles when a login attempt is made.
*/
func postLogin(c *gin.Context) {
	var req AuthenticateRequest

	if err := binding.Form.Bind(c.Request, &req); err != nil {
		c.Fail(500, err)
	}

	if accounts.Challenge(&req) {

		token, err := NewAuthToken(req.Username)
		if err != nil {
			c.Fail(500, err)
			return
		}

		cookie := &http.Cookie{
			Name:     "X-Auth-Token",
			Value:    hex.EncodeToString(token.ID),
			Path:     "/",
			Expires:  token.Expiration,
			HttpOnly: true,
		}
		http.SetCookie(c.Writer, cookie)
		c.Redirect(303, "/")
	} else {
		c.Redirect(303, "/login?retry=1")
	}
}

/*
postReults handles receiving the Trial results from the frontend and writes the results to
a .csv file in the results folder.
*/
func postResults(c *gin.Context) {
	var results Results
	c.Bind(&results)

	token := c.MustGet("token").(*AuthToken)
	sr := NewStoredResults(&results)

	if err := sr.writeToDisk(token); err != nil {
		c.Fail(500, err)
		return
	}
}

/*
getSession returns the session information
*/
func getSession(c *gin.Context) {
	token := c.MustGet("token").(*AuthToken)
	props := make(map[string]interface{})
	props["ID"] = int8(token.ID[len(token.ID)-1])
	props["UniqueID"] = hex.EncodeToString(token.ID)
	props["Expiration"] = token.Expiration
	c.JSON(200, props)
}

/*
getSubject returns the user/subject information
*/
func getSubject(c *gin.Context) {
	token := c.MustGet("token").(*AuthToken)
	props := make(map[string]interface{})
	props["ID"] = token.User
	c.JSON(200, props)
}
