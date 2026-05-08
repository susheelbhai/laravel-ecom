import { Link } from '@inertiajs/react';
import { Star, ShoppingCart } from 'lucide-react';
import { Container } from '@/components/ui/layout/container';
import { useFormatMoney } from '@/hooks/use-format-money';
import {
    handleProductImageError,
    PRODUCT_FALLBACK_IMAGE_URL,
} from '@/lib/product-image-fallback';

const FALLBACK_IMAGE = PRODUCT_FALLBACK_IMAGE_URL;

export default function FeaturedProductsSection({ data }: { data: any }) {
    const { formatMoney } = useFormatMoney();
    return (
        <section className="bg-muted/30 py-16 dark:bg-muted/10">
            <Container>
                <div className="mb-10 text-center">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary uppercase tracking-wide">
                        <Star className="h-4 w-4 fill-primary" />
                        Featured
                    </div>
                    <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                        Featured Products
                    </h2>
                    <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
                        Hand-picked products just for you
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {data?.map((product: any, index: number) => (
                        <Link
                            key={index}
                            href={route('product.show', product.slug)}
                            className="group"
                        >
                            <div className="overflow-hidden rounded-div bg-card shadow-md ring-1 ring-border transition-all hover:shadow-xl hover:ring-primary/20">
                                <div className="relative overflow-hidden">
                                    <img
                                        src={product.image || FALLBACK_IMAGE}
                                        alt={product.name}
                                        onError={handleProductImageError}
                                        className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="mb-2 line-clamp-2 font-semibold text-foreground group-hover:text-primary">
                                        {product.name}
                                    </h3>
                                    <div className="mb-3 flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                            />
                                        ))}
                                        <span className="ml-1 text-xs text-muted-foreground">
                                            (4.5)
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xl font-bold text-primary">
                                            {formatMoney(product.price, {
                                                showDecimals: false,
                                            })}
                                        </p>
                                        <button className="flex h-9 w-9 items-center justify-center rounded-button bg-primary/10 text-primary transition-all hover:bg-primary hover:text-primary-foreground">
                                            <ShoppingCart className="h-4 w-4" />
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
