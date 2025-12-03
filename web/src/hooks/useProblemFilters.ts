import { useState, useMemo } from "react";
import type { Problem, SortOption } from "../types";
import { filterAndSortProblems } from "../utils/helpers";

interface UseProblemFiltersProps {
  problems: Problem[];
  problemsPerPage?: number;
}

interface UseProblemFiltersResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: SortOption;
  setSortBy: (sortBy: SortOption) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  filteredAndSortedProblems: Problem[];
  paginatedProblems: Problem[];
  totalPages: number;
}

export function useProblemFilters({
  problems,
  problemsPerPage = 16,
}: UseProblemFiltersProps): UseProblemFiltersResult {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("difficulty");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredAndSortedProblems = useMemo(
    () => filterAndSortProblems(problems, searchQuery, sortBy),
    [problems, searchQuery, sortBy]
  );

  const totalPages = Math.ceil(
    filteredAndSortedProblems.length / problemsPerPage
  );

  const paginatedProblems = useMemo(() => {
    const startIndex = (currentPage - 1) * problemsPerPage;
    const endIndex = startIndex + problemsPerPage;
    return filteredAndSortedProblems.slice(startIndex, endIndex);
  }, [filteredAndSortedProblems, currentPage, problemsPerPage]);

  // Reset to page 1 when search or sort changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  return {
    searchQuery,
    setSearchQuery: handleSearchChange,
    sortBy,
    setSortBy: handleSortChange,
    currentPage,
    setCurrentPage,
    filteredAndSortedProblems,
    paginatedProblems,
    totalPages,
  };
}


