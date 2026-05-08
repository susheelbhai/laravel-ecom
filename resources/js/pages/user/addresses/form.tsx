import { useForm, Link } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import InputError from '@/components/form/input/input-error';
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

interface FormProps {
    address: Address | null;
}

const AddressForm = ({ address }: FormProps) => {
    const isEdit = address !== null;

    const { data, setData, post, patch, processing, errors } = useForm({
        type: address?.type || 'home',
        full_name: address?.full_name || '',
        phone: address?.phone || '',
        alternate_phone: address?.alternate_phone || '',
        address_line1: address?.address_line1 || '',
        address_line2: address?.address_line2 || '',
        city: address?.city || '',
        state: address?.state || '',
        country: address?.country || 'India',
        pincode: address?.pincode || '',
        landmark: address?.landmark || '',
        is_default: address?.is_default || false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            patch(route('addresses.update', address.id));
        } else {
            post(route('addresses.store'));
        }
    };

    return (
        <AppLayout>
            <Container className="max-w-3xl py-8">
                <div className="mb-6">
                    <Link
                        href={route('addresses.index')}
                        className="text-primary hover:text-primary/80"
                    >
                        ← Back to Addresses
                    </Link>
                </div>

                <h1 className="mb-6 text-3xl font-bold">
                    {isEdit ? 'Edit Address' : 'Add New Address'}
                </h1>

                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-div bg-white p-6 shadow"
                >
                    <div>
                        <label
                            htmlFor="type"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Address Type{' '}
                            <span className="text-destructive">*</span>
                        </label>
                        <select
                            id="type"
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            className="w-full rounded-div border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="home">Home</option>
                            <option value="office">Office</option>
                            <option value="other">Other</option>
                        </select>
                        <InputError message={errors.type} className="mt-1" />
                    </div>

                    <div>
                        <label
                            htmlFor="full_name"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Full Name{' '}
                            <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="text"
                            id="full_name"
                            value={data.full_name}
                            onChange={(e) =>
                                setData('full_name', e.target.value)
                            }
                            className="w-full rounded-div border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter full name"
                        />
                        <InputError
                            message={errors.full_name}
                            className="mt-1"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="phone"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Phone Number{' '}
                                <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                id="phone"
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                                className="w-full rounded-div border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter phone number"
                            />
                            <InputError
                                message={errors.phone}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="alternate_phone"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Alternate Phone
                            </label>
                            <input
                                type="text"
                                id="alternate_phone"
                                value={data.alternate_phone}
                                onChange={(e) =>
                                    setData('alternate_phone', e.target.value)
                                }
                                className="w-full rounded-div border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter alternate phone"
                            />
                            <InputError
                                message={errors.alternate_phone}
                                className="mt-1"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="address_line1"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Address Line 1{' '}
                            <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="text"
                            id="address_line1"
                            value={data.address_line1}
                            onChange={(e) =>
                                setData('address_line1', e.target.value)
                            }
                            className="w-full rounded-div border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            placeholder="HouseNo., Building Name"
                        />
                        <InputError
                            message={errors.address_line1}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="address_line2"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Address Line 2
                        </label>
                        <input
                            type="text"
                            id="address_line2"
                            value={data.address_line2}
                            onChange={(e) =>
                                setData('address_line2', e.target.value)
                            }
                            className="w-full rounded-div border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            placeholder="Road Name, Area, Colony"
                        />
                        <InputError
                            message={errors.address_line2}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="landmark"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Landmark
                        </label>
                        <input
                            type="text"
                            id="landmark"
                            value={data.landmark}
                            onChange={(e) =>
                                setData('landmark', e.target.value)
                            }
                            className="w-full rounded-div border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            placeholder="Nearby landmark"
                        />
                        <InputError
                            message={errors.landmark}
                            className="mt-1"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <label
                                htmlFor="city"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                City <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                id="city"
                                value={data.city}
                                onChange={(e) =>
                                    setData('city', e.target.value)
                                }
                                className="w-full rounded-div border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                placeholder="City"
                            />
                            <InputError
                                message={errors.city}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="state"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                State{' '}
                                <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                id="state"
                                value={data.state}
                                onChange={(e) =>
                                    setData('state', e.target.value)
                                }
                                className="w-full rounded-div border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                placeholder="State"
                            />
                            <InputError
                                message={errors.state}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="pincode"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Pincode{' '}
                                <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                id="pincode"
                                value={data.pincode}
                                onChange={(e) =>
                                    setData('pincode', e.target.value)
                                }
                                className="w-full rounded-div border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                placeholder="Pincode"
                            />
                            <InputError
                                message={errors.pincode}
                                className="mt-1"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="country"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Country <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="text"
                            id="country"
                            value={data.country}
                            onChange={(e) => setData('country', e.target.value)}
                            className="w-full rounded-div border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            placeholder="Country"
                        />
                        <InputError message={errors.country} className="mt-1" />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_default"
                            checked={data.is_default}
                            onChange={(e) =>
                                setData('is_default', e.target.checked)
                            }
                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <label
                            htmlFor="is_default"
                            className="ml-2 block text-sm text-gray-700"
                        >
                            Set as default address
                        </label>
                        <InputError
                            message={errors.is_default}
                            className="mt-1"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90 disabled:bg-muted"
                        >
                            {processing
                                ? 'Saving...'
                                : isEdit
                                  ? 'Update Address'
                                  : 'Save Address'}
                        </button>

                        <Link
                            href={route('addresses.index')}
                            className="rounded bg-gray-500 px-6 py-2 text-white transition-colors hover:bg-gray-600"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </Container>
        </AppLayout>
    );
};

export default AddressForm;
