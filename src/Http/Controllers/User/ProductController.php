<?php

namespace App\Http\Controllers\User;

use App\Events\ProductEnquirySubmitted;
use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\ProductEnquiry;
use App\Models\RecommendationConfig;
use App\Models\Review;
use App\Services\BrowsingHistoryService;
use App\Services\RecommendationService;
use App\Services\ReviewAggregationService;
use App\Services\ReviewService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $t0 = microtime(true);

        $query = Product::query()
            ->where('is_active', 1)
            ->with([
                'category:id,title,slug',
                'media',
            ])
            ->select([
                'products.id',
                'products.product_category_id',
                'products.title',
                'products.slug',
                'products.sku',
                'products.short_description',
                'products.price',
                'products.mrp',
                'products.is_featured',
                'products.average_rating',
                'products.review_count',
                'products.created_at',
            ]);

        // Search: use MySQL/MariaDB FULLTEXT when available (see ft_products_title_short_description).
        // Use BOOLEAN MODE + prefix matching for better UX and performance.
        if ($request->filled('search')) {
            $term = trim((string) $request->search);
            if ($term !== '') {
                $escaped = addcslashes($term, '%_\\');
                $likeContains = '%'.$escaped.'%';
                $likePrefix = $escaped.'%';
                $skuPrefix = $likePrefix;
                $driver = DB::connection()->getDriverName();
                $canUseFulltext = in_array($driver, ['mysql', 'mariadb'], true) && strlen($term) >= 3;

                $query->where(function ($q) use ($term, $likePrefix, $canUseFulltext) {
                    if ($canUseFulltext) {
                        $words = preg_split('/\s+/', $term, -1, PREG_SPLIT_NO_EMPTY) ?: [];
                        $words = array_values(array_filter($words, fn ($w) => strlen($w) >= 3));
                        $boolean = $words
                            ? implode(' ', array_map(fn ($w) => '+'.$w.'*', $words))
                            : $term.'*';

                        $q->whereRaw(
                            'MATCH(`products`.`title`, `products`.`short_description`, `products`.`sku`) AGAINST(? IN BOOLEAN MODE)',
                            [$boolean],
                        );
                    } else {
                        // Short terms: never use leading-wildcard LIKE (it scans the whole table).
                        $q->where('products.sku', 'like', $likePrefix)
                            ->orWhere('products.title', 'like', $likePrefix)
                            ->orWhere('products.short_description', 'like', $likePrefix);
                    }
                });

                if ($canUseFulltext && $request->get('sort_by', 'latest') === 'latest') {
                    $words = preg_split('/\s+/', $term, -1, PREG_SPLIT_NO_EMPTY) ?: [];
                    $words = array_values(array_filter($words, fn ($w) => strlen($w) >= 3));
                    $boolean = $words
                        ? implode(' ', array_map(fn ($w) => '+'.$w.'*', $words))
                        : $term.'*';

                    $query->selectRaw(
                        'MATCH(`products`.`title`, `products`.`short_description`, `products`.`sku`) AGAINST(? IN BOOLEAN MODE) as relevance_score',
                        [$boolean],
                    );
                    $query->orderByDesc('relevance_score');
                }
            }
        }

        // Filter by category
        if ($request->filled('category')) {
            $categoryIdentifier = $request->category;
            // Try to find by ID first, then by slug
            $category = ProductCategory::where('id', $categoryIdentifier)
                ->orWhere('slug', $categoryIdentifier)
                ->first();
            if ($category) {
                $query->where('product_category_id', $category->id);
            }
        }

        // Filter by price range
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Filter by minimum rating
        if ($request->filled('min_rating')) {
            $minRating = (float) $request->min_rating;
            if ($minRating >= 1 && $minRating <= 5) {
                $query->where('products.average_rating', '>=', $minRating);
            }
        }

        // Filter by stock availability
        if ($request->filled('in_stock') && $request->in_stock === 'true') {
            $query->whereIn('products.id', function ($subQuery) {
                $subQuery->select('product_id')
                    ->from('stock_movements')
                    ->groupBy('product_id')
                    ->havingRaw('SUM(quantity) > 0');
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'latest');
        switch ($sortBy) {
            case 'price_low':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('price', 'desc');
                break;
            case 'title_asc':
                $query->orderBy('title', 'asc');
                break;
            case 'title_desc':
                $query->orderBy('title', 'desc');
                break;
            case 'rating_high':
                $query->orderByDesc('products.average_rating');
                break;
            case 'rating_low':
                $query->orderBy('products.average_rating', 'asc');
                break;
            case 'oldest':
                $query->orderBy('products.created_at', 'asc');
                break;
            case 'latest':
            default:
                $query->orderBy('products.created_at', 'desc');
                break;
        }

        // Pagination with lazy loading support.
        // Use simplePaginate to avoid the expensive COUNT(*) query on large catalogs / FULLTEXT searches.
        $data = $query->simplePaginate(20);
        $tPaginate = microtime(true);

        $data->setCollection($data->getCollection()->map(function ($product) {
            return [
                'id' => $product->id,
                'product_category_id' => $product->product_category_id,
                'title' => $product->title,
                'slug' => $product->slug,
                'sku' => $product->sku,
                'short_description' => $product->short_description,
                'price' => $product->price,
                'mrp' => $product->mrp,
                'is_featured' => $product->is_featured,
                'category' => $product->category,
                'thumbnail' => $product->getFirstMediaUrl('images', 'small') ?: $product->display_img,
                'display_img' => $product->display_img,
                'average_rating' => (float) ($product->average_rating ?? 0),
                'review_count' => (int) ($product->review_count ?? 0),
            ];
        }));
        $tMap = microtime(true);

        $serverTiming = implode(', ', [
            'products_total;dur='.(($tMap - $t0) * 1000),
            'products_paginate;dur='.(($tPaginate - $t0) * 1000),
            'products_reviews_agg;dur=0',
            'products_map;dur='.(($tMap - $tPaginate) * 1000),
        ]);

        // Sidebar filter data must always be resolved. Inertia partial visits omit
        // props not listed in `only`, but we still load here so those props are
        // fresh whenever the client includes them (avoids stale/null edge cases).
        if ($request->wantsJson()) {
            return response()->json($data)->header('Server-Timing', $serverTiming);
        }

        $categories = Cache::remember('product_categories:active:list', 3600, function () {
            // Cache plain arrays (not Eloquent collections/models) to avoid
            // `__PHP_Incomplete_Class` issues when the cache is restored.
            return ProductCategory::where('is_active', 1)
                ->orderBy('title')
                ->get(['id', 'title', 'slug'])
                ->map(fn ($c) => [
                    'id' => $c->id,
                    'title' => $c->title,
                    'slug' => $c->slug,
                ])
                ->values()
                ->all();
        });

        $priceRange = Cache::remember('products:active:price_range', 3600, function () {
            $row = Product::where('is_active', 1)
                ->selectRaw('MIN(price) as min_price, MAX(price) as max_price')
                ->first();

            return [
                'min_price' => (float) ($row?->min_price ?? 0),
                'max_price' => (float) ($row?->max_price ?? 0),
            ];
        });

        // dd($data);
        $this->seo(
            title: 'Products',
            description: 'Browse our full product catalog.',
            canonical: route('product.index'),
        );

        $inertia = $this->render('user/pages/product/index', [
            'data' => $data,
            'categories' => $categories,
            'priceRange' => $priceRange,
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'min_price' => $request->min_price,
                'max_price' => $request->max_price,
                'min_rating' => $request->min_rating,
                'in_stock' => $request->in_stock,
                'sort_by' => $sortBy,
            ],
        ]);

        return $inertia->toResponse($request)->header('Server-Timing', $serverTiming);
    }

    public function productCategory($slug)
    {
        $data = ProductCategory::whereSlug($slug)
            ->whereIsActive(1)
            ->firstOrFail();

        $categorySummary = [
            'id' => $data->id,
            'title' => $data->title,
            'slug' => $data->slug,
        ];

        $products = Product::query()
            ->where('product_category_id', $data->id)
            ->where('is_active', 1)
            ->with(['media'])
            ->select([
                'products.id',
                'products.product_category_id',
                'products.title',
                'products.slug',
                'products.short_description',
                'products.price',
                'products.mrp',
                'products.average_rating',
                'products.review_count',
                'products.created_at',
            ])
            ->orderByDesc('products.created_at')
            ->paginate(24)
            ->through(function ($product) use ($categorySummary) {
                return [
                    'id' => $product->id,
                    'title' => $product->title,
                    'name' => $product->title,
                    'slug' => $product->slug,
                    'short_description' => $product->short_description,
                    'price' => $product->price,
                    'mrp' => $product->mrp,
                    'category' => $categorySummary,
                    'thumbnail' => $product->getFirstMediaUrl('images', 'small') ?: $product->display_img,
                    'average_rating' => (float) ($product->average_rating ?? 0),
                    'review_count' => (int) ($product->review_count ?? 0),
                ];
            });

        $data->setRelation('products', $products);

        $this->seo(
            title: $data->title,
            description: $data->description ?? $data->title,
            canonical: route('productCategory.show', $data->slug),
        );

        return $this->render('user/pages/product_category/show', compact('data'));
    }

    public function productDetail($slug)
    {
        $data = Product::with('category')
            ->whereSlug($slug)
            ->whereIsActive(1)
            ->firstOrFail();

        // Check if user has purchased this product
        $hasPurchased = false;
        $canReview = false;
        if (Auth::check()) {
            $hasPurchased = OrderItem::query()
                ->where('product_id', $data->id)
                ->whereHas('order', function ($query) {
                    $query->where('user_id', Auth::id())
                        ->where('payment_status', 'paid');
                })
                ->exists();

            // User can review if they purchased and haven't reviewed yet
            $existingReview = Review::where('product_id', $data->id)
                ->where('user_id', Auth::id())
                ->first();

            $canReview = $hasPurchased && ! $existingReview;
        }

        // Get reviews with pagination
        $reviewService = app(ReviewService::class);
        $sortBy = request()->get('sort_by', 'recent');
        $ratingFilter = request()->get('rating') ? (int) request()->get('rating') : null;
        $reviews = $reviewService->getProductReviews($data, $sortBy, 10, $ratingFilter);

        // Get average rating and review count
        $averageRating = $data->averageRating;
        $reviewCount = $data->reviewCount;

        // Get rating distribution
        $aggregationService = app(ReviewAggregationService::class);
        $ratingDistribution = $aggregationService->getRatingDistribution($data);

        // Record browsing history
        $browsingHistoryService = app(BrowsingHistoryService::class);
        $browsingHistoryService->recordView($data, Auth::user());

        // Get recommendations
        $recommendationService = app(RecommendationService::class);
        $recommendations = $recommendationService->getRecommendations($data, Auth::user());

        // Get section order from config
        $sectionOrder = RecommendationConfig::query()
            ->where('is_enabled', true)
            ->orderBy('display_order')
            ->pluck('section_type')
            ->toArray();

        $this->seo(
            title: $data->title,
            description: $data->short_description ?? $data->title,
            canonical: route('product.show', $data->slug),
        );

        return $this->render('user/pages/product/detail', [
            'data' => $data,
            'hasPurchased' => $hasPurchased,
            'canReview' => $canReview,
            'reviews' => $reviews,
            'averageRating' => $averageRating,
            'reviewCount' => $reviewCount,
            'ratingDistribution' => $ratingDistribution,
            'sortBy' => $sortBy,
            'ratingFilter' => $ratingFilter,
            'recommendations' => $recommendations,
            'sectionOrder' => $sectionOrder,
        ]);
    }

    public function productEnquiry(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'nullable|string',
            'product_id' => 'required|exists:products,id',
        ]);
        $data = new ProductEnquiry;
        $data->product_id = $request->product_id;
        $data->name = $request->name;
        $data->email = $request->email;
        $data->phone = $request->phone;
        $data->message = $request->message;
        $data->save();

        // Load the product relationship for the event
        $data->load('product');

        // Fire the event
        event(new ProductEnquirySubmitted($data));

        return redirect()->back()->with('success', 'Your enquiry has been submitted successfully.');
    }
}
