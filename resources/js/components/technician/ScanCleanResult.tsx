export default function ScanCleanResult() {
    return (
        <div
            role="status"
            aria-live="polite"
            className="flex flex-col items-center gap-3 rounded-div border-2 border-green-300 bg-green-50 p-6 text-center dark:border-green-700 dark:bg-green-950"
        >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <svg
                    className="h-8 w-8 text-green-600 dark:text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </span>
            <p className="text-xl font-bold text-green-800 dark:text-green-200">
                Serial is clean
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">
                This unit has not been reported stolen.
            </p>
        </div>
    );
}
