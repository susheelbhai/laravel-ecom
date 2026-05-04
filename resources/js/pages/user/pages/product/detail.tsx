import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Container } from '@/components/ui/layout/container';
import AppLayout from '@/layouts/user/app-layout';
import ExternalZoomOverlay from './components/images/external-zoom-overlay';
import ImageSlider from './components/images/image-slider';
import ProductCartActions from './components/product-actions/product-cart-actions';
import ProductHeader from './components/product-header';
import ProductDescription from './components/product-info/product-description';
import ProductFeatures from './components/product-info/product-features';
import ProductPricing from './components/product-info/product-pricing';
import ProductSections from './components/product-info/product-sections';
import ProductRecommendationsSection from './components/recommendations/product-recommendations-section';
import ProductReviewsSection from './components/reviews/product-reviews-section';
import { PRODUCT_FALLBACK_IMAGE_URL } from '@/lib/product-image-fallback';

const FALLBACK_IMAGE = PRODUCT_FALLBACK_IMAGE_URL;

export default function ProductDetail() {
    const { 
        data: product, 
        hasPurchased, 
        canReview, 
        auth,
        reviews,
        averageRating,
        reviewCount,
        ratingDistribution,
        sortBy,
        ratingFilter,
        recommendations,
        sectionOrder
    } = usePage().props as any;
    const [externalZoom, setExternalZoom] = useState({
        isActive: false,
        position: { x: 50, y: 50 },
        imageUrl: '',
    });

    if (!product) {
        return (
            <AppLayout>
                <div className="flex min-h-100 items-center justify-center">
                    <p className="text-lg text-muted-foreground">
                        Product not found
                    </p>
                </div>
            </AppLayout>
        );
    }

    const hasPrice = product.price && product.price > 0;
    const displayImages =
        product.images && product.images.length > 0
            ? product.images
            : product.display_img
              ? [
                    {
                        id: 0,
                        url: product.display_img,
                        thumbnail: product.display_img,
                        name: product.title,
                        file_name: '',
                        size: 0,
                        mime_type: '',
                    },
                ]
              : [];

    return (
        <AppLayout>
            <div className="bg-background text-foreground">
                <Container className="py-12 lg:py-16">
                    {/* Upper Section: Images and Price */}
                    <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                        {/* Image Slider */}
                        <div>
                            <ImageSlider
                                images={displayImages}
                                productTitle={product.title}
                                productId={product.id}
                                zoomType="external"
                                zoomScale={2.5}
                                onExternalZoom={(isActive, position, imageUrl) => {
                                    setExternalZoom({ isActive, position, imageUrl });
                                }}
                                fallbackImageUrl={FALLBACK_IMAGE}
                            />
                        </div>

                        {/* Price and Features Sidebar */}
                        <aside className="relative">
                            {/* External Zoom Overlay */}
                            <ExternalZoomOverlay
                                src={externalZoom.imageUrl || FALLBACK_IMAGE}
                                position={externalZoom.position}
                                zoomScale={2.5}
                                isVisible={externalZoom.isActive}
                            />
                            
                            <div className="flex h-full flex-col space-y-6">
                            {/* Product Header */}
                            <ProductHeader
                                title={product.title}
                                category={product.category}
                                averageRating={averageRating}
                                reviewCount={reviewCount}
                            />

                            {hasPrice ? (
                                <ProductPricing
                                    price={product.price}
                                    mrp={product.mrp}
                                    currency={product.currency}
                                />
                            ) : null}

                            {product.features &&
                                product.features.length > 0 && (
                                    <ProductFeatures
                                        features={product.features}
                                    />
                                )}

                            <div className="sticky bottom-4 mt-auto">
                                <ProductCartActions
                                    productId={product.id}
                                    price={product.price || 0}
                                    hasPrice={hasPrice}
                                />
                            </div>
                            </div>
                        </aside>
                    </div>

                    {/* Lower Section: Full Width Details */}
                    <div className="space-y-8">
                        <ProductDescription
                            shortDescription={product.short_description}
                        />

                        <ProductSections
                            description={product.description}
                            longDescription2={product.long_description2}
                            longDescription3={product.long_description3}
                        />

                        {/* Recommendation Sections */}
                        <ProductRecommendationsSection
                            recommendations={recommendations}
                            sectionOrder={sectionOrder}
                        />

                        {/* Reviews Section */}
                        <ProductReviewsSection
                            productId={product.id}
                            reviews={reviews}
                            averageRating={averageRating}
                            reviewCount={reviewCount}
                            ratingDistribution={ratingDistribution}
                            sortBy={sortBy}
                            ratingFilter={ratingFilter}
                            auth={auth}
                            canReview={canReview}
                            hasPurchased={hasPurchased}
                        />
                    </div>
                </Container>
            </div>
        </AppLayout>
    );
}
