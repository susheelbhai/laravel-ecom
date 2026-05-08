import { useEffect, useRef } from 'react';
import { Container } from '@/components/ui/layout/container';
import { useFormatMoney } from '@/hooks/use-format-money';
import AppLayout from '@/layouts/user/app-layout';

interface Order {
    id: number;
    order_number: string;
    total_amount: number;
}

interface PaymentData {
    order_id: string;
    amount: number;
    email: string;
    phone: string;
    name: string;
    action_url: string;
    redirect_url: string;
    gateway: number;
    gst_percentage: number;
}

interface PaymentProps {
    order: Order;
    paymentData: PaymentData;
}

const Payment = ({ order, paymentData }: PaymentProps) => {
    const { formatMoney } = useFormatMoney();
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        // Auto-submit the form after component mounts
        const timer = setTimeout(() => {
            formRef.current?.submit();
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AppLayout>
            <Container className="py-8">
                <div className="mx-auto max-w-md">
                    <div className="rounded-div bg-white p-8 text-center shadow">
                        <div className="mb-6">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                                <svg
                                    className="h-8 w-8 animate-spin text-primary"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            </div>
                            <h1 className="mb-2 text-2xl font-bold">
                                Processing Your Payment
                            </h1>
                            <p className="mb-4 text-gray-600">
                                Please wait while we redirect you to the payment
                                gateway...
                            </p>
                        </div>

                        <div className="mb-6 rounded bg-gray-50 p-4">
                            <p className="mb-1 text-sm text-gray-600">
                                Order Number
                            </p>
                            <p className="mb-3 font-bold">
                                {order.order_number}
                            </p>
                            <p className="mb-1 text-sm text-gray-600">
                                Amount to Pay
                            </p>
                            <p className="text-2xl font-bold text-primary">
                                {formatMoney(order.total_amount, {
                                    showDecimals: true,
                                })}
                            </p>
                        </div>

                        {/* Hidden form that auto-submits to payment gateway */}
                        <form
                            ref={formRef}
                            action={route('pay')}
                            method="POST"
                            className="hidden"
                        >
                            <input
                                type="hidden"
                                name="_token"
                                value={
                                    document
                                        .querySelector(
                                            'meta[name="csrf-token"]',
                                        )
                                        ?.getAttribute('content') || ''
                                }
                            />
                            <input
                                type="hidden"
                                name="order_number"
                                value={paymentData.order_id}
                            />
                            <input
                                type="hidden"
                                name="amount"
                                value={paymentData.amount}
                            />
                            <input
                                type="hidden"
                                name="email"
                                value={paymentData.email}
                            />
                            <input
                                type="hidden"
                                name="phone"
                                value={paymentData.phone}
                            />
                            <input
                                type="hidden"
                                name="name"
                                value={paymentData.name}
                            />
                            <input
                                type="hidden"
                                name="action_url"
                                value={paymentData.action_url}
                            />
                            <input
                                type="hidden"
                                name="redirect_url"
                                value={paymentData.redirect_url}
                            />
                            <input
                                type="hidden"
                                name="gateway"
                                value={paymentData.gateway}
                            />
                            <input
                                type="hidden"
                                name="gst_percentage"
                                value={paymentData.gst_percentage}
                            />
                        </form>

                        <p className="text-xs text-gray-500">
                            If you are not redirected automatically, please
                            click the button below.
                        </p>
                        <button
                            onClick={() => formRef.current?.submit()}
                            className="mt-4 rounded bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </Container>
        </AppLayout>
    );
};

export default Payment;
