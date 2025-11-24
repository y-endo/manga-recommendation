package db

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"sort"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Seeder struct {
	Pool *pgxpool.Pool
}

func NewSeeder(pool *pgxpool.Pool) *Seeder {
	return &Seeder{Pool: pool}
}

func (s *Seeder) Run(ctx context.Context, seedDir string) error {
	files, err := os.ReadDir(seedDir)
	if err != nil {
		return fmt.Errorf("failed to read seed directory: %w", err)
	}
	
	// SQL を昇順で実行 (001 → 002 …)
	sort.Slice(files, func(i, j int) bool {
		return files[i].Name() < files[j].Name()
	})
	
	for _, f := range files {
		if f.IsDir() || filepath.Ext(f.Name()) != ".sql" {
			continue
		}
		
		path := filepath.Join(seedDir, f.Name())
		sqlBytes, err := os.ReadFile(path)
		if err != nil {
			return fmt.Errorf("failed to read %s: %w", f.Name(), err)
		}
		
		fmt.Printf("▶ Executing seed: %s\n", f.Name())
		
		_, err = s.Pool.Exec(ctx, string(sqlBytes))
		if err != nil {
			return fmt.Errorf("failed to execute %s: %w", f.Name(), err)
		}
		
		fmt.Printf("Done: %s\n", f.Name())
	}
	
	fmt.Println("All seed files executed successfully.")
	return nil
}
