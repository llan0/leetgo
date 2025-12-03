interface EmptyStateProps {
  hasSearchQuery: boolean;
}

export function EmptyState({ hasSearchQuery }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <p className="empty-state-text">
        {hasSearchQuery
          ? "No problems found matching your search."
          : "No problems yet."}
      </p>
    </div>
  );
}


