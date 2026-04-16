interface THeadProps {
    className: string;
    title: string;
    colSpan?: number;
}

export default function THead({
    children,
    data,
}: {
    children?: React.ReactNode;
    data?: THeadProps[];
}) {
    return (
        <thead className="border-b border-border bg-table-header text-left text-foreground">
            <tr>
                {data?.map((item, index) => (
                    <th
                        key={index}
                        className={item.className}
                        colSpan={item.colSpan}
                    >
                        {item.title}
                    </th>
                ))}
                {children}
            </tr>
        </thead>
    );
}
