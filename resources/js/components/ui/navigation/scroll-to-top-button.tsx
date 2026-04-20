import React, { useEffect, useMemo, useState } from "react";

export type ScrollToTopVariant = "pie" | "ring" | "arrow";

type Props = {
    /** `pie` = scroll progress as a filled wedge; `ring` = progress on border stroke; `arrow` = plain circular button with ↑ */
    variant?: ScrollToTopVariant;
    /** Show button only after this percent of page scroll (0-100). Default: 5 */
    showAfterPercent?: number;
    /** Extra classes on the outer button (position is fixed bottom-right unless overridden) */
    className?: string;
};

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

export function ScrollToTopButton({ variant = "ring", showAfterPercent = 5, className }: Props) {
    const [scrollPercent, setScrollPercent] = useState(0);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const onScroll = () => {
            const scrollTop = window.scrollY ?? 0;
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const pct = scrollable <= 0 ? 0 : (scrollTop / scrollable) * 100;
            setScrollPercent(clamp(pct, 0, 100));
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const show = scrollPercent > showAfterPercent;

    const angle = clamp((scrollPercent / 100) * 360, 0, 359.999);
    const sectorPath = useMemo(() => {
        if (variant !== "pie" || angle <= 0) return null;
        const cx = 24;
        const cy = 24;
        const r = 20;
        const theta = (angle * Math.PI) / 180;
        const x = cx + r * Math.sin(theta);
        const y = cy - r * Math.cos(theta);
        const largeArc = angle > 180 ? 1 : 0;
        return `M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${largeArc} 1 ${x} ${y} Z`;
    }, [angle, variant]);

    const ring = useMemo(() => {
        const r = 20;
        const c = 2 * Math.PI * r;
        const pct = clamp(scrollPercent, 0, 100) / 100;
        return {
            r,
            c,
            dashoffset: (1 - pct) * c,
        };
    }, [scrollPercent]);

    if (!show) return null;

    if (variant === "arrow") {
        return (
            <button
                type="button"
                aria-label="Back to top"
                className={[
                    "fixed bottom-4 right-4 z-50 inline-flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-2 ring-secondary ring-offset-2 ring-offset-background transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    className ?? "",
                ].join(" ")}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
                <span className="text-2xl font-semibold leading-none">↑</span>
            </button>
        );
    }

    if (variant === "ring") {
        return (
            <button
                type="button"
                aria-label={`Back to top (${Math.round(scrollPercent)}% scrolled)`}
                className={[
                    "fixed bottom-4 right-4 z-50 inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full shadow-lg ring-1 ring-border transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring",
                    className ?? "",
                ].join(" ")}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
                <span className="relative inline-flex h-full w-full items-center justify-center rounded-full bg-background text-primary">
                    <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
                        <circle
                            cx="24"
                            cy="24"
                            r={ring.r}
                            fill="none"
                            stroke="var(--secondary)"
                            strokeOpacity={0.35}
                            strokeWidth="4"
                        />
                        <circle
                            cx="24"
                            cy="24"
                            r={ring.r}
                            fill="none"
                            stroke="var(--primary)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={ring.c}
                            strokeDashoffset={ring.dashoffset}
                        />
                    </svg>
                    <span className="relative z-10 text-xl font-semibold leading-none">↑</span>
                </span>
            </button>
        );
    }

    return (
        <button
            type="button"
            aria-label={`Back to top (${Math.round(scrollPercent)}% scrolled)`}
            className={[
                "fixed bottom-4 right-4 z-50 inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full shadow-lg ring-1 ring-border transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring",
                className ?? "",
            ].join(" ")}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
            <span className="relative inline-flex h-full w-full items-center justify-center rounded-full bg-background">
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
                    <circle cx="24" cy="24" r="20" fill="var(--secondary)" fillOpacity={0.35} />
                    {sectorPath && <path d={sectorPath} fill="var(--primary)" fillOpacity={1} />}
                </svg>
                <span className="relative z-10 text-xl font-semibold leading-none text-white">↑</span>
            </span>
        </button>
    );
}
