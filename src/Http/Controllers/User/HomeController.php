<?php

namespace App\Http\Controllers\User;

use App\Events\ContactFormSubmitted;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserQueryRequest;
use App\Models\Faq;
use App\Models\Newsletter;
use App\Models\PageAbout;
use App\Models\PageContact;
use App\Models\PageHome;
use App\Models\PagePrivacy;
use App\Models\PageRefund;
use App\Models\PageTnc;
use App\Models\Portfolio;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Team;
use App\Models\Testimonial;
use App\Models\UserQuery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Response;

class HomeController extends Controller
{
    public function dashboard()
    {
        $team = Team::whereIsActive(1)->get();
        $testimonials = Testimonial::whereIsActive(1)->get();
        $clients = Portfolio::whereIsActive(1)->get();
        $data = PageHome::whereId(1)->first();

        return $this->render('user/pages/home/index', compact('testimonials', 'team', 'clients', 'data'));
    }

    public function home(Request $request)
    {
        $this->seo(
            title: 'E-commerse website developed by digamite private limited',
            description: 'E-commerse website developed by digamite private limited',
            canonical: route('home'),
            image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
        );
        $timingEnabled = (bool) $request->boolean('timing');
        $serverTiming = [];

        $tRequestStart = microtime(true);

        $dbTotalMs = 0.0;
        $dbQueryCount = 0;
        $dbSlowestMs = 0.0;
        $dbSlowestSql = null;
        if ($timingEnabled) {
            DB::listen(function ($query) use (&$dbTotalMs, &$dbQueryCount, &$dbSlowestMs, &$dbSlowestSql) {
                $dbQueryCount++;
                $timeMs = (float) ($query->time ?? 0);
                $dbTotalMs += $timeMs;
                if ($timeMs > $dbSlowestMs) {
                    $dbSlowestMs = $timeMs;
                    $dbSlowestSql = (string) ($query->sql ?? '');
                }
            });
        }

        $cacheKey = 'home:payload:v2';
        $cacheTtlSeconds = 60;

        $tCacheStart = microtime(true);
        $cacheHit = Cache::has($cacheKey);

        // Home pulls a lot of models + media; cache for snappy UX on large DBs.
        $payload = Cache::remember($cacheKey, $cacheTtlSeconds, function () {
            $team = Team::whereIsActive(1)->with('media')->get();
            $testimonials = Testimonial::whereIsActive(1)->with('media')->get();
            $clients = Portfolio::whereIsActive(1)->with('media')->get();
            $data = PageHome::whereId(1)->first();

            $productCategories = ProductCategory::whereIsActive(1)
                ->select(['id', 'title', 'slug', 'description'])
                ->with('media')
                ->get()
                ->map(function ($category) {
                    return [
                        'id' => $category->id,
                        'name' => $category->title,
                        'slug' => $category->slug,
                        'description' => $category->description,
                        'icon' => $category->getFirstMediaUrl('icon', 'thumb') ?: $category->getFirstMediaUrl('icon'),
                    ];
                })
                ->values()
                ->all();

            // Get featured products (narrow columns — avoid loading longText on large catalogs)
            $featuredProducts = Product::query()
                ->where('is_active', 1)
                ->where('is_featured', 1)
                ->select(['id', 'title', 'slug', 'price'])
                ->with('media')
                ->limit(8)
                ->get()
                ->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->title,
                        'slug' => $product->slug,
                        'price' => $product->price,
                        'image' => $product->getFirstMediaUrl('images', 'small') ?: $product->thumbnail,
                    ];
                })
                ->values()
                ->all();

