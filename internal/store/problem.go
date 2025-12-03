package store

import (
	"encoding/json"
	"io"
	"log"
	"os"
	"sync"
)

type Problem struct {
	Title      string `json:"title"`
	Topic      string `json:"topic"`
	Difficulty string `json:"difficulty"` // easy, medium, hard
	Markdown   string `json:"markdown"`   // problem description
}

type ProblemsStore struct {
	sync.RWMutex
	problems []Problem
}

// LoadData loads problems from a JSON file into the store
func (ps *ProblemsStore) LoadData(dataPath string) error {
	possiblePaths := []string{
		dataPath,
		"problems.json",
		"cmd/problems.json",
	}

	var file *os.File
	var err error
	var usedPath string

	for _, path := range possiblePaths {
		file, err = os.Open(path)
		if err == nil {
			usedPath = path
			break
		}
	}

	if file == nil {
		// File not found in any location, use dummy data
		log.Printf("Warning: Could not find problems.json in any of: %v. Using dummy data.", possiblePaths)
		ps.Lock()
		ps.problems = []Problem{
			{
				Title:      "Two Sum",
				Topic:      "Arrays",
				Difficulty: "Easy",
				Markdown:   "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\n```go\n\nfunc twoSum(nums []int, target int) []int {\n    // code here\n}\n```",
			},
		}
		ps.Unlock()
		return nil
	}
	defer file.Close()

	bytes, err := io.ReadAll(file)
	if err != nil {
		return err
	}

	// Try to unmarshal as array first
	var problemsArray []Problem
	if err := json.Unmarshal(bytes, &problemsArray); err == nil && len(problemsArray) > 0 {
		ps.Lock()
		ps.problems = problemsArray
		ps.Unlock()
		log.Printf("✅ Loaded %d problems from %s", len(ps.problems), usedPath)
		return nil
	}

	var data struct {
		Problems []Problem `json:"problems"`
	}
	if err := json.Unmarshal(bytes, &data); err != nil {
		return err
	}
	ps.Lock()
	ps.problems = data.Problems
	ps.Unlock()
	log.Printf("✅ Loaded %d problems from %s", len(ps.problems), usedPath)
	return nil
}

// GetAll returns all problems thread-safe
func (ps *ProblemsStore) GetAll() []Problem {
	ps.RLock()
	defer ps.RUnlock()

	// Return a copy to prevent external modifications
	result := make([]Problem, len(ps.problems))
	copy(result, ps.problems)
	return result
}
