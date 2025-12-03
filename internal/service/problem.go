package service

import "github.com/llan0/leetgo/internal/store"

type ProblemService struct {
	store *store.Storage
}

func NewProblemService(storage *store.Storage) *ProblemService {
	return &ProblemService{
		store: storage,
	}
}

func (s *ProblemService) GetAllProblems() []store.Problem {
	return s.store.Problems.GetAll()
}
