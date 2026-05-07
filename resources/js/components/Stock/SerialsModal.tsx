import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/overlay/dialog';
import CopyButton from './CopyButton';

interface SerialsModalProps {
    open: boolean;
    onClose: () => void;
    productTitle: string;
    serials: string[];
    lookupRoute: string;
}

export default function SerialsModal({ open, onClose, productTitle, serials, lookupRoute }: SerialsModalProps) {
    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Serial Numbers</DialogTitle>
                    <p className="text-sm text-muted-foreground">{productTitle}</p>
                </DialogHeader>

                <p className="text-xs text-muted-foreground">
                    {serials.length} available serial{serials.length !== 1 ? 's' : ''}
                </p>

                <ul className="max-h-72 divide-y divide-border overflow-y-auto rounded-lg border border-border">
                    {serials.map((sn) => (
                        <li key={sn} className="flex items-center justify-between px-3 py-2">
                            <a
                                href={`${lookupRoute}?q=${encodeURIComponent(sn)}`}
                                className="font-mono text-sm text-blue-600 hover:underline dark:text-blue-400"
                                onClick={onClose}
                            >
                                {sn}
                            </a>
                            <CopyButton text={sn} className="ml-2" />
                        </li>
                    ))}
                </ul>
            </DialogContent>
        </Dialog>
    );
}
