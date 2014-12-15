package main

import (
	"bufio"
	"log"
	"os"
	"strings"
	"time"
)

type AuthenticateRequest struct {
	Username string
	Password string
}

func parseAccounts() (map[string]string, error) {
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

func watchAccountsFile() {
	for {
		select {
		case <-time.After(accountCheckSeconds):
			stat, err := os.Stat("accounts")
			if err != nil {
				log.Fatalf("failed to stat accounts file, %v", err)
			}
			if accountTime.IsZero() || stat.ModTime().Before(accountTime) {
				acctsMu.Lock()
				accounts, err = parseAccounts()
				acctsMu.Unlock()
				accountTime = stat.ModTime()
				if err != nil {
					log.Printf("error parsing accounts file, %v", err)
				}
			}

		}
	}
}
