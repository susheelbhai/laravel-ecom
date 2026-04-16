import { Link } from '@inertiajs/react';

interface CategorySectionProps {
    categories: any[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
    const hasCategories = Array.isArray(categories) && categories.length > 0;

    return (
        <div>
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
                        Product Categories
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
                        Browse by category to quickly find the type of solution
                        you’re looking for.
                    </p>
                </div>
                {hasCategories && (
                    <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                        {categories.length} categor
                        {categories.length > 1 ? 'ies' : 'y'}
                    </p>
                )}
            </div>
            {!hasCategories ? (
                <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-linear-to-br from-white to-slate-50 px-8 py-16 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                        <span className="text-3xl">📦</span>
                    </div>
                    <p className="mb-2 text-lg font-semibold text-slate-700">
                        No categories available yet
                    </p>
                    <p className="mx-auto max-w-md text-sm text-slate-500">
                        We're working on adding new categories. Check back soon!
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category: any) => (
                        <Link
                            key={category.id}
                            href={route('productCategory.show', category.slug)}
                            className="group block"
                        >
                            <div className="relative h-full overflow-hidden rounded-3xl border border-slate-200/50 bg-linear-to-br from-white to-slate-50 p-8 shadow-md transition-all duration-500 hover:-translate-y-3 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/20">
                                <div className="absolute inset-0 bg-linear-to-br from-primary/0 to-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                                <div className="relative z-10">
                                    {category.icon && (
                                        <img
                                            src={`${category.icon}`}
                                            alt={category.title}
                                            className="mx-auto mb-2 h-48 w-48 object-contain"
                                        />
                                    )}
                                    <h3 className="mb-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-primary">
                                        {category.title}
                                    </h3>
                                    {category.description && (
                                        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-600">
                                            {category.description}
                                        </p>
                                    )}
                                    <div className="inline-flex translate-x-0 items-center gap-2 text-sm font-semibold text-primary transition-transform duration-300 group-hover:translate-x-2">
                                        <span>Explore</span>
                                        <span className="text-lg">→</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