            // Get best sellers (you can customize this logic based on order count)
            $bestSellers = Product::query()
                ->where('is_active', 1)
                ->select(['id', 'title', 'slug', 'price', 'created_at'])
                ->with('media')
                ->orderByDesc('created_at')
                ->limit(10)
                ->get()
                ->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->title,
                        'slug' => $product->slug,
                        'price' => $product->price,
                        'image' => $product->getFirstMediaUrl('images', 'small') ?: $product->thumbnail,
                    ];
                })
                ->values()
                ->all();

            return compact('team', 'testimonials', 'clients', 'data', 'productCategories', 'featuredProducts', 'bestSellers');
        });
        $serverTiming[] = sprintf('home_cache;dur=%.2f;desc="%s"', (microtime(true) - $tCacheStart) * 1000, $cacheHit ? 'hit' : 'miss');

        $tRenderStart = microtime(true);
        $response = $this->render('user/pages/home/index', $payload);
        $serverTiming[] = sprintf('home_render;dur=%.2f', (microtime(true) - $tRenderStart) * 1000);

        if ($timingEnabled) {
            $serverTiming[] = sprintf('db;dur=%.2f;desc="queries:%d"', $dbTotalMs, $dbQueryCount);
            if ($dbSlowestSql !== null) {
                $serverTiming[] = sprintf('db_slowest;dur=%.2f', $dbSlowestMs);
            }
            $serverTiming[] = sprintf('home_total;dur=%.2f', (microtime(true) - $tRequestStart) * 1000);

            $serverTimingHeader = implode(', ', $serverTiming);

            $slowestSqlShort = $dbSlowestSql ? mb_substr(preg_replace('/\s+/', ' ', $dbSlowestSql), 0, 180) : null;

            if ($response instanceof Response) {
                $http = $response->toResponse($request)->header('Server-Timing', $serverTimingHeader);
                if ($slowestSqlShort) {
                    $http->header('X-DB-Slowest', sprintf('%.2fms %s', $dbSlowestMs, $slowestSqlShort));
                }

                return $http;
            }

            $http = response($response)->header('Server-Timing', $serverTimingHeader);
            if ($slowestSqlShort) {
                $http->header('X-DB-Slowest', sprintf('%.2fms %s', $dbSlowestMs, $slowestSqlShort));
            }

            return $http;
        }

        return $response;
    }

    public function about()
    {
        $data = PageAbout::firstOrFail();

        $this->seo(
            title: 'About Us',
            description: 'Learn more about who we are, what drives us, and the vision that shapes everything we do.',
            canonical: route('about'),
        );

        return $this->render('user/pages/about/index', compact('data'));
    }

    public function contact()
    {
        $data = PageContact::firstOrFail();

        $this->seo(
            title: 'Contact Us',
            description: 'Contact Digamite for websites, mobile apps, and digital marketing. Reach our team by phone, email, or message—we typically reply within 24–48 business hours.',
            canonical: route('contact'),
        );

        return $this->render('user/pages/contact/index', compact('data'));
    }

    public function contactSubmit(UserQueryRequest $request)
    {
        $data = new UserQuery;
        $data->name = $request['name'];
        $data->email = $request['email'];
        $data->phone = $request['phone'];
        $data->subject = $request['subject'];
        $data->message = $request['message'];
        $data->save();
        event(new ContactFormSubmitted($data));

        return back()->with('success', 'You have successfully submitted the form');
    }

    public function newsletter(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255',
        ]);
        Newsletter::updateOrCreate(
            ['email' => $request['email']],
            ['unsubscribed_at' => null]
        );

        return back()->with('success', 'You have successfully subscribed to our newwsletter');
    }

    public function privacy()
    {
        $data = PagePrivacy::whereId(1)->first();

        $this->seo(
            title: 'Privacy Policy',
            description: 'Learn how we collect, use, and protect your personal data. Our privacy policy explains cookies, third parties, and your rights.',
            canonical: route('privacy'),
        );

        return $this->render('user/pages/privacy', compact('data'));
    }

    public function tnc()
    {
        $data = PageTnc::whereId(1)->first();

        $this->seo(
            title: 'Terms and Conditions',
            description: 'Read our terms and conditions for using our websites, apps, and digital services—billing, service scope, and your responsibilities.',
            canonical: route('tnc'),
        );

        return $this->render('user/pages/tnc', compact('data'));
    }

    public function refund()
    {
        $data = PageRefund::whereId(1)->first();

        $this->seo(
            title: 'Refund Policy',
            description: 'Understand our refund and cancellation policy—eligibility, timelines, and how to request a refund.',
            canonical: route('refund'),
        );

        return $this->render('user/pages/refund', compact('data'));
    }

    public function faq()
    {
        $faqs = Faq::where('is_active', 1)
            ->with('category')
            ->orderBy('faq_category_id')
            ->get()
            ->groupBy('faq_category_id')
            ->map(function ($items) {
                return [
                    'category_title' => $items->first()->category->title,
                    'faqs' => $items->map(function ($faq) {
                        return [
                            'id' => $faq->id,
                            'question' => $faq->question,
                            'answer' => $faq->answer,
                        ];
                    })->values(),
                ];
            });

        $data = $faqs->values();

        $this->seo(
            title: 'FAQ',
            description: 'Find answers to frequently asked questions.',
            canonical: route('faq'),
        );

        return $this->render('user/pages/faq', compact('data'));
    }
}
