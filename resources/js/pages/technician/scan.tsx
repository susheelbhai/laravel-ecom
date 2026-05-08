import { useState } from 'react';
import { Head, useHttp } from '@inertiajs/react';
import AppLayout from '@/layouts/technician/app-layout';
import ScanCleanResult from '@/components/technician/ScanCleanResult';
import ScanStolenResult from '@/components/technician/ScanStolenResult';
import ScanNotFoundResult from '@/components/technician/ScanNotFoundResult';
import { type BreadcrumbItem } from '@/types';

interface ScanAlert {
    serial_number: string;
    product_name: string | null;
    scanned_at: string;
}

interface ScanResponse {
    is_stolen: boolean;
    alert: ScanAlert | null;
}

type ScanState =
    | { type: 'idle' }
    | { type: 'clean' }
    | { type: 'stolen'; alert: ScanAlert }
    | { type: 'not_found' };

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Scan Serial Number', href: route('technician.scan') },
];

export default function TechnicianScan() {
    const { data, setData, post, processing, errors, reset } = useHttp({
        serial_number: '',
        location: '',
    });

    const [scanState, setScanState] = useState<ScanState>({ type: 'idle' });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setScanState({ type: 'idle' });

        post(route('technician.scan'), {
            onSuccess: (response: unknown) => {
                const res = response as ScanResponse;
                if (res.is_stolen && res.alert) {
                    setScanState({ type: 'stolen', alert: res.alert });
                } else {
                    setScanState({ type: 'clean' });
                }
                reset('serial_number', 'location');
            },
            onHttpException: (response: { status: number }) => {
                if (response.status === 404) {
                    setScanState({ type: 'not_found' });
                } else {
                    setScanState({ type: 'idle' });
                }
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Scan Serial Number" />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <div className="mx-auto w-full max-w-lg">
                    <div className="rounded-div border border-border bg-card p-6 shadow-sm">
                        <h1 className="mb-1 text-xl font-bold text-foreground">
                            Scan Serial Number
                        </h1>
                        <p className="mb-6 text-sm text-muted-foreground">
                            Enter or scan a serial number to check its status.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="serial_number" className="text-sm font-medium text-foreground">
                                    Serial Number{' '}
                                    <span className="text-destructive" aria-hidden="true">*</span>
                                </label>
                                <input
                                    id="serial_number"
                                    type="text"
                                    name="serial_number"
                                    value={data.serial_number}
                                    onChange={(e) => setData('serial_number', e.target.value)}
                                    placeholder="e.g. SN-0001"
                                    autoComplete="off"
                                    autoFocus
                                    required
                                    aria-describedby={errors.serial_number ? 'serial_number_error' : undefined}
                                    className="h-12 rounded-div border border-input bg-background px-4 text-base shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                                {errors.serial_number && (
                                    <p id="serial_number_error" role="alert" className="text-sm text-destructive">
                                        {errors.serial_number}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="location" className="text-sm font-medium text-foreground">
                                    Location{' '}
                                    <span className="text-xs text-muted-foreground">(optional)</span>
                                </label>
                                <input
                                    id="location"
                                    type="text"
                                    name="location"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="e.g. Workshop Bay 3"
                                    autoComplete="off"
                                    className="h-12 rounded-div border border-input bg-background px-4 text-base shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing || !data.serial_number.trim()}
                                className="flex h-12 w-full items-center justify-center rounded-button bg-primary px-6 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Scanning…' : 'Scan'}
                            </button>
                        </form>
                    </div>

                    {scanState.type === 'clean' && (
                        <div className="mt-4"><ScanCleanResult /></div>
                    )}
                    {scanState.type === 'stolen' && (
                        <div className="mt-4"><ScanStolenResult alert={scanState.alert} /></div>
                    )}
                    {scanState.type === 'not_found' && (
                        <div className="mt-4"><ScanNotFoundResult /></div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
