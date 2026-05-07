import { Head, usePage } from '@inertiajs/react';
import EditRow from '@/components/table/edit-row';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';
import AppLayout from '@/layouts/admin/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Products', href: '/admin/product' },
    { title: 'Product Detail', href: '/dashboard' },
];

export default function Show() {
    const product = ((usePage<SharedData>().props as any)?.data as any) || {};

    const thead = [
        { title: 'Product Detail', className: 'p-3' },
        { title: '', className: 'p-3' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product Detail" />

            <TableCard>
                <Table>
                    <THead data={thead} />
                    <TBody>
                        <tr className="border-y border-gray-200">
                            <td className="p-3">Title</td>
                            <td className="p-3">{product.title}</td>
                        </tr>

                        <tr className="border-y border-gray-200">
                            <td className="p-3">Slug</td>
                            <td className="p-3">{product.slug}</td>
                        </tr>

                        <tr className="border-y border-gray-200">
                            <td className="p-3">Seller ID</td>
                            <td className="p-3">{product.seller_id}</td>
                        </tr>

                        <tr className="border-y border-gray-200">
                            <td className="p-3">Category ID</td>
                            <td className="p-3">
                                {product.product_category_id}
                            </td>
                        </tr>

                        <tr className="border-y border-gray-200">
                            <td className="p-3">SKU</td>
                            <td className="p-3">{product.sku ?? '-'}</td>
                        </tr>

                        <tr className="border-y border-gray-200">
                            <td className="p-3">Short Description</td>
                            <td className="p-3">
                                {product.short_description ?? '-'}
                            </td>
                        </tr>

                        <tr className="border-y border-gray-200">
                            <td className="p-3">Description</td>
                            <td className="p-3">
                                {product.description ? (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: product.description,
                                        }}
                                    />
                                ) : (
                                    '-'
                                )}
                            </td>
                        </tr>

                        <tr className="border-y border-gray-200">
                            <td className="p-3">Price</td>
                            <td className="p-3">{product.price}</td>
                        </tr>

                        <tr className="border-y border-gray-200">
                            <td className="p-3">MRP</td>
                            <td className="p-3">{product.mrp ?? '-'}</td>
                        </tr>

                        <tr className="border-y border-gray-200">
                            <td className="p-3">Total Stock</td>
                            <td className="p-3">
                                {product.total_stock ?? 0} units
                                {product.manage_stock == 1 && (
                                    <a
                                        href={route(
                                            'admin.stock.records.index',
                                            { product_id: product.id },
                                        )}
                                        className="ml-2 text-blue-600 hover:underline"
                                    >
                                        View Stock Records
                                    </a>
                                )}
                            </td>
                        </tr>

                        <tr className="border-y border-gray-200">
                            <td className="p-3">Manage Stock</td>
                            <td className="p-3">
                                {product.manage_stock == 1 ? 'yes' : 'no'}
                            </td>
                        </tr>

                        <tr className="border-y border-gray-200">
                            <td className="p-3">Thumbnail</td>
                            <td className="p-3">
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={product.images[0]}
                                        alt=""
                                        width={320}
                                    />
                                ) : (
                                    '-'
                                )}
                            </td>
                        </tr>

                        <tr className="border-y border-gray-200">
                            <td className="p-3">Gallery</td>
                            <td className="p-3">
                                {product.images && product.images.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {product.images.map(
                                            (img: string, index: number) => (
                                                <img
                                                    key={index}
                                                    src={img}
                                                    alt=""
                                                    width={160}
                                                />
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    '-'
                                )}
                            </td>
                        </tr>

                        <tr className="border-y border-gray-200">
                            <td className="p-3">Active</td>
                            <td className="p-3">
                                {product.is_active == 1 ? 'active' : 'inactive'}
                            </td>
                        </tr>

                        <tr className="border-y border-gray-200">
                            <td className="p-3">Featured</td>
                            <td className="p-3">
                                {product.is_featured == 1 ? 'yes' : 'no'}
                            </td>
                        </tr>

                        <tr className="border-y border-gray-200">
                            <td className="p-3">Meta Title</td>
                            <td className="p-3">{product.meta_title ?? '-'}</td>
                        </tr>

                        <tr className="border-y border-gray-200">
                            <td className="p-3">Meta Description</td>
                            <td className="p-3">
                                {product.meta_description ?? '-'}
                            </td>
                        </tr>

                        <EditRow
                            href={route('admin.product.edit', product.id)}
                            buttonName="Edit Product"
                        />
                    </TBody>
                </Table>
            </TableCard>

            {/* Warranty Section */}
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            Warranty
                        </div>
                        <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            Warranty duration and terms shown on warranty cards generated at point of sale.
                        </div>
                    </div>
                    <a
                        href={route('admin.product.warranty.edit', product.id)}
                        className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                        {product.warranty ? 'Edit warranty' : 'Add warranty'}
                    </a>
                </div>

                {product.warranty ? (
                    <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                        <div>
                            <dt className="text-xs text-gray-500 dark:text-gray-400">Duration</dt>
                            <dd className="mt-0.5 font-medium text-gray-900 dark:text-gray-100">
                                {product.warranty.duration_label}
                            </dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-xs text-gray-500 dark:text-gray-400">Terms &amp; conditions</dt>
                            <dd className="mt-1 whitespace-pre-line text-gray-700 dark:text-gray-200">
                                {product.warranty.terms ?? '—'}
                            </dd>
                        </div>
                    </dl>
                ) : (
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                        No warranty configured. Warranty cards will not be generated for this product.
                    </p>
                )}
            </div>
        </AppLayout>
    );
}
