import { router, useForm } from '@inertiajs/react';
import { type SerialNumberData, type Movement } from './types';
import SerialNumberCard from './SerialNumberCard';
import MovementTimeline from './MovementTimeline';

interface Props {
    serialNumber: SerialNumberData | null;
    movements: Movement[];
    currentQuery: string;
    lookupUrl: string;
    markStolenUrl: string | null;
    markDamagedUrl: string | null;
}

export default function SerialNumberLookup({
    serialNumber,
    movements,
    currentQuery,
    lookupUrl,
    markStolenUrl,
    markDamagedUrl,
}: Props) {
    const searchForm = useForm({ q: currentQuery });
    const stolenForm = useForm<{ notes: string }>({ notes: '' });
    const damagedForm = useForm<{ notes: string }>({ notes: '' });

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get(lookupUrl, { q: searchForm.data.q }, { preserveState: false });
    }

    function handleMarkStolen() {
        if (!markStolenUrl) return;
        stolenForm.post(markStolenUrl);
    }

    function handleMarkDamaged() {
        if (!markDamagedUrl) return;
        damagedForm.post(markDamagedUrl);
    }

    const isProcessing = stolenForm.processing || damagedForm.processing;

    return (
        <div className="flex flex-col gap-6">
            {/* Search form */}
            <div className="rounded-div border border-border bg-card p-6 shadow-sm">
                <h1 className="mb-4 text-lg font-semibold text-foreground">Serial Number Lookup</h1>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        name="q"
                        value={searchForm.data.q}
                        onChange={(e) => searchForm.setData('q', e.target.value)}
                        placeholder="Enter serial number (e.g. SN-0001)"
                        className="flex-1 rounded-div border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button
                        type="submit"
                        disabled={searchForm.processing}
                        className="inline-flex items-center rounded-button bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none disabled:opacity-50"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Results */}
            {currentQuery !== '' && (
                <>
                    {serialNumber ? (
                        <>
                            <SerialNumberCard
                                serialNumber={serialNumber}
                                onMarkStolen={handleMarkStolen}
                                onMarkDamaged={handleMarkDamaged}
                                processing={isProcessing}
                            />
                            <MovementTimeline movements={movements} />
                        </>
                    ) : (
                        <div className="rounded-div border border-border bg-card p-6 shadow-sm">
                            <p className="text-sm text-muted-foreground">
                                No serial number found for{' '}
                                <span className="font-medium text-foreground">
                                    &ldquo;{currentQuery}&rdquo;
                                </span>
                                .
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
