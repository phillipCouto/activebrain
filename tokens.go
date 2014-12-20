package activebrain

import (
	"time"
)

//AuthToken is generated when a user is authenticated. This is used to track a session.
type AuthToken struct {
	id         string
	user       string
	expiration time.Time
}

/*
AuthTokens is a service used to interact with Authentication tokens.
*/
type AuthTokens struct {
	tokens       map[string]*AuthToken
	chanReqToken chan string
	chanResToken chan *AuthToken
	chanPutToken chan *AuthToken
}

//NewAuthTokens is a ulity function to create a new AuthTokens instance.
func NewAuthTokens() *AuthTokens {
	return &AuthTokens{
		tokens:       make(map[string]*AuthToken),
		chanReqToken: make(chan string),
		chanResToken: make(chan *AuthToken),
		chanPutToken: make(chan *AuthToken),
	}
}

//Get returns a valid token or an error if one is encountered while trying to validate it.
func (a *AuthTokens) Get(tid string) (*AuthToken, error) {
	a.chanReqToken <- tid
	if token := <-a.chanResToken; token == nil {
		return nil, errNoToken
	} else {
		return token, nil
	}
}

//Set puts the token into the AuthTokens Service.
func (a *AuthTokens) Set(token *AuthToken) {
	a.chanPutToken <- token
}

//TokenService must be ran in a separate go rountine. This handles Get and Put requests from the API.
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
