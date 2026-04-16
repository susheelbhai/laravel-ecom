import { useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { InputDiv } from '@/components/form/container/input-div';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin/app-layout';

const availableIcons = [
    'Truck',
    'ShieldCheck',
    'CreditCard',
    'Headphones',
    'Package',
    'Award',
    'Clock',
    'RefreshCw',
];

export default function TrustBadgesSettings({ trustBadges }: { trustBadges: any[] }) {
    const [badges, setBadges] = useState(trustBadges || []);

    const { data, setData, patch, processing, errors } = useForm({
        trust_badges: badges,
    });

    const addBadge = () => {
        if (badges.length >= 6) {
            alert('Maximum 6 badges allowed');
            return;
        }
        const newBadges = [
            ...badges,
            { icon: 'Truck', title: '', description: '' },
        ];
        setBadges(newBadges);
        setData('trust_badges', newBadges);
    };

    const removeBadge = (index: number) => {
        const newBadges = badges.filter((_, i) => i !== index);
        setBadges(newBadges);
        setData('trust_badges', newBadges);
    };

    const updateBadge = (index: number, field: string, value: string) => {
        const newBadges = [...badges];
        newBadges[index] = { ...newBadges[index], [field]: value };
        setBadges(newBadges);
        setData('trust_badges', newBadges);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('admin.settings.trust-badges'));
    };

    return (
        <AdminLayout title="Trust Badges Settings">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground">
                        Trust Badges Settings
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage the trust badges displayed on your homepage
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-2xl bg-card p-6 shadow-md ring-1 ring-border">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-foreground">
                                Badges ({badges.length}/6)
                            </h2>
                            <Button
                                type="button"
                                onClick={addBadge}
                                disabled={badges.length >= 6}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Badge
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {badges.map((badge, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-border bg-muted/30 p-4"
                                >
                                    <div className="mb-3 flex items-center justify-between">
                                        <h3 className="font-medium text-foreground">
                                            Badge {index + 1}
                                        </h3>
                                        <Button
                                            type="button"
                                            onClick={() => removeBadge(index)}
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-foreground">
                                                Icon
                                            </label>
                                            <select
                                                value={badge.icon}
                                                onChange={(e) =>
                                                    updateBadge(
                                                        index,
                                                        'icon',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                            >
                                                {availableIcons.map((icon) => (
                                                    <option key={icon} value={icon}>
                                                        {icon}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-foreground">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                value={badge.title}
                                                onChange={(e) =>
                                                    updateBadge(
                                                        index,
                                                        'title',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                                placeholder="e.g., Free Shipping"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-foreground">
                                                Description
                                            </label>
                                            <input
                                                type="text"
                                                value={badge.description}
                                                onChange={(e) =>
                                                    updateBadge(
                                                        index,
                                                        'description',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                                placeholder="e.g., On orders over ₹500"
                                            />
                                        </div>
                                    </div>

                                    {(errors as any)[`trust_badges.${index}.title`] && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {(errors as any)[`trust_badges.${index}.title`]}
                                        </p>
                                    )}
                                </div>
                            ))}

                            {badges.length === 0 && (
                                <div className="rounded-xl border-2 border-dashed border-border bg-muted/20 p-8 text-center">
                                    <p className="text-muted-foreground">
                                        No badges added yet. Click "Add Badge" to create one.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            type="submit"
                            disabled={processing || badges.length === 0}
                            className="rounded-2xl"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
