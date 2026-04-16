import { usePage } from '@inertiajs/react';
import { ShieldCheck, Truck, CreditCard, Headphones, Package, Award, Clock, RefreshCw } from 'lucide-react';
import { Container } from '@/components/ui/container';

const iconMap: Record<string, any> = {
    Truck,
    ShieldCheck,
    CreditCard,
    Headphones,
    Package,
    Award,
    Clock,
    RefreshCw,
};

export default function TrustBadgesSection() {
    const { appData } = usePage().props as any;
    const trustBadges = appData?.trust_badges || getDefaultBadges();

    if (!trustBadges || trustBadges.length === 0) return null;

    const gridColsMap: Record<number, string> = {
        1: 'md:grid-cols-1',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-4',
        5: 'md:grid-cols-5',
        6: 'md:grid-cols-6',
    };
    
    const gridCols = gridColsMap[trustBadges.length as number] || 'md:grid-cols-4';

    return (
        <section className="border-y border-border bg-card py-8">
            <Container>
                <div className={`grid grid-cols-2 gap-6 ${gridCols}`}>
                    {trustBadges.map((badge: any, index: number) => {
                        const IconComponent = iconMap[badge.icon] || Truck;
                        return (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <IconComponent className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="mb-1 text-sm font-semibold text-foreground">
                                    {badge.title}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    {badge.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}

function getDefaultBadges() {
    return [
        {
            icon: 'Truck',
            title: 'Free Shipping',
            description: 'On orders over ₹500',
        },
        {
            icon: 'ShieldCheck',
            title: 'Secure Payment',
            description: '100% protected',
        },
        {
            icon: 'CreditCard',
            title: 'Easy Returns',
            description: '30-day return policy',
        },
        {
            icon: 'Headphones',
            title: '24/7 Support',
            description: 'Dedicated support',
        },
    ];
}
