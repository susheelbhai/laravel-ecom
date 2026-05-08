import { Search, Filter } from 'lucide-react';

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    onSearch: () => void;
    showFilters: boolean;
    setShowFilters: (value: boolean) => void;
    hasActiveFilters: boolean;
}

export default function SearchBar({
    searchQuery,
    setSearchQuery,
    onSearch,
    showFilters,
    setShowFilters,
    hasActiveFilters,
}: SearchBarProps) {
    return (
        <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search products by name, description, SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                    className="w-full rounded-div border border-border bg-card py-3 pr-4 pl-12 text-foreground transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
            </div>
            <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 rounded-button border border-border bg-card px-6 py-3 transition-colors hover:bg-muted"
            >
                <Filter className="h-5 w-5" />
                <span className="font-medium">Filters</span>
                {hasActiveFilters && (
                    <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                        Active
                    </span>
                )}
            </button>
            <button
                onClick={onSearch}
                className="rounded-button bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
                Search
            </button>
        </div>
    );
}
