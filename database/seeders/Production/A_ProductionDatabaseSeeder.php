<?php

namespace Database\Seeders\Production;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Database\Seeders\Production\Laraship\LarashipSeeder;
use Illuminate\Database\Seeder;

class A_ProductionDatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(StateSeeder::class);
        $this->call([
            LarashipSeeder::class,
        ]);
        $this->call(NotificationSeeder::class);
        $this->call(NewsletterSeeder::class);
        $this->call(SettingSeeder::class);
        $this->call(RolesAndPermissionsSeeder::class);
        $this->call(Slider1Seeder::class);
        $this->call(PageSeeder::class);
        $this->call(ImportantLinkSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(AddressSeeder::class);
        $this->call(AdminSeeder::class);
        $this->call(PartnerSeeder::class);
        $this->call(PromoCodeSeeder::class);
        $this->call(SellerSeeder::class);
        $this->call(UserQueryStatusSeeder::class);
        $this->call(UserQuerySeeder::class);
        $this->call(BlogSeeder::class);
        $this->call(BlogViewSeeder::class);
        $this->call(BlogCommentSeeder::class);
        $this->call(PortfolioSeeder::class);
        $this->call(FaqCategorySeeder::class);
        $this->call(FaqSeeder::class);
        $this->call(TeamSeeder::class);
        $this->call(TestimonialSeeder::class);
        $this->call(ProductCategorySeeder::class);
        $this->call(ProductSeeder::class);
        $this->call(CartSeeder::class);
        $this->call(CartItemSeeder::class);
        $this->call(WishlistSeeder::class);
        $this->call(WishlistItemSeeder::class);
        $this->call(ProductEnquirySeeder::class);
        $this->call(MediaSeeder::class);
        $this->call(GallerySeeder::class);
        $this->call(OrderSeeder::class);
        $this->call(OrderItemSeeder::class);
        $this->call(ProductPageBannerSeeder::class);
        $this->call(RecommendationConfigSeeder::class);
        $this->call(ReviewSeeder::class);
        $this->call(ReviewVoteSeeder::class);
        $this->call(BrowsingHistorySeeder::class);
        $this->call(VisitorSeeder::class);
        $this->call(WarehouseSeeder::class);
        $this->call(WarehouseRackSeeder::class);
        $this->call(StockRecordSeeder::class);
        $this->call(StockMovementSeeder::class);
        $this->call(DistributorSeeder::class);
        $this->call(DistributorOrderSeeder::class);
        $this->call(DistributorOrderItemSeeder::class);
        $this->call(DealerSeeder::class);
        $this->call(DealerOrderSeeder::class);
        $this->call(DealerOrderItemSeeder::class);
        $this->call(DealerRetailSaleSeeder::class);
        $this->call(DealerRetailSaleItemSeeder::class);
        $this->call(TechnicianSeeder::class);
        $this->call(ProjectSeeder::class);
        $this->call(ServiceSeeder::class);
        $this->call(ProductWarrantySeeder::class);
        $this->call(SerialNumberSeeder::class);
        $this->call(SerialNumberMovementSeeder::class);
        $this->call(TechnicianScanSeeder::class);
        $this->call(WarrantyCardSeeder::class);
    }
}
