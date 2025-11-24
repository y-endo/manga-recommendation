package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"

	_ "github.com/lib/pq"
)

func main() {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL is not set")
	}
	
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("failed to connect DB: %v", err)
	}
	defer db.Close()
	
	seedsDir := "./seeds"
	
	files, err := os.ReadDir(seedsDir)
	if err != nil {
		log.Fatalf("failed to read seeds directory: %v", err)
	}
	
	seedFiles := []string{}
	for _, f := range files {
		if strings.HasSuffix(f.Name(), ".sql") {
			seedFiles = append(seedFiles, f.Name())
		}
	}
	
	sort.Strings(seedFiles)
	
	for _, file := range seedFiles {
		fmt.Println("Executing seed:", file)
		
		content, err := os.ReadFile(filepath.Join(seedsDir, file))
		if err != nil {
			log.Fatalf("failed to read seed file %s: %v", file, err)
		}
		
		tx, err := db.Begin()
		if err != nil {
			log.Fatalf("failed to begin transaction: %v", err)
		}
		
		if _, err := tx.Exec(string(content)); err != nil {
			tx.Rollback()
			log.Fatalf("seed failed (%s): %v", file, err)
		}
		
		if err := tx.Commit(); err != nil {
			log.Fatalf("failed to commit seed: %v", err)
		}
	}
	
	fmt.Println("Seed completed successfully.")
}
