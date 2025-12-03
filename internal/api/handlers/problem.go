package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/llan0/leetgo/internal/service"
	"go.uber.org/zap"
)

type ProblemHandler struct {
	problemService *service.ProblemService
	logger         *zap.SugaredLogger
}

func NewProblemHandler(problemService *service.ProblemService, logger *zap.SugaredLogger) *ProblemHandler {
	return &ProblemHandler{
		problemService: problemService,
		logger:         logger,
	}
}

func (h *ProblemHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	problems := h.problemService.GetAllProblems()

	if err := json.NewEncoder(w).Encode(problems); err != nil {
		h.logger.Errorw("Error encoding problems", "error", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}

