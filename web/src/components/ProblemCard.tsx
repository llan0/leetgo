import React from "react";
import ReactMarkdown from "react-markdown";
import type { Problem } from "../types";
import { getDifficultyClass, cleanMarkdown } from "../utils/helpers";

interface ProblemCardProps {
  problem: Problem;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ProblemCard({
  problem,
  isExpanded,
  onToggle,
}: ProblemCardProps) {
  return (
    <div
      className={`problem-card ${isExpanded ? "expanded" : ""}`}
      onClick={onToggle}
    >
      <div className="problem-card-header">
        <h3 className="problem-card-title">{problem.title}</h3>
        <span className="problem-card-topic">{problem.topic || "—"}</span>
        <span
          className={`problem-card-difficulty ${getDifficultyClass(
            problem.difficulty
          )}`}
        >
          {problem.difficulty}
        </span>
      </div>
      {isExpanded && problem.markdown && (
        <div className="problem-card-content">
          <div className="problem-markdown">
            <ReactMarkdown
              components={{
                h1: () => null,
              }}
            >
              {cleanMarkdown(problem.markdown)}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}


