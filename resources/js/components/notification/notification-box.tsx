export default function NotificationBox({
    unreadNotifications = [],
    handleSeeAll,
}: {
    unreadNotifications?: any[];
    handleSeeAll: () => void;
}) {
    return (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-border bg-card shadow-lg">
            <div className="border-b p-4 font-semibold text-card-foreground">
                Unread Notifications
            </div>
            <ul className="max-h-72 divide-y divide-border overflow-y-auto">
                {(!unreadNotifications || unreadNotifications.length === 0) && (
                    <li className="p-4 text-center text-sm text-muted-foreground">
                        No unread notifications
                    </li>
                )}
                {unreadNotifications &&
                    unreadNotifications.slice(0, 5).map((notification: any) => (
                        <li
                            key={notification.id}
                            className="cursor-pointer p-4 text-sm hover:bg-muted"
                        >
                            <a
                                href={notification.href ?? '#'}
                                className="block"
                            >
                                <div className="font-medium text-card-foreground">
                                    {notification.data?.title ?? 'Notification'}
                                </div>
                                <div className="text-muted-foreground">
                                    {notification.data?.data?.message ?? ''}
                                </div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                    {notification.created_at
                                        ? new Date(
                                              notification.created_at,
                                          ).toLocaleString()
                                        : ''}
                                </div>
                            </a>
                        </li>
                    ))}
            </ul>
            <div className="flex justify-center border-t p-2">
                <button
                    className="cursor-pointer text-sm font-medium text-primary hover:underline"
                    onClick={handleSeeAll}
                >
                    See all notifications
                </button>
            </div>
        </div>
    );
}
