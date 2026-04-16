export function NotificationIcon({
    setDropdownOpen,
    unreadNotificationsCount,
}: {
    setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    unreadNotificationsCount: number;
}) {
    return (
        <button
            className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-background2 focus:outline-none"
            aria-label="Notifications"
            onClick={() => setDropdownOpen((open) => !open)}
        >
            {/* Bell icon (Heroicons outline bell) */}
            <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a3.001 3.001 0 01-5.714 0M6.5 8.25a5.25 5.25 0 1111 0c0 1.172.26 2.318.764 3.338.37.76.736 1.53.736 2.162 0 1.386-1.014 2.25-2.25 2.25H7.25c-1.236 0-2.25-.864-2.25-2.25 0-.632.366-1.402.736-2.162A8.96 8.96 0 006.5 8.25z"
                />
            </svg>
            {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[1.25rem] rounded-full bg-red-500 px-1.5 text-center text-xs font-bold text-white">
                    {unreadNotificationsCount}
                </span>
            )}
        </button>
    );
}
