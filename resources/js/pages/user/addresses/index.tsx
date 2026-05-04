import { Link, router, usePage } from '@inertiajs/react';
import Button from '@/components/ui/button/button';
import { Container } from '@/components/ui/layout/container';
import AppLayout from '@/layouts/user/app-layout';

interface Address {
    id: number;
    type: string;
    full_name: string;
    phone: string;
    alternate_phone: string | null;
    address_line1: string;
    address_line2: string | null;
    city: string;
    state: string;
    country: string;
    pincode: string;
    landmark: string | null;
    is_default: boolean;
}

const AddressIndex = () => {
    const { addresses = [] } = usePage().props as any;

    const handleSetDefault = (addressId: number) => {
        router.post(
            route('addresses.setDefault', addressId),
            {},
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout>
            <Container className="py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">My Addresses</h1>
                    <Link
                        href={route('addresses.create')}
                        className="rounded bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Add New Address
                    </Link>
                </div>

                {addresses && addresses.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {addresses.map((address: Address) => (
                            <div
                                key={address.id}
                                className={`relative rounded-lg border p-6 ${
                                    address.is_default
                                        ? 'border-primary bg-primary/10'
                                        : ''
                                }`}
                            >
                                {address.is_default && (
                                    <div className="absolute top-4 right-4">
                                        <span className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
                                            Default
                                        </span>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <h3 className="mb-2 text-lg font-bold">
                                        {address.full_name}
                                    </h3>
                                    <p className="mb-2 text-sm text-gray-600 uppercase">
                                        {address.type}
                                    </p>
                                </div>

                                <div className="mb-4 text-gray-700">
                                    <p>{address.address_line1}</p>
                                    {address.address_line2 && (
                                        <p>{address.address_line2}</p>
                                    )}
                                    {address.landmark && (
                                        <p className="text-sm text-gray-600">
                                            Landmark: {address.landmark}
                                        </p>
                                    )}
                                    <p>
                                        {address.city}, {address.state} -{' '}
                                        {address.pincode}
                                    </p>
                                    <p>{address.country}</p>
                                </div>

                                <div className="mb-4 text-gray-700">
                                    <p className="text-sm">
                                        <span className="font-semibold">
                                            Phone:
                                        </span>{' '}
                                        {address.phone}
                                    </p>
                                    {address.alternate_phone && (
                                        <p className="text-sm">
                                            <span className="font-semibold">
                                                Alternate:
                                            </span>{' '}
                                            {address.alternate_phone}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Link
                                        href={route(
                                            'addresses.edit',
                                            address.id,
                                        )}
                                        className="rounded bg-gray-500 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-600"
                                    >
                                        Edit
                                    </Link>

                                    {!address.is_default && (
                                        <button
                                            onClick={() =>
                                                handleSetDefault(address.id)
                                            }
                                            className="rounded bg-accent px-4 py-2 text-sm text-accent-foreground transition-colors hover:bg-accent/90"
                                        >
                                            Set as Default
                                        </button>
                                    )}

                                    <Button
                                        method="delete"
                                        href={route(
                                            'addresses.destroy',
                                            address.id,
                                        )}
                                        size="medium"
                                        className="text-sm"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <p className="mb-4 text-gray-600">
                            You haven't added any addresses yet.
                        </p>
                        <Link
                            href={route('addresses.create')}
                            className="inline-block rounded bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            Add Your First Address
                        </Link>
                    </div>
                )}
            </Container>
        </AppLayout>
    );
};

export default AddressIndex;
