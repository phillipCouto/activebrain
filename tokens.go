package main

import (
	"strconv"
	"time"

	"github.com/fzzy/radix/redis"
	"github.com/nu7hatch/gouuid"
)

//AuthToken is generated when a user is authenticated. This is used to track a session.
type AuthToken struct {
	ID         string
	User       string
	Expiration time.Time
	Tasks      int
	Num        int
}

/*
GetAuthToken fetchs a token from the database using the provided id
*/
func GetAuthToken(token string) (*AuthToken, error) {
	var auth AuthToken
	c, err := rpool.Get()
	if err != nil {
		return nil, err
	}
	defer rpool.CarefullyPut(c, &err)

	rep := c.Cmd("HGETALL", token)
	if rep.Err != nil {
		return nil, rep.Err
	} else if rep.Type == redis.NilReply {
		return nil, errNoToken
	}
	var vals map[string]string
	vals, err = rep.Hash()
	if err != nil {
		return nil, err
	}
	auth.User = vals["User"]
	auth.Expiration, err = time.Parse(time.RFC3339, vals["Expiration"])
	if err != nil {
		return nil, err
	}
	var temp int64
	temp, err = strconv.ParseInt(vals["Tasks"], 10, 32)
	if err != nil {
		return nil, err
	}
	auth.Tasks = int(temp)

	temp, err = strconv.ParseInt(vals["Num"], 10, 32)
	if err != nil {
		return nil, err
	}
	auth.Num = int(temp)
	auth.ID = token

	return &auth, nil
}

/*
NewAuthToken creates a new AuthToken triggering a new session
*/
func NewAuthToken(username string) (*AuthToken, error) {
	id, err := uuid.NewV4()
	if err != nil {
		return nil, err
	}
	token := &AuthToken{}
	token.ID = id.String()
	token.User = username
	token.Expiration = time.Now().Add(tokenExpiration)
	token.Num = 1

	c, err := rpool.Get()
	if err != nil {
		return nil, err
	}
	defer rpool.CarefullyPut(c, &err)

	res := c.Cmd("HMGET", token.User, "Count", "Expiration")
	if res.Err != nil {
		return nil, res.Err
	} else if res.Type != redis.NilReply {
		vals, err := res.List()
		if err != nil {
			return nil, err
		}
		if vals[0] != "" && vals[1] != "" {
			exp, err := time.Parse(time.RFC3339, vals[1])
			if err != nil {
				return nil, err
			}
			if exp.After(time.Now()) {
				num, err := strconv.ParseInt(vals[0], 10, 32)
				if err != nil {
					return nil, err
				}
				token.Num += int(num)
			}
		}
	}
	c.Append("HMSET", token.ID,
		"User", username,
		"Expiration", token.Expiration.Format(time.RFC3339),
		"Tasks", token.Tasks,
		"Num", token.Num)
	c.Append("EXPIRE", token.ID, int64(tokenExpiration.Seconds()))

	if err = c.GetReply().Err; err != nil {
		return nil, err
	}
	if err = c.GetReply().Err; err != nil {
		return nil, err
	}

	return token, nil
}

func IncrementTasks(token *AuthToken) error {

	c, err := rpool.Get()
	if err != nil {
		return err
	}
	defer rpool.CarefullyPut(c, &err)
	count := 0
	if token.Tasks == 0 {
		now := time.Now()
		next := now.AddDate(0, sessCountMonths, -1*now.Day()+1)
		res := c.Cmd("HGET", token.User, "Expiration")
		if res.Err != nil {
			return err
		} else if res.Type != redis.NilReply {
			exp, err := time.Parse(time.RFC3339, res.String())
			if err != nil {
				return err
			}
			if exp.After(now) {
				c.Append("HINCRBY", token.User, "Count", 1)
				c.Append("EXPIRE", token.User, int64(next.Sub(now).Seconds()))
				count += 2
			} else {
				c.Append("HMSET", token.User, "Count", 1, "Expiration", next.Format(time.RFC3339))
				c.Append("EXPIRE", token.User, int64(next.Sub(now).Seconds()))
				count += 2
			}
		} else {
			c.Append("HMSET", token.User, "Count", 1, "Expiration", next.Format(time.RFC3339))
			c.Append("EXPIRE", token.User, int64(next.Sub(now).Seconds()))
			count += 2
		}
	}
	token.Tasks++

	c.Append("HINCRBY", token.ID, "Tasks", 1)
	c.Append("EXPIRE", token.ID, int64(token.Expiration.Sub(time.Now()).Seconds()))
	count += 2
	for count > 0 {
		if err = c.GetReply().Err; err != nil {
			return err
		}
		count--
	}
	return nil
}

/*
ExpireToken expires the token by setting the expiration to now -1 second
*/
func ExpireToken(token *AuthToken) error {
	c, err := rpool.Get()
	if err != nil {
		return err
	}
	defer rpool.CarefullyPut(c, &err)

	if err = c.Cmd("DEL", token.ID).Err; err != nil {
		return err
	}
	return nil
}
