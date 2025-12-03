import type { SortOption } from "../types";

interface SortControlsProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  onToggleAll: () => void;
  allExpanded: boolean;
  hasProblems: boolean;
}

export function SortControls({
  sortBy,
  onSortChange,
  onToggleAll,
  allExpanded,
  hasProblems,
}: SortControlsProps) {
  if (!hasProblems) return null;

  return (
    <div className="accordion-controls">
      <select
        className="sorting-select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
      >
        <option value="title">Title A–Z</option>
        <option value="difficulty">Difficulty</option>
      </select>
      <button type="button" className="toggle-all-btn" onClick={onToggleAll}>
        {allExpanded ? "Collapse All" : "Expand All"}
      </button>
    </div>
  );
}


