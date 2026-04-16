<?php

namespace App\Actions;

use App\Events\OrderPlaced;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class ConfirmOrder
{
    public function execute(int $userId, int $addressId, string $paymentMethod, bool $processImmediately = true, ?int $promoCodeId = null): array
    {
        try {
            DB::beginTransaction();

            // Get the user's cart
            $cart = Cart::where('user_id', $userId)
                ->with(['items.product.stockRecords.rack.warehouse'])
                ->first();

            if (! $cart || $cart->items->isEmpty()) {
                throw new \Exception('Cart is empty');
            }

            // Validate and lock stock for all cart items BEFORE creating orders
            $this->validateAndLockStock($cart->items);

            // Get the shipping address
            $shippingAddress = \App\Models\Address::findOrFail($addressId);

            // Group cart items by warehouse
            $itemsByWarehouse = $this->groupItemsByWarehouse($cart->items);

            if ($itemsByWarehouse->isEmpty()) {
                throw new \Exception('No warehouse found for cart items');
            }

            // Calculate total subtotal across all items
            $totalSubtotal = $cart->items->sum(function ($item) {
                return $item->price * $item->quantity;
            });

            // Apply promo code if provided
            $discountAmount = 0;
            $promoCode = null;
            $promoCodeUsed = null;

            if ($promoCodeId) {
                $promoCode = \App\Models\PromoCode::find($promoCodeId);

                if ($promoCode && $promoCode->isValid() && $promoCode->canBeUsedByUser($userId)) {
                    $discountAmount = $promoCode->calculateDiscount($totalSubtotal);
                    $promoCodeUsed = $promoCode->code;
                }
            }

            $orders = [];

            // Create separate order for each warehouse
            foreach ($itemsByWarehouse as $warehouseId => $items) {
                $warehouse = \App\Models\Warehouse::find($warehouseId);

                $warehouseSubtotal = $items->sum(function ($item) {
                    return $item->price * $item->quantity;
                });

                // Distribute discount proportionally based on subtotal
                $warehouseDiscount = $totalSubtotal > 0
                    ? ($warehouseSubtotal / $totalSubtotal) * $discountAmount
                    : 0;

                $warehouseTotal = $warehouseSubtotal - $warehouseDiscount;

                // Prepare order data with complete addresses
                $orderData = [
                    'user_id' => $userId,
                    'address_id' => $addressId,
                    'promo_code_id' => $promoCodeId,
                    'promo_code_used' => $promoCodeUsed,
                    'discount_amount' => $warehouseDiscount,
                    'subtotal_amount' => $warehouseSubtotal,
                    'order_number' => Order::generateOrderNumber(),
                    'total_amount' => $warehouseTotal,
                    'status' => 'pending',
                    'payment_status' => 'pending',
                    'payment_method' => $paymentMethod,
                    // Shipping address (customer delivery address)
                    'shipping_full_name' => $shippingAddress->full_name,
                    'shipping_phone' => $shippingAddress->phone,
                    'shipping_alternate_phone' => $shippingAddress->alternate_phone,
                    'shipping_address_line1' => $shippingAddress->address_line1,
                    'shipping_address_line2' => $shippingAddress->address_line2,
                    'shipping_city' => $shippingAddress->city,
                    'shipping_state' => $shippingAddress->state,
                    'shipping_country' => $shippingAddress->country,
                    'shipping_pincode' => $shippingAddress->pincode,
                    'shipping_landmark' => $shippingAddress->landmark,
                ];

                // Add pickup address from warehouse
                if ($warehouse) {
                    $orderData['warehouse_id'] = $warehouse->id;
                    $orderData['pickup_name'] = $warehouse->name;
                    $orderData['pickup_phone'] = $warehouse->phone;
                    $orderData['pickup_email'] = $warehouse->email;
                    $orderData['pickup_address_line1'] = $warehouse->address_line1 ?: $warehouse->address;
                    $orderData['pickup_address_line2'] = $warehouse->address_line2;
                    $orderData['pickup_city'] = $warehouse->city;
                    $orderData['pickup_state'] = $warehouse->state;
                    $orderData['pickup_country'] = $warehouse->country;
                    $orderData['pickup_pincode'] = $warehouse->pincode;
                }

                // Create order for this warehouse
                $order = Order::create($orderData);

                // If processImmediately is true (COD), create items and reduce stock
                if ($processImmediately) {
                    $this->processWarehouseOrder($order, $items);
                    $this->reduceStockForOrder($order, $items);
                }

                $orders[] = $order;
            }

            // If processImmediately is true, complete the cart processing
            if ($processImmediately) {
                // Increment promo code usage if applied (only once for all orders)
                if ($promoCode) {
                    $promoCode->incrementUsage($userId);
                }

                // Clear cart
                $cart->items()->delete();

                // Notify for each order
                foreach ($orders as $order) {
                    OrderPlaced::dispatch($order);
                }
            }

            DB::commit();

            return $orders;
        } catch (\Exception $e) {
            DB::rollBack();

            throw $e;
        }
    }

    public function completeOrder(Order $order): Order
    {
        try {
            DB::beginTransaction();

            // Get the user's cart
            $cart = Cart::where('user_id', $order->user_id)
                ->with('items.product')
                ->first();

            if (! $cart || $cart->items->isEmpty()) {
                throw new \Exception('Cart is empty');
            }

            // Get promo code if used
            $promoCode = $order->promo_code_id ? \App\Models\PromoCode::find($order->promo_code_id) : null;

            // If shipping address is not populated, populate it now
            if (! $order->shipping_full_name && $order->address_id) {
                $shippingAddress = \App\Models\Address::find($order->address_id);
                if ($shippingAddress) {
                    $order->update([
                        'shipping_full_name' => $shippingAddress->full_name,
                        'shipping_phone' => $shippingAddress->phone,
                        'shipping_alternate_phone' => $shippingAddress->alternate_phone,
                        'shipping_address_line1' => $shippingAddress->address_line1,
                        'shipping_address_line2' => $shippingAddress->address_line2,
                        'shipping_city' => $shippingAddress->city,
                        'shipping_state' => $shippingAddress->state,
                        'shipping_country' => $shippingAddress->country,
                        'shipping_pincode' => $shippingAddress->pincode,
                        'shipping_landmark' => $shippingAddress->landmark,
                    ]);
                }
            }

            // Validate and lock stock
            $this->validateAndLockStock($cart->items);

            // Process the order
            $this->processWarehouseOrder($order, $cart->items);

            // Reduce stock
            $this->reduceStockForOrder($order, $cart->items);

            // Update order status
            $order->update([
                'status' => 'processing',
                'payment_status' => $order->payment_method === 'cod' ? 'pending' : 'paid',
            ]);

            // Increment promo code usage if applied
            if ($promoCode) {
                $promoCode->incrementUsage($order->user_id);
            }

            // Clear cart
            $cart->items()->delete();

            // Notify user and admin
            OrderPlaced::dispatch($order);

            DB::commit();

            return $order;
        } catch (\Exception $e) {
            DB::rollBack();

            throw $e;
        }
    }

    private function groupItemsByWarehouse($cartItems)
    {
        $itemsByWarehouse = collect();

        foreach ($cartItems as $item) {
            // Get the warehouse with the highest stock for this product
            $stockRecord = $item->product->stockRecords()
                ->with('rack.warehouse')
                ->where('quantity', '>=', $item->quantity)
                ->orderBy('quantity', 'desc')
                ->first();

            if (! $stockRecord) {
                // If no single warehouse has enough stock, get the one with the most stock
                // For products without stock management, this will get any warehouse
                $stockRecord = $item->product->stockRecords()
                    ->with('rack.warehouse')
                    ->orderBy('quantity', 'desc')
                    ->first();
            }

            if (! $stockRecord || ! $stockRecord->rack || ! $stockRecord->rack->warehouse) {
                throw new \Exception("Product '{$item->product->title}' has no warehouse assigned");
            }

            $warehouseId = $stockRecord->rack->warehouse->id;

            if (! $itemsByWarehouse->has($warehouseId)) {
                $itemsByWarehouse->put($warehouseId, collect());
            }

            $itemsByWarehouse->get($warehouseId)->push($item);
        }

        return $itemsByWarehouse;
    }

    private function processWarehouseOrder(Order $order, $items): void
    {
        // Create order items
        foreach ($items as $cartItem) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $cartItem->product_id,
                'quantity' => $cartItem->quantity,
                'price' => $cartItem->price,
                'subtotal' => $cartItem->price * $cartItem->quantity,
            ]);
        }
    }

    private function validateAndLockStock($cartItems): void
    {
        foreach ($cartItems as $cartItem) {
            $product = $cartItem->product;

            // Skip stock validation if product doesn't manage stock
            if (! $product->manage_stock) {
                continue;
            }

            // Lock stock records for this product and calculate total available
            $totalAvailable = \App\Models\StockRecord::where('product_id', $product->id)
                ->where('quantity', '>', 0)
                ->lockForUpdate()
                ->sum('quantity');

            if ($totalAvailable < $cartItem->quantity) {
                throw new \Exception("Insufficient stock for product '{$product->title}'. Available: {$totalAvailable}, Requested: {$cartItem->quantity}");
            }
        }
    }

    private function reduceStockForOrder(Order $order, $items): void
    {
        foreach ($items as $cartItem) {
            $product = $cartItem->product;
            $quantityNeeded = $cartItem->quantity;

            // Skip if product doesn't manage stock
            if (! $product->manage_stock) {
                continue;
            }

            // Get available stock records ordered by created_at (FIFO)
            $stockRecords = \App\Models\StockRecord::where('product_id', $product->id)
                ->where('quantity', '>', 0)
                ->orderBy('created_at', 'asc')
                ->lockForUpdate()
                ->get();

            $remainingQuantity = $quantityNeeded;

            foreach ($stockRecords as $stockRecord) {
                if ($remainingQuantity <= 0) {
                    break;
                }

                $quantityToDeduct = min($remainingQuantity, $stockRecord->quantity);

                // Create stock movement for the deduction
                \App\Models\StockMovement::create([
                    'product_id' => $product->id,
                    'rack_id' => $stockRecord->rack_id,
                    'type' => 'out',
                    'quantity' => $quantityToDeduct,
                    'reason' => "Order #{$order->order_number} - Item sold",
                    'reference_type' => 'App\Models\Order',
                    'reference_id' => $order->id,
                    'created_by' => null,
                ]);

                // Recalculate stock record quantity
                $stockRecord->recalculateQuantity();

                $remainingQuantity -= $quantityToDeduct;
            }
        }
    }
}
