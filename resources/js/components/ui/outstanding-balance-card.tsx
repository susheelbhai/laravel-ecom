import { useFormatMoney } from '@/hooks/use-format-money';

interface Props {
    balance: number;
    description?: string;
}

function styles(balance: number) {
    if (balance <= 0) {
        return {
            card: 'border-emerald-200 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/20',
            label: 'text-emerald-700 dark:text-emerald-400',
            amount: 'text-emerald-900 dark:text-emerald-200',
            sub: 'text-emerald-600 dark:text-emerald-400',
        };
    }
    if (balance < 10000) {
        return {
            card: 'border-amber-200 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20',
            label: 'text-amber-700 dark:text-amber-400',
            amount: 'text-amber-900 dark:text-amber-200',
            sub: 'text-amber-600 dark:text-amber-400',
        };
    }
    return {
        card: 'border-rose-200 bg-rose-50 dark:border-rose-700 dark:bg-rose-900/20',
        label: 'text-rose-700 dark:text-rose-400',
        amount: 'text-rose-900 dark:text-rose-200',
        sub: 'text-rose-600 dark:text-rose-400',
    };
}

export default function OutstandingBalanceCard({ balance, description }: Props) {
    const { formatMoney } = useFormatMoney();
    const s = styles(balance);

    return (
        <div className={`rounded-lg border p-5 shadow-sm ${s.card}`}>
            <p className={`text-xs font-semibold uppercase tracking-wide ${s.label}`}>
                Total Outstanding Balance
            </p>
            <p className={`mt-1 text-3xl font-bold ${s.amount}`}>
                {formatMoney(balance)}
            </p>
            {description && (
                <p className={`mt-1 text-xs ${s.sub}`}>{description}</p>
            )}
        </div>
    );
}
