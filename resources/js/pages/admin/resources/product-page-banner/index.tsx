import { Head, usePage } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import Button from '@/components/ui/button/button';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';
import ButtonCreate from '@/components/ui/button/button-create';
import AppLayout from '@/layouts/admin/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product Page Banner',
        href: '/dashboard',
    },
];

export default function Index() {
    const data =
        ((usePage<SharedData>().props as any)?.data as {
            id: number;
            thumbnail: string;
            href: string | null;
            target: string;
            display_order: number;
            is_active: boolean;
        }[]) || [];

    const thead = [
        { title: 'Thumbnail', className: 'p-3' },
        { title: 'Link (href)', className: 'p-3' },
        { title: 'Target', className: 'p-3' },
        { title: 'Display Order', className: 'p-3' },
        { title: 'Status', className: 'p-3' },
        { title: 'Actions', className: 'p-3' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product Page Banner" />
            <ButtonCreate
                href={route('admin.product-page-banner.create')}
                text="Add New"
            />

            <TableCard>
                <Table>
                    <THead data={thead} />
                    <TBody>
                        {data.map((banner) => (
                            <tr
                                key={banner.id}
                                className="border-t border-gray-200"
                            >
                                <td className="p-3">
                                    <img
                                        src={banner.thumbnail}
                                        alt="Banner thumbnail"
                                        width={80}
                                        className="rounded"
                                    />
                                </td>
                                <td className="p-3">
                                    {banner.href ? (
                                        <a
                                            href={banner.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {banner.href.length > 40
                                                ? banner.href.substring(0, 40) +
                                                  '...'
                                                : banner.href}
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">
                                            No link
                                        </span>
                                    )}
                                </td>
                                <td className="p-3">{banner.target}</td>
                                <td className="p-3">{banner.display_order}</td>
                                <td className="p-3">
                                    <span
                                        className={`rounded px-2 py-1 text-xs font-semibold ${
                                            banner.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {banner.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <div className="flex gap-2">
                                        <Button
                                            className="rounded bg-yellow-600 px-3 py-2 text-white hover:bg-yellow-700"
                                            href={route(
                                                'admin.product-page-banner.edit',
                                                banner.id,
                                            )}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            method="delete"
                                            className="rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                                            href={route(
                                                'admin.product-page-banner.destroy',
                                                banner.id,
                                            )}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </TBody>
                </Table>
            </TableCard>
        </AppLayout>
    );
}
