interface EmptyStateProps {
    hasActiveFilters: boolean;
    onClearFilters: () => void;
}

export default function EmptyState({
    hasActiveFilters,
    onClearFilters,
}: EmptyStateProps) {
    return (
        <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <span className="text-4xl">🔍</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold">No products found</h3>
            <p className="mb-4 text-muted-foreground">
                Try adjusting your search or filters
            </p>
            {hasActiveFilters && (
                <button
                    onClick={onClearFilters}
                    className="rounded-button bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
                >
                    Clear Filters
                </button>
            )}
        </div>
    );
}
