import { type ReactNode } from 'react';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';

interface PersonCardProps {
    /** Primary name displayed prominently */
    name: string;
    /** Email address */
    email: string;
    /** Phone number */
    phone?: string | null;
    /** Application status — drives the badge colour */
    status: string;
    /** Date string (formatted) */
    date?: string | null;
    /** Optional secondary label shown below the name (e.g. legal business name) */
    subtitle?: string | null;
    /** Optional meta line shown below subtitle (e.g. GSTIN, distributor name) */
    meta?: string | null;
    /** Optional rejection note shown when status is rejected */
    rejectionNote?: string | null;
    /** Optional link to a detail page */
    href?: string;
    /** Action buttons rendered in the card footer */
    actions?: ReactNode;
}

export default function PersonCard({
    name,
    email,
    phone,
    status,
    date,
    subtitle,
    meta,
    rejectionNote,
    href,
    actions,
}: PersonCardProps) {
    return (
        <div className="flex flex-col rounded-div border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
            {/* Card body */}
            <div className="flex flex-1 flex-col gap-3 p-4">
                {/* Name + status */}
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        {href ? (
                            <a
                                href={href}
                                className="block truncate font-semibold text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
                            >
                                {name}
                            </a>
                        ) : (
                            <p className="truncate font-semibold text-gray-900 dark:text-gray-100">
                                {name}
                            </p>
                        )}
                        {subtitle && (
                            <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <OrderStatusBadge status={status} />
                </div>

                {/* Contact details */}
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1.5 truncate">
                        <svg className="h-3.5 w-3.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{email}</span>
                    </div>
                    {phone && (
                        <div className="flex items-center gap-1.5">
                            <svg className="h-3.5 w-3.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>{phone}</span>
                        </div>
                    )}
                    {meta && (
                        <div className="flex items-center gap-1.5">
                            <svg className="h-3.5 w-3.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span className="font-mono text-xs">{meta}</span>
                        </div>
                    )}
                    {date && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                            <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{date}</span>
                        </div>
                    )}
                </div>

                {/* Rejection note */}
                {rejectionNote && status === 'rejected' && (
                    <p className="rounded-div bg-rose-50 px-2.5 py-1.5 text-xs text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">
                        {rejectionNote}
                    </p>
                )}
            </div>

            {/* Card footer — actions */}
            {actions && (
                <div className="flex items-center gap-2 border-t border-gray-100 px-4 py-3 dark:border-gray-800">
                    {actions}
                </div>
            )}
        </div>
    );
}
