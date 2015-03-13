package main

import (
	"bytes"
	"encoding/gob"
	"encoding/hex"
	"log"
	"time"

	"github.com/boltdb/bolt"
)

var (
	TOKEN_BUCKET = []byte("Tokens")
)

//Token is just a shorthand byte array type
type Token []byte

//AuthToken is generated when a user is authenticated. This is used to track a session.
type AuthToken struct {
	ID         Token
	User       string
	Expiration time.Time
}

//CheckAuthTokensBucket makes sure the bucket exists in the db
func CheckAuthTokensBucket() error {

	return db.Update(func(tx *bolt.Tx) error {
		_, err := tx.CreateBucketIfNotExists(TOKEN_BUCKET)
		return err
	})
}

/*
GetAuthToken fetchs a token from the database using the provided id
*/
func GetAuthToken(token Token) (*AuthToken, error) {
	var auth AuthToken
	err := db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket(TOKEN_BUCKET)

		v := b.Get(token)
		if v == nil {
			return errNoToken
		}

		var buf bytes.Buffer
		buf.Write(v)
		dec := gob.NewDecoder(&buf)

		if err := dec.Decode(&auth); err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	if auth.Expiration.Before(time.Now()) {
		return nil, errNoToken
	}

	return &auth, nil
}

/*
NewAuthToken creates a new AuthToken triggering a new session
*/
func NewAuthToken(username string) (*AuthToken, error) {
	now := time.Now()
	name := []byte(username)
	id := make([]byte, 0, 5+len(name))
	token := &AuthToken{}

	err := db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket(TOKEN_BUCKET)
		c := b.Cursor()

		//Assemble prefix
		id = append(id, byte(now.Year()>>8))
		id = append(id, byte(now.Year()))
		id = append(id, byte(now.Month()))
		id = append(id, byte(now.Day()))
		id = append(id, name...)

		sessionNum := 0
		if k, _ := c.Seek(id); k != nil {
			for nk := k; bytes.HasPrefix(nk, id); nk, _ = c.Next() {
				k = nk
			}
			sessionNum = int(k[len(k)-1])
			log.Printf("last session id for '%v' was #%v\n", username, sessionNum)
		}
		id = append(id, byte(sessionNum+1))

		token.ID = id
		token.User = username
		token.Expiration = now.Add(tokenExpiration)

		var buf bytes.Buffer
		enc := gob.NewEncoder(&buf)
		if err := enc.Encode(token); err != nil {
			return err
		}
		if err := b.Put(id, buf.Bytes()); err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		return nil, err
	}
	return token, nil

}

/*
ExpireToken expires the token by setting the expiration to now -1 second
*/
func ExpireToken(token *AuthToken) error {
	return db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket(TOKEN_BUCKET)

		token.Expiration = time.Now().Add(-1 * time.Second)

		var buf bytes.Buffer
		gob.NewEncoder(&buf).Encode(token)

		return b.Put(token.ID, buf.Bytes())
	})
}

/*
TokenCleanupService removes long expired sessions from the database
to keep the database small and effecient
*/
func TokenCleanupService() {
	for {

		db.Update(func(tx *bolt.Tx) error {
			c := tx.Bucket(TOKEN_BUCKET).Cursor()

			now := time.Now()
			var token AuthToken
			for k, v := c.First(); k != nil; k, v = c.Next() {
				var buf bytes.Buffer
				buf.Write(v)
				dec := gob.NewDecoder(&buf)

				if err := dec.Decode(&token); err != nil {
					log.Printf("delete session %v data, token corrupt\n", hex.EncodeToString(k))
					c.Delete()
					continue
				}

				if now.Sub(token.Expiration).Hours() > 24 {
					log.Printf("removing expired session %v\n", hex.EncodeToString(token.ID))
					c.Delete()
				} else {
					break
				}
			}

			return nil
		})

		<-time.After(24 * time.Hour)
	}
}
