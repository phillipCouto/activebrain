package main

import (
	"time"
)

type AuthToken struct {
	id         string
	user       string
	expiration time.Time
}

type AuthTokens struct {
	tokens       map[string]*AuthToken
	chanReqToken chan string
	chanResToken chan *AuthToken
	chanPutToken chan *AuthToken
}

func NewAuthTokens() *AuthTokens {
	return &AuthTokens{
		tokens:       make(map[string]*AuthToken),
		chanReqToken: make(chan string),
		chanResToken: make(chan *AuthToken),
		chanPutToken: make(chan *AuthToken),
	}
}

func (a *AuthTokens) Get(tid string) (*AuthToken, error) {
	a.chanReqToken <- tid
	if token := <-a.chanResToken; token == nil {
		return nil, errNoToken
	} else {
		return token, nil
	}
}

func (a *AuthTokens) Set(token *AuthToken) {
	a.chanPutToken <- token
}

func (a *AuthTokens) TokenService() *AuthTokens {
	for {
		select {
		case tid := <-a.chanReqToken: //AuthTokens.Get
			if token, ok := a.tokens[tid]; ok {
				if token.expiration.Add(tokenExpiration).Before(time.Now()) {
					a.tokens[tid] = nil
					a.chanResToken <- nil
				} else {
					a.chanResToken <- token
				}
			} else {
				a.chanResToken <- nil
			}
		case token := <-a.chanPutToken: //AuthTokens.Set
			a.tokens[token.id] = token
		}
	}
}
