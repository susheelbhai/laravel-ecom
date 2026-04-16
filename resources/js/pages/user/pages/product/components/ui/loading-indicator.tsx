export default function LoadingIndicator() {
    return (
        <div className="flex justify-center py-8">
            <div className="flex items-center gap-3 text-muted-foreground">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span className="text-sm font-medium">
                    Loading more products...
                </span>
            </div>
        </div>
    );
}
