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

	server := api.NewServer(api.Config{
		Addr:           env.GetString("ADDR", ":3000"),
		ProblemService: problemService,
		Logger:         logger,
		StaticDir:      env.GetString("STATIC_DIR", "web/dist"), // serve frontend in prod
	})

	logger.Fatal(server.Start())
}
