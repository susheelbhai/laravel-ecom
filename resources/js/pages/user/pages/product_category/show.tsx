import { usePage } from '@inertiajs/react';
import { Container } from '@/components/ui/layout/container';

import Pagination from '@/components/table/pagination';
import AppLayout from '@/layouts/user/app-layout';
import ProductDescription from '../product/components/product-info/product-description';
import ProductSection from '../product/components/ui/product_box';

export default function ProductCategoryShow() {
    const data = usePage().props.data as any;
    // data: { id, title, description, icon, image, products: [] | Laravel paginator }
    const category = data;
    const productsRaw = category.products;
    const isPaginated =
        productsRaw &&
        typeof productsRaw === 'object' &&
        !Array.isArray(productsRaw) &&
        Array.isArray(productsRaw.data);
    const products = isPaginated
        ? productsRaw.data
        : (productsRaw ?? []);
    const productsPagination = isPaginated ? productsRaw : null;

    return (
        <AppLayout>
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">
                {/* Banner */}
                <section className="relative mb-8 flex h-72 w-full items-center justify-center overflow-hidden md:h-80">
                    <div
                        className="absolute inset-0 scale-105 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('${category.image || '/images/products-banner.jpg'}')`,
                        }}
                    />
                    <div className="absolute inset-0 bg-linear-to-br from-primary/90 via-secondary/80 to-primary/70" />
                    <div className="absolute inset-0 backdrop-blur-[2px]" />
                    <div className="relative z-10 flex h-full items-center justify-center px-4">
                        <div className="flex w-full max-w-5xl flex-row items-center justify-center gap-8">
                            {/* Icon left */}
                            {category.icon && (
                                <div className="hidden h-32 w-32 items-center justify-center overflow-hidden rounded-2xl bg-white/80 shadow-lg md:flex">
                                    <img
                                        src={category.icon}
                                        alt={category.title}
                                        className="object-contain"
                                    />
                                </div>
                            )}
                            {/* Title & Description right */}
                            <div className="flex-1 space-y-4 text-left">
                                <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-2xl md:text-5xl">
                                    {category.title}
                                </h1>
                                {category.description && (
                                    <p className="max-w-2xl text-base leading-relaxed font-medium text-white/95 drop-shadow-lg md:text-lg">
                                        {category.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="absolute right-0 bottom-0 left-0 h-16 bg-linear-to-t from-slate-50/50 to-transparent"></div>
                </section>

                {/* Category Description (optional) */}
                {category.short_description && (
                    <Container className="mb-10">
                        <ProductDescription
                            shortDescription={category.short_description}
                        />
                    </Container>
                )}

                {/* Products List */}
                <Container className="py-8 md:py-12">
                    <ProductSection
                        products={products}
                        totalAvailable={productsPagination?.total}
                    />
                    {productsPagination && (
                        <div className="mt-10">
                            <Pagination data={productsPagination} />
                        </div>
                    )}
                </Container>
            </div>
        </AppLayout>
    );
}
