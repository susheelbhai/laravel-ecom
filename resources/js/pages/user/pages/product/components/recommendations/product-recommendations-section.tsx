import { RecommendationSection } from '@/components/product/recommendation-section';

interface ProductRecommendationsSectionProps {
    recommendations: Record<string, any[]>;
    sectionOrder: string[];
}

const sectionTitles: Record<string, string> = {
    frequently_bought_together: 'Frequently Bought Together',
    related_products: 'Related Products',
    recently_viewed: 'Recently Viewed',
    co_purchase: 'Customers Who Bought This Also Bought',
    category_best_sellers: 'Best Sellers in This Category',
    category_top_rated: 'Top Rated in This Category',
};

export default function ProductRecommendationsSection({
    recommendations,
    sectionOrder,
}: ProductRecommendationsSectionProps) {
    if (!recommendations || !sectionOrder || sectionOrder.length === 0) {
        return null;
    }

    return (
        <div className="border-t border-gray-200 pt-8">
            {sectionOrder.map((sectionType: string) => {
                const products = recommendations[sectionType];
                if (!products || products.length === 0) return null;

                return (
                    <RecommendationSection
                        key={sectionType}
                        title={sectionTitles[sectionType] || sectionType}
                        products={products}
                    />
                );
            })}
        </div>
    );
}
