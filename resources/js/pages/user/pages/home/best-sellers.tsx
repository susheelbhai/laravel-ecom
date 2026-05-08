
import { Link } from '@inertiajs/react';
import { TrendingUp, Star } from 'lucide-react';
import { Container } from '@/components/ui/layout/container';
import { useFormatMoney } from '@/hooks/use-format-money';
import {
    handleProductImageError,
    PRODUCT_FALLBACK_IMAGE_URL,
} from '@/lib/product-image-fallback';

const FALLBACK_IMAGE = PRODUCT_FALLBACK_IMAGE_URL;

export default function BestSellersSection({ data }: { data: any }) {
    const { formatMoney } = useFormatMoney();
    return (
        <section className="py-16">
            <Container>
                <div className="mb-10 text-center">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary uppercase tracking-wide">
                        <TrendingUp className="h-4 w-4" />
                        Trending
                    </div>
                    <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                        Best Sellers
                    </h2>
                    <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
                        Most popular products loved by our customers
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {data?.map((product: any, index: number) => (
                        <Link
                            key={index}
                            href={route('product.show', product.slug)}
                            className="group"
                        >
                            <div className="overflow-hidden rounded-div bg-card shadow-md ring-1 ring-border transition-all hover:shadow-lg hover:ring-primary/20">
                                <div className="relative overflow-hidden">
                                    <img
                                        src={product.image || FALLBACK_IMAGE}
                                        alt={product.name}
                                        onError={handleProductImageError}
                                        className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <div className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
                                        #{index + 1}
                                    </div>
                                </div>
                                <div className="p-3">
                                    <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary">
                                        {product.name}
                                    </h3>
                                    <div className="mb-2 flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs text-muted-foreground">
                                            4.5
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-primary">
                                        {formatMoney(product.price, {
                                            showDecimals: false,
                                        })}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </Container>
        </section>
    );
}
