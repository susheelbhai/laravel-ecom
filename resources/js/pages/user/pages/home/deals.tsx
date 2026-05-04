import { Link } from '@inertiajs/react';
import { Clock, TrendingUp } from 'lucide-react';
import { Container } from '@/components/ui/layout/container';
import { useFormatMoney } from '@/hooks/use-format-money';
import {
    handleProductImageError,
    PRODUCT_FALLBACK_IMAGE_URL,
} from '@/lib/product-image-fallback';

const FALLBACK_IMAGE = PRODUCT_FALLBACK_IMAGE_URL;

export default function DealsSection({ data }: { data: any }) {
    const { formatMoney } = useFormatMoney();
    
    if (!data || data.length === 0) return null;

    return (
        <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16">
            <Container>
                <div className="mb-10 text-center">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary uppercase tracking-wide">
                        <TrendingUp className="h-4 w-4" />
                        Hot Deals
                    </div>
                    <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                        Limited Time Offers
                    </h2>
                    <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
                        Don't miss out on these amazing deals - grab them before they're gone!
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {data?.slice(0, 3).map((product: any, index: number) => (
                        <Link
                            key={index}
                            href={route('product.show', product.slug)}
                            className="group"
                        >
                            <div className="overflow-hidden rounded-2xl bg-card shadow-lg ring-1 ring-border transition-all hover:shadow-xl hover:ring-primary/20">
                                <div className="relative overflow-hidden">
                                    <img
                                        src={product.image || FALLBACK_IMAGE}
                                        alt={product.name}
                                        onError={handleProductImageError}
                                        className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                                        <Clock className="h-3 w-3" />
                                        Limited
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-foreground group-hover:text-primary">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-bold text-primary">
                                                {formatMoney(product.price, {
                                                    showDecimals: false,
                                                })}
                                            </p>
                                        </div>
                                        <button className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105">
                                            Shop Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </Container>
        </section>
    );
}
