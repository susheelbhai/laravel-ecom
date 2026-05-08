<?php

namespace App\Http\Controllers\Dealer;

use App\Contracts\SerialNumberMovementServiceInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\DealerRetailSaleStoreRequest;
use App\Models\DealerRetailSale;
use App\Models\Product;
use App\Models\SerialNumber;
use App\Models\State;
use App\Services\Inventory\DefaultLocationService;
use App\Services\Inventory\StockTransferService;
use App\Services\WarrantyCardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class RetailSaleController extends Controller
{
    public function __construct(
        private readonly SerialNumberMovementServiceInterface $serialNumberMovementService,
    ) {}

    public function index()
    {
        $dealerId = Auth::guard('dealer')->id();

        $data = DealerRetailSale::query()
            ->where('dealer_id', $dealerId)
            ->latest('id')
            ->paginate(15)
            ->through(fn (DealerRetailSale $sale) => [
                'id' => $sale->id,
                'sale_number' => $sale->sale_number,
                'status' => $sale->status,
                'subtotal_amount' => $sale->subtotal_amount,
                'total_amount' => $sale->total_amount,
                'created_at' => $sale->created_at?->format('M d, Y'),
            ]);

        return $this->render('dealer/retail-sales/index', compact('data'));
    }

    public function create()
    {
        $dealer = Auth::guard('dealer')->user();
        $commissionPercentage = (float) ($dealer->commission_percentage ?? 0);
        $states = State::orderBy('name')->get(['id', 'name', 'gst_state_code']);

        return $this->render('dealer/retail-sales/create', compact('commissionPercentage', 'states'));
    }

    /**
     * Search products available in the dealer's stock.
     *
     * GET /dealer/products/search?q=...
     */
    public function productSearch(Request $request): JsonResponse
    {
        $dealer = Auth::guard('dealer')->user();
        $q = trim((string) $request->query('q', ''));

        if (mb_strlen($q) < 2) {
            return response()->json(['results' => []]);
        }

        $escaped = '%'.addcslashes($q, '%_\\').'%';

        $products = Product::query()
            ->select(['id', 'title', 'sku', 'price'])
            ->where(function ($query) use ($escaped) {
                $query->where('title', 'like', $escaped)
                    ->orWhere('sku', 'like', $escaped);
            })
            ->orderBy('title')
            ->limit(30)
            ->get();

        return response()->json([
            'results' => $products->map(fn (Product $p) => [
                'id' => $p->id,
                'label' => $p->sku ? "{$p->title} ({$p->sku})" : $p->title,
                'purchase_price' => $this->dealerPurchasePrice($dealer->id, $p->id) ?? $p->price,
            ]),
        ]);
    }

    /**
     * Return available serial numbers for a product in the dealer's default rack.
     *
     * GET /dealer/products/{product}/serials
     */
    public function productSerials(Product $product, DefaultLocationService $defaultLocation): JsonResponse
    {
        $dealer = Auth::guard('dealer')->user();
        $rack = $defaultLocation->ensureDealerDefaultRack($dealer);

        $serials = SerialNumber::where('product_id', $product->id)
            ->where('rack_id', $rack->id)
            ->where('status', 'available')
            ->orderBy('serial_number')
            ->pluck('serial_number');

        return response()->json(['serial_numbers' => $serials]);
    }

    /**
     * Return the dealer's purchase price for a product (from their most recent order).
     *
     * GET /dealer/products/{product}/price
     */
    public function productPrice(Product $product): JsonResponse
    {
        $dealer = Auth::guard('dealer')->user();
        $purchasePrice = $this->dealerPurchasePrice($dealer->id, $product->id) ?? $product->price;

        return response()->json([
            'purchase_price' => $purchasePrice,
        ]);
    }

    /**
     * Resolve the unit price the dealer last paid for a product via a dealer order.
     * Falls back to null if no order history exists.
     */
    private function dealerPurchasePrice(int $dealerId, int $productId): ?float
    {
        $price = DB::table('dealer_order_items')
            ->join('dealer_orders', 'dealer_orders.id', '=', 'dealer_order_items.dealer_order_id')
            ->where('dealer_orders.dealer_id', $dealerId)
            ->where('dealer_order_items.product_id', $productId)
            ->orderByDesc('dealer_order_items.id')
            ->value('dealer_order_items.unit_price');

        return $price !== null ? (float) $price : null;
    }

    public function store(DealerRetailSaleStoreRequest $request, StockTransferService $stockTransfer, DefaultLocationService $defaultLocation): RedirectResponse
    {
        $dealer = Auth::guard('dealer')->user();
        abort_unless($dealer, 401);

        $validated = $request->validated();

        try {
            $sale = DB::transaction(function () use ($validated, $dealer, $stockTransfer, $defaultLocation) {
                $product = Product::findOrFail((int) $validated['product_id']);

                $base = $this->dealerPurchasePrice($dealer->id, $product->id) ?? (float) ($product->price ?? 0);
                $override = isset($validated['unit_price']) && $validated['unit_price'] !== null
                    ? (float) $validated['unit_price']
                    : null;
                $unitPrice = $override ?? $base;
                $quantity = (int) $validated['quantity'];
                $subtotal = $unitPrice * $quantity;

                $sale = DealerRetailSale::create([
                    'sale_number' => DealerRetailSale::generateSaleNumber(),
                    'status' => 'completed',
                    'dealer_id' => $dealer->id,
                    'created_by_dealer_id' => $dealer->id,
                    'subtotal_amount' => $subtotal,
                    'total_amount' => $subtotal,
                    'customer_name' => $validated['customer_name'],
                    'customer_email' => $validated['customer_email'] ?? null,
                    'customer_phone' => $validated['customer_phone'],
                    'billing_address_line1' => $validated['billing_address_line1'],
                    'billing_address_line2' => $validated['billing_address_line2'] ?? null,
                    'billing_city' => $validated['billing_city'],
                    'billing_state_id' => $validated['billing_state_id'],
                    'billing_pincode' => $validated['billing_pincode'],
                    'billing_country' => $validated['billing_country'] ?? 'India',
                    'customer_gstin' => $validated['customer_gstin'] ?? null,
                ]);

                $saleItem = $sale->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'subtotal' => $subtotal,
                ]);

                $serialNumbers = $validated['serial_numbers'] ?? [];
                $serialNumbersBySaleItemId = [];

                if (! empty($serialNumbers)) {
                    $this->serialNumberMovementService->validateAndConsume(
                        serialNumber: $serialNumbers[0],
                        productId: $product->id,
                        saleItem: $saleItem,
                        actor: $dealer,
                    );
                    $serialNumbersBySaleItemId[$saleItem->id] = $serialNumbers[0];
                }

                $rack = $defaultLocation->ensureDealerDefaultRack($dealer);

                $stockTransfer->consumeStock(
                    $rack->id,
                    collect([['product_id' => $product->id, 'quantity' => $quantity]]),
                    $sale,
                    "Retail sale #{$sale->sale_number}",
                );

                app(WarrantyCardService::class)->generateForSale($sale, $serialNumbersBySaleItemId);

                return $sale;
            });
        } catch (RuntimeException $e) {
            throw ValidationException::withMessages(['product_id' => [$e->getMessage()]]);
        }

        return redirect()->route('dealer.retail-sales.show', $sale)->with('success', 'Retail sale recorded.');
    }

    public function show(DealerRetailSale $retail_sale)
    {
        $dealerId = Auth::guard('dealer')->id();
        abort_unless($retail_sale->dealer_id === $dealerId, 403);

        $retail_sale->loadMissing(['items.product', 'warrantyCards.serialNumber', 'warrantyCards.product', 'billingState']);

        $data = [
            'id' => $retail_sale->id,
            'sale_number' => $retail_sale->sale_number,
            'status' => $retail_sale->status,
            'subtotal_amount' => $retail_sale->subtotal_amount,
            'total_amount' => $retail_sale->total_amount,
            'customer_name' => $retail_sale->customer_name,
            'customer_email' => $retail_sale->customer_email,
            'customer_phone' => $retail_sale->customer_phone,
            'billing_address_line1' => $retail_sale->billing_address_line1,
            'billing_address_line2' => $retail_sale->billing_address_line2,
            'billing_city' => $retail_sale->billing_city,
            'billing_state' => $retail_sale->billingState?->name,
            'billing_pincode' => $retail_sale->billing_pincode,
            'billing_country' => $retail_sale->billing_country,
            'customer_gstin' => $retail_sale->customer_gstin,
            'items' => $retail_sale->items->map(fn ($item) => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_title' => $item->product?->title,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'subtotal' => $item->subtotal,
            ]),
            'warranty_cards' => $retail_sale->warrantyCards->map(fn ($card) => [
                'id' => $card->id,
                'card_number' => $card->card_number,
                'product_title' => $card->product?->title,
                'serial_number' => $card->serialNumber?->serial_number,
                'purchase_date' => $card->purchase_date?->format('M d, Y'),
                'warranty_expires_at' => $card->warranty_expires_at?->format('M d, Y'),
                'is_expired' => $card->isExpired(),
                'terms_snapshot' => $card->terms_snapshot,
            ]),
            'created_at' => $retail_sale->created_at?->format('M d, Y H:i'),
        ];

        return $this->render('dealer/retail-sales/show', compact('data'));
    }
}
