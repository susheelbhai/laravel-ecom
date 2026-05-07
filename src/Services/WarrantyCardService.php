<?php

namespace App\Services;

use App\Models\DealerRetailSale;
use App\Models\SerialNumber;
use App\Models\WarrantyCard;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class WarrantyCardService
{
    /**
     * Generate warranty cards for all items in a retail sale that have warranty configured.
     * One card is generated per sale item (not per unit quantity).
     *
     * @param  array<int, string|null>  $serialNumbersBySaleItemId  Map of sale_item_id => serial_number string (optional)
     */
    public function generateForSale(DealerRetailSale $sale, array $serialNumbersBySaleItemId = []): Collection
    {
        $sale->loadMissing(['items.product.warranty']);

        $purchaseDate = Carbon::today();
        $cards = collect();

        foreach ($sale->items as $item) {
            $warranty = $item->product?->warranty;

            if (! $warranty) {
                continue;
            }

            $expiryDate = $warranty->calculateExpiryDate($purchaseDate);

            // Resolve serial number if provided
            $serialNumberId = null;
            $serialNumberString = $serialNumbersBySaleItemId[$item->id] ?? null;

            if ($serialNumberString) {
                $serialRecord = SerialNumber::where('serial_number', $serialNumberString)
                    ->where('product_id', $item->product_id)
                    ->first();

                if ($serialRecord) {
                    $serialNumberId = $serialRecord->id;
                }
            }

            $card = WarrantyCard::create([
                'card_number' => WarrantyCard::generateCardNumber(),
                'dealer_retail_sale_id' => $sale->id,
                'dealer_retail_sale_item_id' => $item->id,
                'product_id' => $item->product_id,
                'serial_number_id' => $serialNumberId,
                'dealer_id' => $sale->dealer_id,
                'purchase_date' => $purchaseDate,
                'warranty_expires_at' => $expiryDate,
                'terms_snapshot' => $warranty->terms,
            ]);

            $cards->push($card);
        }

        return $cards;
    }
}
