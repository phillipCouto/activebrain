package main

import (
	"bytes"
	"encoding/csv"
	"encoding/gob"
	"encoding/hex"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"time"

	"github.com/boltdb/bolt"
)

var (
	RESULTS_BUCKET    = []byte("Results")
	chanForceWriteOut = make(chan bool, 1)
)

//Results the expected data format from the client
type Results struct {
	Header map[string]interface{}
	Data   []map[string]interface{}
}

//StoredResults is the data structure persisted in the database
type StoredResults struct {
	Columns map[string]struct{}
	Results []map[string]interface{}
}

//NewStoredResults creates a new StoredResult from a Results object
func NewStoredResults(res *Results) StoredResults {
	r := StoredResults{
		Columns: make(map[string]struct{}),
		Results: res.Data,
	}
	r.Columns["Task"] = struct{}{}

	for _, v := range res.Data {
		//Add task to the results
		v["Task"] = res.Header["task"]
		//Scan columns to add any missing
		for k, _ := range v {
			if _, exists := r.Columns[k]; !exists {
				r.Columns[k] = struct{}{}
			}
		}
	}
	return r
}

//AddResults adds the Results data to the StoredResults object
func (r *StoredResults) AddResults(res *Results) {
	for _, v := range res.Data {
		//Add task to the results
		v["Task"] = res.Header["task"]
		//Scan columns to add any missing
		for k, _ := range v {
			if _, exists := r.Columns[k]; !exists {
				r.Columns[k] = struct{}{}
			}
		}
		r.Results = append(r.Results, v)
	}
}

//CheckResultsBocket makes sure the RESULTS_BUCKET exists in the db
func CheckResultsBucket() error {
	return db.Update(func(tx *bolt.Tx) error {
		_, err := tx.CreateBucketIfNotExists(RESULTS_BUCKET)
		return err
	})
}

//AddResults adds the Results to the database
func AddResults(token *AuthToken, res *Results) error {
	return db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket(RESULTS_BUCKET)

		var sr StoredResults

		v := b.Get(token.ID)
		if v == nil {
			sr = NewStoredResults(res)
		} else {
			var buf bytes.Buffer
			buf.Write(v)
			dec := gob.NewDecoder(&buf)

			if err := dec.Decode(&sr); err != nil {
				return err
			}
			sr.AddResults(res)
		}

		var buf bytes.Buffer
		enc := gob.NewEncoder(&buf)
		enc.Encode(sr)

		if err := b.Put(token.ID, buf.Bytes()); err != nil {
			return err
		}

		return nil
	})
}

/*
ResultsOutputService periodically writes out the StoredResults
to csv files as the sessions expires so it can be processed
by external tools.
*/
func ResultsOutputService() {
	for {
		err := db.Update(func(tx *bolt.Tx) error {
			now := time.Now()
			c := tx.Bucket(TOKEN_BUCKET).Cursor()
			rb := tx.Bucket(RESULTS_BUCKET)

			var token AuthToken
			var results StoredResults
			for k, v := c.First(); k != nil; k, v = c.Next() {
				var buf bytes.Buffer
				buf.Write(v)
				dec := gob.NewDecoder(&buf)

				if err := dec.Decode(&token); err != nil {
					log.Printf("delete session %v data, token corrupt", hex.EncodeToString(k))
					rb.Delete(k)
					c.Delete()
					continue
				}

				if token.Expiration.Before(now) {
					rv := rb.Get(k)
					if rv != nil {
						buf.Reset()
						buf.Write(rv)
						if err := dec.Decode(&results); err != nil {
							log.Printf("delete session %v data, results corrupt, %v", hex.EncodeToString(k), err)
							rb.Delete(k)
						} else {
							if err := WriteOutResults(&token, &results); err != nil {
								log.Printf("failed to write csv for %v, %v", hex.EncodeToString(k), err)
								continue
							}
							rb.Delete(k)
						}
					}
				}
			}
			return nil
		})
		if err != nil {
			log.Println(err)
		}

		//Wait for either a force writeout from a logout or regular interval
		select {
		case <-time.After(tokenExpiration):
		case <-chanForceWriteOut:
		}
	}
}

/*
WriteOutResults is a shorthand function to write the csv file
*/
func WriteOutResults(token *AuthToken, results *StoredResults) error {
	var fileName string
	columns := make([]string, 0, len(results.Columns))

	for k, _ := range results.Columns {
		columns = append(columns, k)
	}

	sort.Strings(columns)

	fileName = fmt.Sprintf("%v-%v-%02d.csv", token.Expiration.Format("20060102T150405"), token.User, int8(token.ID[len(token.ID)-1]))

	f, err := os.OpenFile(filepath.Join(outputPath, fileName), os.O_WRONLY|os.O_TRUNC|os.O_CREATE, os.ModePerm)
	if err != nil {
		return err
	}
	defer f.Close()

	writer := csv.NewWriter(f)

	if err := writer.Write(columns); err != nil {
		return err
	}

	values := make([]string, len(columns))
	for _, result := range results.Results {
		for i, col := range columns {
			if v, exists := result[col]; exists {
				values[i] = fmt.Sprintf("%v", v)
			} else {
				values[i] = ""
			}
		}
		if err := writer.Write(values); err != nil {
			return err
		}
	}
	writer.Flush()
	if err = writer.Error(); err != nil {
		return err
	}
	log.Printf("wrote out results file %v", fileName)
	return nil
}
