import type { Problem, SortOption } from "../types";

/**
 * Get CSS class for difficulty tag
 */
export function getDifficultyClass(difficulty: string): string {
  switch (difficulty) {
    case "Easy":
      return "difficulty-tag difficulty-easy";
    case "Medium":
      return "difficulty-tag difficulty-medium";
    case "Hard":
      return "difficulty-tag difficulty-hard";
    default:
      return "difficulty-tag";
  }
}

/**
 * Filter and sort problems based on search query and sort option
 */
export function filterAndSortProblems(
  problems: Problem[],
  searchQuery: string,
  sortBy: SortOption
): Problem[] {
  // Filter by search query
  let filtered = problems;
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = problems.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.topic.toLowerCase().includes(query) ||
        p.difficulty.toLowerCase().includes(query)
    );
  }

  // Sort
  const arr = [...filtered];
  arr.sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "difficulty": {
        const order: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3 };
        const aVal = order[a.difficulty] ?? 99;
        const bVal = order[b.difficulty] ?? 99;
        return aVal - bVal || a.title.localeCompare(b.title);
      }
      default:
        return 0;
    }
  });
  return arr;
}

/**
 * Clean markdown content by removing placeholder code blocks and duplicate headings
 */
export function cleanMarkdown(markdown: string): string {
  // Remove code blocks that contain "Your implementation here" or similar
  let cleaned = markdown.replace(/```[\s\S]*?```/g, (match) => {
    const lowerMatch = match.toLowerCase();
    if (
      lowerMatch.includes("your implementation") ||
      lowerMatch.includes("implementation here") ||
      lowerMatch.includes("code here")
    ) {
      return "";
    }
    return match;
  });

  // Remove the first h1 heading (duplicate of card title)
  cleaned = cleaned.replace(/^#\s+.*$/m, "").trim();

  return cleaned;
}


