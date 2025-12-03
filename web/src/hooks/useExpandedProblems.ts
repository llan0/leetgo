import { useState } from "react";
import type { Problem } from "../types";

interface UseExpandedProblemsResult {
  expandedProblems: Set<string>;
  toggleProblem: (title: string) => void;
  toggleAll: (problems: Problem[]) => void;
  isAllExpanded: (problems: Problem[]) => boolean;
}

export function useExpandedProblems(): UseExpandedProblemsResult {
  const [expandedProblems, setExpandedProblems] = useState<Set<string>>(
    new Set()
  );

  const toggleProblem = (title: string) => {
    setExpandedProblems((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const toggleAll = (problems: Problem[]) => {
    const allTitles = new Set(problems.map((p) => p.title));
    const allExpanded = problems.every((p) => expandedProblems.has(p.title));

    if (allExpanded) {
      setExpandedProblems(new Set());
    } else {
      setExpandedProblems(allTitles);
    }
  };

  const isAllExpanded = (problems: Problem[]): boolean => {
    return (
      problems.length > 0 &&
      problems.every((p) => expandedProblems.has(p.title))
    );
  };

  return {
    expandedProblems,
    toggleProblem,
    toggleAll,
    isAllExpanded,
  };
}


