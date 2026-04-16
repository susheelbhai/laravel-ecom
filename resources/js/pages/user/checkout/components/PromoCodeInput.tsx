import { router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

interface PromoCodeInputProps {
    onPromoCodeApplied: (data: {
        promo_code_id: number;
        code: string;
        discount_amount: number;
        subtotal: number;
        total: number;
    }) => void;
    onPromoCodeRemoved: () => void;
    appliedPromoCode: string | null;
}

export const PromoCodeInput = ({
    onPromoCodeApplied,
    onPromoCodeRemoved,
    appliedPromoCode,
}: PromoCodeInputProps) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleApply = async () => {
        if (!code.trim()) {
            setError('Please enter a promo code');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(route('promo-code.validate'), {
                code: code.toUpperCase(),
            });

            if (response.data.success) {
                onPromoCodeApplied(response.data.data);
                setCode('');
            }
        } catch (err: any) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to apply promo code. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = () => {
        setCode('');
        setError(null);
        onPromoCodeRemoved();
    };

    if (appliedPromoCode) {
        return (
            <div className="mb-4 rounded border border-accent/30 bg-accent/10 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-accent">
                            Promo Code Applied
                        </p>
                        <p className="text-lg font-bold text-accent">
                            {appliedPromoCode}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="text-sm font-semibold text-destructive hover:text-destructive/80"
                    >
                        Remove
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-foreground">
                Have a Promo Code?
            </label>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                        setCode(e.target.value.toUpperCase());
                        setError(null);
                    }}
                    placeholder="Enter code"
                    className="flex-1 rounded border border-border bg-card px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={loading}
                />
                <button
                    type="button"
                    onClick={handleApply}
                    disabled={loading || !code.trim()}
                    className="rounded bg-primary px-6 py-2 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                >
                    {loading ? 'Applying...' : 'Apply'}
                </button>
            </div>
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </div>
    );
};
