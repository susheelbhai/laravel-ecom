import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/user/app-layout';
import BestSellersSection from './best-sellers';
import CategoriesSection from './categories';
import DealsSection from './deals';
import FeaturedProductsSection from './featured-products';
import HeroBanner from './hero-banner';
import NewsletterSection from './newsletter';
import TrustBadgesSection from './trust-badges';

const EcommerceHomePage = () => {
    const data = usePage().props as any;
    return (
        <AppLayout title="Home">
            <HeroBanner data={data} />
            <TrustBadgesSection />
            <CategoriesSection data={data.productCategories} />
            <FeaturedProductsSection data={data.featuredProducts} />
            <DealsSection data={data.bestSellers} />
            <BestSellersSection data={data.bestSellers} />
            <NewsletterSection />
        </AppLayout>
    );
};

export default EcommerceHomePage;
