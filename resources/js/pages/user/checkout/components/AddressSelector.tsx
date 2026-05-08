import { Link } from '@inertiajs/react';

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

interface AddressSelectorProps {
    addresses: Address[];
    selectedAddressId: number | null;
    onAddressSelect: (addressId: number) => void;
    error?: string;
}

export const AddressSelector = ({
    addresses,
    selectedAddressId,
    onAddressSelect,
    error,
}: AddressSelectorProps) => {
    return (
        <div className="mb-6 rounded-div border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">
                    Select Delivery Address
                </h2>
                <Link
                    href={route('addresses.create')}
                    className="text-sm text-primary hover:text-primary/80"
                >
                    + Add New Address
                </Link>
            </div>

            {addresses && addresses.length > 0 ? (
                <div className="space-y-4">
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            onClick={() => onAddressSelect(address.id)}
                            className={`cursor-pointer rounded-div border p-4 pb-2 transition-all ${
                                selectedAddressId === address.id
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-primary/50'
                            }`}
                        >
                            <div className="flex items-start">
                                <input
                                    type="radio"
                                    checked={selectedAddressId === address.id}
                                    onChange={() => onAddressSelect(address.id)}
                                    className="mt-1 mr-3"
                                />
                                <div className="flex-1">
                                    <div className="mb-1 flex items-center gap-2">
                                        <h3 className="font-bold text-foreground">
                                            {address.full_name}
                                        </h3>
                                        <span className="rounded bg-muted px-2 py-0 text-xs uppercase text-muted-foreground">
                                            {address.type}
                                        </span>
                                        {address.is_default && (
                                            <span className="rounded bg-primary px-2 py-0 text-xs text-primary-foreground">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <p className="py-1 text-sm text-foreground">
                                        {address.address_line1}
                                        {address.address_line2 &&
                                            `, ${address.address_line2}`}
                                    </p>
                                    {address.landmark && (
                                        <p className="py-1 text-sm text-muted-foreground">
                                            Landmark: {address.landmark}
                                        </p>
                                    )}
                                    <p className="py-1 text-sm text-foreground">
                                        {address.city}, {address.state} -{' '}
                                        {address.pincode}
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Phone: {address.phone}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-8 text-center">
                    <p className="mb-4 text-muted-foreground">
                        You haven't added any addresses yet.
                    </p>
                    <Link
                        href={route('addresses.create')}
                        className="inline-block rounded bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Add Delivery Address
                    </Link>
                </div>
            )}

            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </div>
    );
};
