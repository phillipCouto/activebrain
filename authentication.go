package main

import (
	"bufio"
	"github.com/gin-gonic/gin"
	"log"
	"os"
	"strings"
	"time"
)

type AuthenticateRequest struct {
	Username string `form:"Username" binding:"required"`
	Password string `form:"Password" binding:"required"`
}

type Accounts struct {
	accts    map[string]string
	acctTime time.Time
	chanReq  chan *AuthenticateRequest
	chanRes  chan bool
}

func NewAccounts() *Accounts {
	return &Accounts{
		accts:   make(map[string]string),
		chanReq: make(chan *AuthenticateRequest),
		chanRes: make(chan bool),
	}
}

func (a *Accounts) Challenge(req *AuthenticateRequest) bool {
	log.Println(req)
	a.chanReq <- req
	return <-a.chanRes
}

func (a *Accounts) AccountsService() {
	check := time.After(0)
	for {
		select {
		case <-check:

			stat, err := os.Stat("accounts")
			if err != nil {
				log.Fatalf("failed to stat accounts file, %v", err)
			}

			check = time.After(accountCheckSeconds)
			lastMod := stat.ModTime()

			if a.acctTime.IsZero() || lastMod.After(a.acctTime) {
				a.accts, err = parseAccountsFile()
				if err != nil {
					log.Printf("error parsing accounts file, %v", err)
				}
				a.acctTime = lastMod
			}
		case req := <-a.chanReq:
			if pass, ok := a.accts[req.Username]; ok && pass == req.Password {
				a.chanRes <- true
			} else {
				log.Println(ok, req)
				a.chanRes <- false
			}
		}
	}
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

func parseAccountsFile() (map[string]string, error) {
	f, err := os.Open("accounts")
	if err != nil {
		return nil, err
	}

	defer f.Close()

	accts := make(map[string]string)

	scanner := bufio.NewScanner(f)

	for scanner.Scan() {
		parts := strings.Split(scanner.Text(), ":")
		if len(parts) != 2 {
			return nil, errInvalidFormat
		}
		accts[parts[0]] = parts[1]
	}
	if err = scanner.Err(); err != nil {
		return nil, err
	}
	return accts, nil
}
