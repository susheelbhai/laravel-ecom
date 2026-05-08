export default function ScanNotFoundResult() {
    return (
        <div
            role="status"
            aria-live="polite"
            className="flex flex-col items-center gap-3 rounded-div border-2 border-yellow-300 bg-yellow-50 p-6 text-center dark:border-yellow-700 dark:bg-yellow-950"
        >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                <svg
                    className="h-8 w-8 text-yellow-600 dark:text-yellow-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z"
                    />
                </svg>
            </span>
            <p className="text-xl font-bold text-yellow-800 dark:text-yellow-200">
                Serial number not found
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                No unit with that serial number exists in the system.
            </p>
        </div>
    );
}
