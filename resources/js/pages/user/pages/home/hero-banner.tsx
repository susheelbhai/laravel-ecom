import { Link } from '@inertiajs/react';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/layout/container';

export default function HeroBanner(props: any) {
    const appName = props.data?.appData?.name;
    const bannerImage = props.data?.bannerImage;

    return (
        <section
            id="home"
            className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 md:py-24"
        >
            {bannerImage && (
                <div 
                    className="absolute inset-0 opacity-10 dark:opacity-5"
                    style={{
                        backgroundImage: `url("${bannerImage}")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            )}
            <Container className="relative z-10">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                        <Sparkles className="h-4 w-4" />
                        <span>Welcome to {appName}</span>
                    </div>
                    
                    <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
                        Discover Amazing
                        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> Products</span>
                    </h1>
                    
                    <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
                        Shop the latest trends and find everything you need at unbeatable prices. Quality products, fast delivery, and exceptional service.
                    </p>
                    
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link href={route('product.index')}>
                            <button className="group flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-xl">
                                <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-110" />
                                Shop Now
                            </button>
                        </Link>
                        <Link href={route('product.index')}>
                            <button className="rounded-2xl border-2 border-border bg-card px-8 py-4 font-semibold text-foreground transition-all hover:border-primary hover:bg-card/80">
                                Browse Categories
                            </button>
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}
