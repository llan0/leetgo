package api

import (
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/llan0/leetgo/internal/api/handlers"
	"github.com/llan0/leetgo/internal/service"
	"go.uber.org/zap"
)

type Server struct {
	router         *chi.Mux
	problemHandler *handlers.ProblemHandler
	logger         *zap.SugaredLogger
	addr           string
}

type Config struct {
	Addr           string
	ProblemService *service.ProblemService
	Logger         *zap.SugaredLogger
	StaticDir      string // Directory to serve static files from (eg web/dist)
}

func NewServer(cfg Config) *Server {
	router := chi.NewRouter()

	// CORS middleware for development
	router.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get("Origin")
			// Allow localhost for development
			if origin == "http://localhost:3001" || origin == "http://127.0.0.1:3001" {
				w.Header().Set("Access-Control-Allow-Origin", origin)
				w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
				w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
				w.Header().Set("Vary", "Origin")
			}
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}
			next.ServeHTTP(w, r)
		})
	})

	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)

	problemHandler := handlers.NewProblemHandler(cfg.ProblemService, cfg.Logger)

	// API routes (must be registered before static files)
	router.Route("/v1", func(r chi.Router) {
		r.Get("/health", handlers.HealthCheck)
		r.Get("/problems", problemHandler.GetAll)
	})

	// Serve static files if StaticDir is provided (after api routes)
	if cfg.StaticDir != "" {
		if _, err := os.Stat(cfg.StaticDir); err == nil {
			// Serve index.html for root
			router.Get("/", func(w http.ResponseWriter, r *http.Request) {
				indexPath := filepath.Join(cfg.StaticDir, "index.html")
				http.ServeFile(w, r, indexPath)
			})

			// Serve static files
			fs := http.FileServer(http.Dir(cfg.StaticDir))
			router.Handle("/*", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				// Check if file exists, otherwise serve index.html for SPA routing
				filePath := filepath.Join(cfg.StaticDir, r.URL.Path)
				if _, err := os.Stat(filePath); os.IsNotExist(err) {
					// File doesn't exist, serve index.html for clientide routing
					indexPath := filepath.Join(cfg.StaticDir, "index.html")
					http.ServeFile(w, r, indexPath)
					return
				}
				fs.ServeHTTP(w, r)
			}))
		} else {
			cfg.Logger.Warnw("Static directory not found, skipping static file serving", "dir", cfg.StaticDir)
		}
	}

	return &Server{
		router:         router,
		problemHandler: problemHandler,
		logger:         cfg.Logger,
		addr:           cfg.Addr,
	}
}

func (s *Server) Start() error {
	srv := &http.Server{
		Addr:         s.addr,
		Handler:      s.router,
		WriteTimeout: time.Second * 30,
		ReadTimeout:  time.Second * 10,
		IdleTimeout:  time.Minute,
	}
	s.logger.Infow("server has started", "addr", s.addr)
	return srv.ListenAndServe()
}
