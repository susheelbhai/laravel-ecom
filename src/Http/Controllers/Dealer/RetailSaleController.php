<?php

namespace App\Http\Controllers\Dealer;

use App\Http\Controllers\Controller;
use App\Http\Requests\DealerRetailSaleStoreRequest;
use App\Models\DealerRetailSale;
use App\Models\Product;
use App\Services\Inventory\DefaultLocationService;
use App\Services\Inventory\StockTransferService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class RetailSaleController extends Controller
{
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
        $products = Product::query()
            ->select(['id', 'title', 'sku', 'price', 'manage_stock'])
            ->orderBy('title')
            ->limit(200)
            ->get();

        return $this->render('dealer/retail-sales/create', compact('products'));
    }

    public function store(DealerRetailSaleStoreRequest $request, StockTransferService $stockTransfer, DefaultLocationService $defaultLocation): RedirectResponse
    {
        $dealer = Auth::guard('dealer')->user();
        abort_unless($dealer, 401);

        $validated = $request->validated();

        try {
            $sale = DB::transaction(function () use ($validated, $dealer, $stockTransfer, $defaultLocation) {
                $itemsInput = collect($validated['items'])->map(function ($row) {
                    return [
                        'product_id' => (int) $row['product_id'],
                        'quantity' => (int) $row['quantity'],
                        'unit_price' => $row['unit_price'] ?? null,
                    ];
                });

                /** @var Collection<int,Product> $products */
                $products = Product::query()
                    ->whereIn('id', $itemsInput->pluck('product_id'))
                    ->get()
                    ->keyBy('id');

                $lineItems = $itemsInput->map(function (array $item) use ($products) {
                    $product = $products->get($item['product_id']);
                    if (! $product || $product->price === null) {
                        abort(422, 'Price not set for one or more products.');
                    }

                    $base = (float) $product->price;
                    $override = $item['unit_price'] !== null ? (float) $item['unit_price'] : null;
                    $unitPrice = $override ?? $base;
                    $subtotal = $unitPrice * $item['quantity'];

                    return [
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $unitPrice,
                        'subtotal' => $subtotal,
                    ];
                });

                $subtotalAmount = (float) $lineItems->sum('subtotal');

                $sale = DealerRetailSale::create([
                    'sale_number' => DealerRetailSale::generateSaleNumber(),
                    'status' => 'completed',
                    'dealer_id' => $dealer->id,
                    'created_by_dealer_id' => $dealer->id,
                    'subtotal_amount' => $subtotalAmount,
                    'total_amount' => $subtotalAmount,
                    'customer_name' => $validated['customer_name'],
                    'customer_email' => $validated['customer_email'] ?? null,
                    'customer_phone' => $validated['customer_phone'],
                    'billing_address_line1' => $validated['billing_address_line1'],
                    'billing_address_line2' => $validated['billing_address_line2'] ?? null,
                    'billing_city' => $validated['billing_city'],
                    'billing_state' => $validated['billing_state'],
                    'billing_pincode' => $validated['billing_pincode'],
                    'billing_country' => $validated['billing_country'] ?? 'India',
                    'customer_gstin' => $validated['customer_gstin'] ?? null,
                ]);

                $sale->items()->createMany($lineItems->map(fn ($li) => [
                    'product_id' => $li['product_id'],
                    'quantity' => $li['quantity'],
                    'unit_price' => $li['unit_price'],
                    'subtotal' => $li['subtotal'],
                ])->all());

                $rack = $defaultLocation->ensureDealerDefaultRack($dealer);

                $consumeItems = $itemsInput->map(fn ($x) => [
                    'product_id' => $x['product_id'],
                    'quantity' => $x['quantity'],
                ]);

                $stockTransfer->consumeStock(
                    $rack->id,
                    $consumeItems,
                    $sale,
                    "Retail sale #{$sale->sale_number}"
                );

                return $sale;
            });
        } catch (RuntimeException $e) {
            $msg = $e->getMessage();
            $messages = ['items' => [$msg]];

            if (preg_match('/product\s+(\d+)/i', $msg, $m)) {
                $productId = (int) $m[1];
                foreach ($validated['items'] as $idx => $row) {
                    if ((int) ($row['product_id'] ?? 0) === $productId) {
                        $messages["items.$idx.quantity"] = [$msg];
                        break;
                    }
                }
            }

            throw ValidationException::withMessages($messages);
        }

        return redirect()->route('dealer.retail-sales.show', $sale)->with('success', 'Retail sale recorded.');
    }

    public function show(DealerRetailSale $retail_sale)
    {
        $dealerId = Auth::guard('dealer')->id();
        abort_unless($retail_sale->dealer_id === $dealerId, 403);

        $retail_sale->loadMissing(['items.product']);

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
            'billing_state' => $retail_sale->billing_state,
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
            'created_at' => $retail_sale->created_at?->format('M d, Y H:i'),
        ];

        return $this->render('dealer/retail-sales/show', compact('data'));
    }
}
