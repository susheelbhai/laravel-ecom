interface PaymentMethodSelectorProps {
    paymentMethod: 'cod' | 'online';
    onPaymentMethodChange: (method: 'cod' | 'online') => void;
    error?: string;
}

export const PaymentMethodSelector = ({
    paymentMethod,
    onPaymentMethodChange,
    error,
}: PaymentMethodSelectorProps) => {
    return (
        <div className="">
            <h2 className="mb-4 text-xl font-bold text-foreground">
                Select Payment Method
            </h2>
            <div className="space-y-3">
                <div
                    onClick={() => onPaymentMethodChange('cod')}
                    className={`cursor-pointer rounded-lg border p-4 transition-all ${
                        paymentMethod === 'cod'
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                    }`}
                >
                    <div className="flex items-center">
                        <input
                            type="radio"
                            checked={paymentMethod === 'cod'}
                            onChange={() => onPaymentMethodChange('cod')}
                            className="mr-3"
                        />
                        <div>
                            <h3 className="font-bold text-foreground">
                                Cash on Delivery (COD)
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Pay when you receive your order
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => onPaymentMethodChange('online')}
                    className={`cursor-pointer rounded-lg border p-4 transition-all ${
                        paymentMethod === 'online'
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                    }`}
                >
                    <div className="flex items-center">
                        <input
                            type="radio"
                            checked={paymentMethod === 'online'}
                            onChange={() => onPaymentMethodChange('online')}
                            className="mr-3"
                        />
                        <div>
                            <h3 className="font-bold text-foreground">
                                Online Payment
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Pay securely using UPI, Cards, Net Banking
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </div>
    );
};
