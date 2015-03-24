package main

import (
	"bufio"
	"log"
	"os"
	"strings"
	"time"
)

/*
AuthenticateRequest is the structure used to receive the form data to authenticate a user.
*/
type AuthenticateRequest struct {
	Username string `form:"Username" binding:"required"`
	Password string `form:"Password" binding:"required"`
}

/*
Accounts is the the service used to authenticate login requests.
*/
type Accounts struct {
	accts    map[string]string
	acctTime time.Time
	chanReq  chan *AuthenticateRequest
	chanRes  chan bool
}

//NewAccounts creates a new Accounts object. This is a helper function
func NewAccounts() *Accounts {
	return &Accounts{
		accts:   make(map[string]string),
		chanReq: make(chan *AuthenticateRequest),
		chanRes: make(chan bool),
	}
}

/*
Challenge sends the credentials to the Accounts service and returns a boolean on the validity
of the credentials.
*/
func (a *Accounts) Challenge(req *AuthenticateRequest) bool {
	a.chanReq <- req
	return <-a.chanRes
}

/*
AccountsService is ran in a separate go rountine and handles the processing of challenge requests
as well as regularly checking the accounts file for new credential pairs.
*/
func (a *Accounts) AccountsService() {
	check := time.After(0)
	for {
		select {
		case <-check: //Check the accounts file.
			stat, err := os.Stat(accountPath)
			if err != nil {
				log.Fatalf("failed to stat accounts file, %v", err)
			}

			check = time.After(accountCheck)
			lastMod := stat.ModTime()

			if a.acctTime.IsZero() || lastMod.After(a.acctTime) {
				a.accts, err = parseAccountsFile()
				if err != nil {
					log.Printf("error parsing accounts file, %v", err)
				}
				a.acctTime = lastMod
			}

		case req := <-a.chanReq: //Process Challenge Request
			if pass, ok := a.accts[req.Username]; ok && pass == req.Password {
				a.chanRes <- true
			} else {
				a.chanRes <- false
			}
		}
	}
}

/*
parseAccountsFile opens accounts and reads in the credential pairs. The expected format for the file is:

	username:password

Use the checkAccount flag to set how often the accounts file is scanned for changes.
*/
func parseAccountsFile() (map[string]string, error) {
	f, err := os.Open(accountPath)
	if err != nil {
		return nil, err
	}

	defer f.Close()

	accts := make(map[string]string)

	scanner := bufio.NewScanner(f)

	for scanner.Scan() {
		txt := scanner.Text()
		if txt == "" {
			continue
		}
		parts := strings.Split(txt, ":")
		if len(parts) != 2 {
			log.Println("ignored line \"", txt, "\" as it does not follow the correct schema")
			continue
		}
		accts[parts[0]] = parts[1]
	}
	if err = scanner.Err(); err != nil {
		return nil, err
	}
	return accts, nil
}
