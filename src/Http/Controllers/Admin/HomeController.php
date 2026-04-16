<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

class HomeController extends Controller
{
    public function dashboard(Request $request)
    {
        // Get key metrics
        $totalProducts = Product::count();
        $activeProducts = Product::where('is_active', 1)->count();

        $stockByProduct = DB::table('stock_movements')
            ->select('product_id')
            ->selectRaw(
                "SUM(CASE WHEN `type` IN ('in', 'transfer_in', 'adjustment') THEN `quantity` ELSE -`quantity` END) AS total_stock"
            )
            ->groupBy('product_id');

        // Count products by stock level (based on movements only; products with no movements are not counted here)
        $outOfStockProducts = DB::query()
            ->fromSub($stockByProduct, 's')
            ->where('s.total_stock', '<=', 0)
            ->count();

        $lowStockProducts = DB::query()
            ->fromSub($stockByProduct, 's')
            ->where('s.total_stock', '>', 0)
            ->where('s.total_stock', '<=', 10)
            ->count();

        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $completedOrders = Order::where('status', 'completed')->count();
        // Calculate revenue from processing and completed orders (confirmed orders)
        $totalRevenue = Order::whereIn('status', ['processing', 'completed'])->sum('total_amount');

        $totalUsers = User::count();
        $newUsersThisMonth = User::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        // Recent orders
        $recentOrders = Order::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'user_name' => $order->user->name ?? 'Guest',
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'created_at' => $order->created_at->format('M d, Y'),
                ];
            });

        // Stock alert products - get products with total stock <= 10 based on stock_movements aggregation.
        $lowStockProductsList = Product::query()
            ->leftJoinSub($stockByProduct, 's', function ($join) {
                $join->on('products.id', '=', 's.product_id');
            })
            ->select(['products.id', 'products.title', 'products.price'])
            ->selectRaw('COALESCE(s.total_stock, 0) AS total_stock')
            ->whereRaw('COALESCE(s.total_stock, 0) <= 10')
            ->orderBy('total_stock')
            ->limit(5)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'title' => $product->title,
                    'stock' => (int) $product->total_stock,
                    'price' => $product->price,
                ];
            })
            ->values();

        // Top selling products (based on order items)
        $topProducts = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->select('products.id', 'products.title', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->groupBy('products.id', 'products.title')
            ->orderByDesc('total_sold')
            ->take(5)
            ->get();

        return $this->render('admin/dashboard', [
            'submitUrl' => route('admin.login'),
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
            'metrics' => [
                'products' => [
                    'total' => $totalProducts,
                    'active' => $activeProducts,
                    'low_stock' => $lowStockProducts,
                    'out_of_stock' => $outOfStockProducts,
                ],
                'orders' => [
                    'total' => $totalOrders,
                    'pending' => $pendingOrders,
                    'completed' => $completedOrders,
                    'revenue' => $totalRevenue,
                ],
                'users' => [
                    'total' => $totalUsers,
                    'new_this_month' => $newUsersThisMonth,
                ],
            ],
            'recentOrders' => $recentOrders,
            'lowStockProducts' => $lowStockProductsList,
            'topProducts' => $topProducts,
        ]);
    }
}
