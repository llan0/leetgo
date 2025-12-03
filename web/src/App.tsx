import "./index.css";
import { useEffect } from "react";
import { useProblems } from "./hooks/useProblems";
import { useProblemFilters } from "./hooks/useProblemFilters";
import { useExpandedProblems } from "./hooks/useExpandedProblems";
import { ErrorMessage } from "./components/ErrorMessage";
import { LoadingState } from "./components/LoadingState";
import { EmptyState } from "./components/EmptyState";
import { SearchBar } from "./components/SearchBar";
import { SortControls } from "./components/SortControls";
import { ProblemsGrid } from "./components/ProblemsGrid";
import { Pagination } from "./components/Pagination";

export function App() {
  const { problems, loading, error } = useProblems();
  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    filteredAndSortedProblems,
    paginatedProblems,
    totalPages,
  } = useProblemFilters({ problems });

  const {
    expandedProblems,
    toggleProblem,
    toggleAll,
    isAllExpanded,
  } = useExpandedProblems();

  useEffect(() => {
    // Always apply dark mode
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen dark-theme">
      <div className="container">
        {error && <ErrorMessage message={error} />}

        <div className="problems-list-container">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          <SortControls
            sortBy={sortBy}
            onSortChange={setSortBy}
            onToggleAll={() => toggleAll(paginatedProblems)}
            allExpanded={isAllExpanded(paginatedProblems)}
            hasProblems={paginatedProblems.length > 0}
          />

            {loading ? (
            <LoadingState />
            ) : filteredAndSortedProblems.length === 0 ? (
            <EmptyState hasSearchQuery={!!searchQuery} />
            ) : (
              <>
              <ProblemsGrid
                problems={paginatedProblems}
                expandedProblems={expandedProblems}
                onToggleProblem={toggleProblem}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
              </>
            )}
          </div>
      </div>
    </div>
  );
}

export default App;
