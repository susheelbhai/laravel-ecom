import { type Movement } from './types';

const EVENT_TYPE_LABELS: Record<string, string> = {
    stock_in: 'Stock In',
    distributor_order: 'Distributor Order',
    dealer_order: 'Dealer Order',
    retail_sale: 'Retail Sale',
    stolen: 'Marked Stolen',
    damaged: 'Marked Damaged',
    rack_transfer: 'Rack Transfer',
};

const EVENT_TYPE_COLORS: Record<string, string> = {
    stock_in: 'bg-green-500',
    distributor_order: 'bg-blue-500',
    dealer_order: 'bg-indigo-500',
    retail_sale: 'bg-purple-500',
    stolen: 'bg-red-500',
    damaged: 'bg-orange-500',
    rack_transfer: 'bg-gray-400',
};

export default function MovementTimeline({ movements }: { movements: Movement[] }) {
    if (movements.length === 0) {
        return (
            <div className="rounded-div border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-2 text-base font-semibold text-foreground">Movement History</h3>
                <p className="text-sm text-muted-foreground">No movements recorded.</p>
            </div>
        );
    }

    return (
        <div className="rounded-div border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-foreground">Movement History</h3>
            <ol className="relative border-l border-border">
                {movements.map((movement, index) => {
                    const dotColor = EVENT_TYPE_COLORS[movement.event_type] ?? 'bg-gray-400';
                    const label = EVENT_TYPE_LABELS[movement.event_type] ?? movement.event_type;

                    return (
                        <li key={movement.id ?? index} className="mb-6 ml-4 last:mb-0">
                            <span
                                className={`absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-background ${dotColor}`}
                            />
                            <div className="flex flex-wrap items-baseline gap-x-2">
                                <span className="text-sm font-semibold text-foreground">{label}</span>
                                <time className="text-xs text-muted-foreground">{movement.occurred_at}</time>
                            </div>
                            <div className="mt-1 space-y-0.5 text-sm text-muted-foreground">
                                {movement.from_party && (
                                    <p>
                                        <span className="font-medium text-foreground">From:</span> {movement.from_party}
                                    </p>
                                )}
                                {movement.to_party && (
                                    <p>
                                        <span className="font-medium text-foreground">To:</span> {movement.to_party}
                                    </p>
                                )}
                                {movement.actor_label && (
                                    <p>
                                        <span className="font-medium text-foreground">Actor:</span> {movement.actor_label}
                                    </p>
                                )}
                                {movement.notes && <p className="italic">{movement.notes}</p>}
                            </div>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}
