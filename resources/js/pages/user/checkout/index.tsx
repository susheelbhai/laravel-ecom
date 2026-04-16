import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Container } from '@/components/ui/container';
import AppLayout from '@/layouts/user/app-layout';
import { AddressSelector } from './components/AddressSelector';
import { OrderItemsList } from './components/OrderItemsList';
import { OrderSummary } from './components/OrderSummary';
import { PaymentMethodSelector } from './components/PaymentMethodSelector';
import { PromoCodeInput } from './components/PromoCodeInput';

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

interface CartItem {
    id: number;
    quantity: number;
    price: number;
    product: {
        id: number;
        title: string;
        slug: string;
        thumbnail: string;
        image: string;
    };
}

interface CheckoutProps {
    cart: {
        items: CartItem[];
    };
    addresses: Address[];
    total: number;
}

const Checkout = ({ cart, addresses, total }: CheckoutProps) => {
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
        addresses.find((addr) => addr.is_default)?.id ||
            addresses[0]?.id ||
            null,
    );
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>(
        'online',
    );
    const [promoCodeData, setPromoCodeData] = useState<{
        promo_code_id: number;
        code: string;
        discount_amount: number;
        subtotal: number;
        total: number;
    } | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        address_id: selectedAddressId,
        payment_method: 'online',
        promo_code_id: null as number | null,
    });

    const handleAddressSelect = (addressId: number) => {
        setSelectedAddressId(addressId);
        setData('address_id', addressId);
    };

    const handlePaymentMethodChange = (method: 'cod' | 'online') => {
        setPaymentMethod(method);
        setData('payment_method', method);
    };

    const handlePromoCodeApplied = (promoData: {
        promo_code_id: number;
        code: string;
        discount_amount: number;
        subtotal: number;
        total: number;
    }) => {
        setPromoCodeData(promoData);
        setData('promo_code_id', promoData.promo_code_id);
    };

    const handlePromoCodeRemoved = () => {
        setPromoCodeData(null);
        setData('promo_code_id', null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAddressId) {
            alert('Please select a delivery address');
            return;
        }
        post(route('checkout.store'));
    };

    const subtotal = promoCodeData?.subtotal || total;
    const discount = promoCodeData?.discount_amount || 0;
    const finalTotal = promoCodeData?.total || total;

    return (
        <AppLayout title="Checkout">
            <div className="bg-background">
                <Container className="py-8">
                    <h1 className="mb-6 text-3xl font-bold text-foreground">
                        Checkout
                    </h1>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <AddressSelector
                                addresses={addresses}
                                selectedAddressId={selectedAddressId}
                                onAddressSelect={handleAddressSelect}
                                error={errors.address_id}
                            />

                            <OrderItemsList items={cart.items} />
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="mb-4 rounded-lg border border-border bg-card p-6 shadow-sm">
                                <PaymentMethodSelector
                                    paymentMethod={paymentMethod}
                                    onPaymentMethodChange={
                                        handlePaymentMethodChange
                                    }
                                    error={errors.payment_method}
                                />
                                <PromoCodeInput
                                    onPromoCodeApplied={handlePromoCodeApplied}
                                    onPromoCodeRemoved={handlePromoCodeRemoved}
                                    appliedPromoCode={promoCodeData?.code || null}
                                />
                            </div>

                            <OrderSummary
                                subtotal={subtotal}
                                discount={discount}
                                total={finalTotal}
                                paymentMethod={paymentMethod}
                                processing={processing}
                                selectedAddressId={selectedAddressId}
                                onSubmit={handleSubmit}
                            />
                        </div>
                    </div>
                </Container>
            </div>
        </AppLayout>
    );
};

export default Checkout;
