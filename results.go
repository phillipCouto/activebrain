package main

import (
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
)

//Results the expected data format from the client
type Results []map[string]interface{}

//StoredResults is the data structure persisted in the database
type StoredResults struct {
	Task    string
	Columns map[string]struct{}
	Results Results
}

//NewStoredResults creates a new StoredResult from a Results object
func NewStoredResults(res Results) StoredResults {
	r := StoredResults{
		Columns: make(map[string]struct{}),
		Results: res,
	}

	for _, v := range res {
		//Scan columns to add any missing
		for k := range v {
			if _, exists := r.Columns[k]; !exists && k != "Task" && k != "task" {
				r.Columns[k] = struct{}{}
			} else if r.Task == "" && (k == "Task" || k == "task") {
				r.Task = v[k].(string)
			}
		}
	}
	return r
}

func (r *StoredResults) writeToDisk(token *AuthToken) error {
	var fileName string
	columns := make([]string, 0, len(r.Columns))

	for k := range r.Columns {
		columns = append(columns, k)
	}

	sort.Strings(columns)

	fileName = fmt.Sprintf("%v-%v-%02d-%v.csv", token.Expiration.Format("20060102T150405"), token.User, token.Num, r.Task)

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
	for _, result := range r.Results {
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
