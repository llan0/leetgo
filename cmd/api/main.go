package main

import (
	"github.com/llan0/leetgo/internal/api"
	"github.com/llan0/leetgo/internal/env"
	"github.com/llan0/leetgo/internal/service"
	"github.com/llan0/leetgo/internal/store"
	"go.uber.org/zap"
)

func main() {
	logger := zap.Must(zap.NewProduction()).Sugar()
	defer logger.Sync()

	storage := store.NewStorage()
	dataPath := env.GetString("PROBLEMS_DATA_PATH", "problems.json")
	if err := storage.Problems.LoadData(dataPath); err != nil {
		logger.Warnw("Failed to load problems data", "error", err)
	}

	problemService := service.NewProblemService(storage)

	// Railway provides PORT env var, use it if available
	// Otherwise fallback to ADDR or default to :3000
	port := env.GetString("PORT", "")
	if port == "" {
		addr := env.GetString("ADDR", ":3000")
		// If ADDR already has format, use it; otherwise prepend :
		if addr[0] == ':' {
			port = addr[1:] // Remove leading :
		} else {
			port = addr
		}
	}
	// Railway requires binding to 0.0.0.0, not localhost
	addr := "0.0.0.0:" + port

	server := api.NewServer(api.Config{
		Addr:           addr,
		ProblemService: problemService,
		Logger:         logger,
		StaticDir:      env.GetString("STATIC_DIR", "web/dist"), // serve frontend in prod
	})

	logger.Fatal(server.Start())
}
