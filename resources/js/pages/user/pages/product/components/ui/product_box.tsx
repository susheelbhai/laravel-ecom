import { Link } from '@inertiajs/react';
import AverageRating from '@/components/review/AverageRating';
import { useFormatMoney } from '@/hooks/use-format-money';

const FALLBACK_IMAGE = '/images/no-image.svg';

interface ProductSectionProps {
    products: any[];
    /** When products are paginated, total catalog count for this view */
    totalAvailable?: number;
}

export default function ProductSection({
    products,
    totalAvailable,
}: ProductSectionProps) {
    const { formatMoney } = useFormatMoney();
    const hasProducts = Array.isArray(products) && products.length > 0;
    const displayTotal =
        typeof totalAvailable === 'number' ? totalAvailable : products.length;

    return (
        <div className="relative">
            <div className="absolute top-0 left-1/2 h-1 w-32 -translate-x-1/2 rounded-full bg-linear-to-r from-transparent via-primary to-transparent"></div>
            <div className="mb-10 pt-10 text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-secondary/10 to-secondary/5 px-4 py-1.5 text-xs font-bold tracking-widest text-secondary uppercase">
                    Featured
                </div>
                <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                    All Products
                </h2>
                <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
                    Discover our complete collection of premium products and
                    solutions
                </p>
                {hasProducts && (
                    <p className="mt-4 text-sm font-semibold text-muted-foreground">
                        {displayTotal}{' '}
                        {displayTotal > 1 ? 'Products' : 'Product'} Available
                    </p>
                )}
            </div>
            {!hasProducts ? (
                <div className="rounded-3xl border-2 border-dashed border-border bg-linear-to-br from-card to-muted px-8 py-16 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <span className="text-3xl">🎯</span>
                    </div>
                    <p className="mb-2 text-lg font-semibold text-foreground">
                        No products available yet
                    </p>
                    <p className="mx-auto max-w-md text-sm text-muted-foreground">
                        Explore categories above or check back soon for new
                        additions
                    </p>
                </div>
            ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((item: any) => {
                        const title = item.title ?? item.name;
                        const description =
                            item.short_description ?? item.description;
                        const image = item.thumbnail ?? item.image ?? null;
                        return (
                            <Link
                                key={item.id}
                                href={route('product.show', item.slug)}
                                className="group block"
                            >
                                <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/50 bg-card shadow-lg transition-all duration-500 hover:-translate-y-3 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
                                    <div className="relative h-56 w-full overflow-hidden bg-muted">
                                        <div className="absolute inset-0 z-10 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                                        <img
                                            src={image || FALLBACK_IMAGE}
                                            alt={title}
                                            onError={(e) => {
                                                e.currentTarget.src = FALLBACK_IMAGE;
                                            }}
                                            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                                            loading="lazy"
                                        />
                                        {item.category && (
                                            <div className="absolute top-4 left-4 z-20">
                                                <span className="inline-flex items-center rounded-full bg-card/95 px-3 py-1 text-xs font-bold tracking-wide text-foreground uppercase shadow-lg backdrop-blur-sm">
                                                    {item.category.title ??
                                                        item.category.name ??
                                                        'Category'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col p-6">
                                        <h3 className="mb-3 line-clamp-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                                            {title}
                                        </h3>
                                        <div className="flex-1">
                                            {description && (
                                                <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                                                    {description}
                                                </p>
                                            )}
                                            {item.average_rating !== undefined && (
                                                <div className="mb-4">
                                                    <AverageRating
                                                        averageRating={item.average_rating}
                                                        reviewCount={item.review_count}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-2 flex items-center justify-between border-t border-border pt-4">
                                            {item.price && (
                                                <div>
                                                    <p className="mb-0.5 text-xs text-muted-foreground">
                                                        Starting at
                                                    </p>
                                                    <p className="text-xl font-bold text-foreground">
                                                        {formatMoney(
                                                            item.price,
                                                            {
                                                                showDecimals: false,
                                                            },
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                            <div className="inline-flex translate-x-0 items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition-all duration-300 group-hover:translate-x-1 group-hover:bg-primary group-hover:text-primary-foreground">
                                                <span>Details</span>
                                                <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                                                    →
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
