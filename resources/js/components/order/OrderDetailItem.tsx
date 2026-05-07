interface Props {
    label: string;
    children: React.ReactNode;
}

export default function OrderDetailItem({ label, children }: Props) {
    return (
        <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
            </dt>
            <dd className="mt-1 text-sm font-medium text-foreground">{children}</dd>
        </div>
    );
}
