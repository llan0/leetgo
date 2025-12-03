import type { Problem } from "../types";
import { ProblemCard } from "./ProblemCard";

interface ProblemsGridProps {
  problems: Problem[];
  expandedProblems: Set<string>;
  onToggleProblem: (title: string) => void;
}

export function ProblemsGrid({
  problems,
  expandedProblems,
  onToggleProblem,
}: ProblemsGridProps) {
  return (
    <div className="problems-grid">
      {problems.map((problem) => (
        <ProblemCard
          key={problem.title}
          problem={problem}
          isExpanded={expandedProblems.has(problem.title)}
          onToggle={() => onToggleProblem(problem.title)}
        />
      ))}
    </div>
  );
}


