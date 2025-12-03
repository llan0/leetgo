package store

type Storage struct {
	Problems *ProblemsStore
}

func NewStorage() *Storage {
	return &Storage{
		Problems: &ProblemsStore{},
	}
}
