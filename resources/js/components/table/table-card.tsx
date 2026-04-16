export default function TableCard({
    children,
    className,
}: {
    children?: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`flex h-full flex-1 flex-col gap-4 rounded-xl px-4 pt-4 ${className}`}
        >
            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                <div className="">
                    <div className="overflow-x-auto">{children}</div>
                </div>
            </div>
        </div>
    );
}
