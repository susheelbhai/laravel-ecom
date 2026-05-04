
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/layout/container';

export default function CategoriesSection({ data }: { data: any }) {
    const categories = Array.isArray(data) ? data : Object.values(data ?? {});
    if (categories.length === 0) return null;
    
    return (
        <section className="py-16">
            <Container>
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                        Shop by Categories
                    </h2>
                    <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
                        Explore our wide range of product categories
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {categories.map((category: any, index: number) => (
                        <Link
                            key={index}
                            href={route('product.index', { category: category.slug })}
                            className="group"
                        >
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-6 shadow-md ring-1 ring-border transition-all hover:shadow-lg hover:ring-primary/30">
                                {category.icon ? (
                                    <div className="mb-3 overflow-hidden rounded-xl">
                                        <img
                                            src={category.icon}
                                            alt={category.name}
                                            className="h-14 w-14 object-cover transition-transform group-hover:scale-110"
                                        />
                                    </div>
                                ) : (
                                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-110">
                                        <span className="text-2xl font-bold text-primary">
                                            {category.name?.charAt(0) || '?'}
                                        </span>
                                    </div>
                                )}
                                <h3 className="mb-1 font-semibold text-foreground group-hover:text-primary">
                                    {category.name}
                                </h3>
                                <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
                                    {category.description}
                                </p>
                                <div className="flex items-center text-xs font-medium text-primary">
                                    Explore
                                    <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </Container>
        </section>
    );
}
