<?php

namespace App\Http\Controllers\Dealer;

use App\Http\Controllers\Controller;
use App\Models\WarrantyCard;
use Illuminate\Support\Facades\Auth;

class WarrantyCardController extends Controller
{
    public function index()
    {
        $dealerId = Auth::guard('dealer')->id();

        $data = WarrantyCard::query()
            ->where('dealer_id', $dealerId)
            ->with(['product:id,title,sku', 'serialNumber:id,serial_number', 'sale:id,sale_number'])
            ->latest('id')
            ->paginate(20)
            ->through(fn (WarrantyCard $card) => [
                'id' => $card->id,
                'card_number' => $card->card_number,
                'product_title' => $card->product?->title,
                'serial_number' => $card->serialNumber?->serial_number,
                'sale_number' => $card->sale?->sale_number,
                'purchase_date' => $card->purchase_date?->format('M d, Y'),
                'warranty_expires_at' => $card->warranty_expires_at?->format('M d, Y'),
                'is_expired' => $card->isExpired(),
            ]);

        return $this->render('dealer/warranty-cards/index', compact('data'));
    }

    public function show(WarrantyCard $warranty_card)
    {
        $dealerId = Auth::guard('dealer')->id();
        abort_unless($warranty_card->dealer_id === $dealerId, 403);

        $warranty_card->loadMissing([
            'product:id,title,sku',
            'serialNumber:id,serial_number',
            'sale:id,sale_number,customer_name,customer_phone,customer_email,billing_address_line1,billing_address_line2,billing_city,billing_state,billing_pincode,billing_country',
            'dealer:id,name',
        ]);

        $data = [
            'id' => $warranty_card->id,
            'card_number' => $warranty_card->card_number,
            'product_title' => $warranty_card->product?->title,
            'product_sku' => $warranty_card->product?->sku,
            'serial_number' => $warranty_card->serialNumber?->serial_number,
            'sale_number' => $warranty_card->sale?->sale_number,
            'dealer_name' => $warranty_card->dealer?->name,
            'customer_name' => $warranty_card->sale?->customer_name,
            'customer_phone' => $warranty_card->sale?->customer_phone,
            'customer_email' => $warranty_card->sale?->customer_email,
            'billing_address_line1' => $warranty_card->sale?->billing_address_line1,
            'billing_address_line2' => $warranty_card->sale?->billing_address_line2,
            'billing_city' => $warranty_card->sale?->billing_city,
            'billing_state' => $warranty_card->sale?->billing_state,
            'billing_pincode' => $warranty_card->sale?->billing_pincode,
            'billing_country' => $warranty_card->sale?->billing_country,
            'purchase_date' => $warranty_card->purchase_date?->format('M d, Y'),
            'warranty_expires_at' => $warranty_card->warranty_expires_at?->format('M d, Y'),
            'is_expired' => $warranty_card->isExpired(),
            'terms_snapshot' => $warranty_card->terms_snapshot,
        ];

        return $this->render('dealer/warranty-cards/show', compact('data'));
    }
}
