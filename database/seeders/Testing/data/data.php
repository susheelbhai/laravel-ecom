<?php

$orders = [];
$order_items = [];

$product_page_banners = [];

$recommendation_configs = [
    [
        'section_type' => 'frequently_bought_together',
        'is_enabled' => true,
        'display_order' => 1,
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'section_type' => 'related_products',
        'is_enabled' => true,
        'display_order' => 2,
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'section_type' => 'recently_viewed',
        'is_enabled' => true,
        'display_order' => 3,
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'section_type' => 'co_purchase',
        'is_enabled' => true,
        'display_order' => 4,
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'section_type' => 'category_best_sellers',
        'is_enabled' => true,
        'display_order' => 5,
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'section_type' => 'category_top_rated',
        'is_enabled' => true,
        'display_order' => 6,
        'created_at' => now(),
        'updated_at' => now(),
    ],
];

// Reviews data - empty array as reviews are generated dynamically based on products and users
// To maintain the 2-line seeder pattern, we use an empty array here
// In production, you may want to add specific review data
$reviews = [];
include 'backup/project.php';
include 'backup/ecom.php';
