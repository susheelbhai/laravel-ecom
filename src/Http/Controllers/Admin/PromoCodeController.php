<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PromoCodeRequest;
use App\Models\Partner;
use App\Models\PromoCode;
use Illuminate\Support\Facades\Redirect;

class PromoCodeController extends Controller
{
    public function index()
    {
        $data = PromoCode::with('partner')
            ->latest('id')
            ->paginate(15)
            ->through(function ($promoCode) {
                return [
                    'id' => $promoCode->id,
                    'code' => $promoCode->code,
                    'description' => $promoCode->description,
                    'discount_type' => $promoCode->discount_type,
                    'discount_value' => $promoCode->discount_value,
                    'min_order_amount' => $promoCode->min_order_amount,
                    'max_discount_amount' => $promoCode->max_discount_amount,
                    'usage_limit' => $promoCode->usage_limit,
                    'usage_count' => $promoCode->usage_count,
                    'per_user_limit' => $promoCode->per_user_limit,
                    'partner' => $promoCode->partner ? [
                        'id' => $promoCode->partner->id,
                        'name' => $promoCode->partner->name,
                    ] : null,
                    'is_active' => $promoCode->is_active,
                    'valid_from' => $promoCode->valid_from,
                    'valid_until' => $promoCode->valid_until,
                    'created_at' => $promoCode->created_at,
                ];
            });

        return $this->render('admin/resources/promo-code/index', compact('data'));
    }

    public function create()
    {
        $partners = Partner::latest()->get(['id', 'name']);

        return $this->render('admin/resources/promo-code/create', compact('partners'));
    }

    public function store(PromoCodeRequest $request)
    {
        $data = new PromoCode;
        $data->code = strtoupper($request->code);
        $data->description = $request->description;
        $data->discount_type = $request->discount_type;
        $data->discount_value = $request->discount_value;
        $data->min_order_amount = $request->min_order_amount;
        $data->max_discount_amount = $request->max_discount_amount;
        $data->usage_limit = $request->usage_limit;
        $data->per_user_limit = $request->per_user_limit;
        $data->partner_id = $request->partner_id;
        // $data->is_active = $request->is_active;
        $data->valid_from = $request->valid_from;
        $data->valid_until = $request->valid_until;
        $data->save();

        return Redirect::route('admin.promo-code.index')->with('success', 'New promo code created successfully');
    }

    public function show($id)
    {
        $data = PromoCode::with(['partner', 'orders'])->findOrFail($id);

        $promoCodeData = [
            ...$data->toArray(),
            'partner' => $data->partner ? [
                'id' => $data->partner->id,
                'name' => $data->partner->name,
                'email' => $data->partner->email,
            ] : null,
            'total_orders' => $data->orders->count(),
            'total_discount_given' => $data->orders->sum('discount_amount'),
        ];

        return $this->render('admin/resources/promo-code/show', ['data' => $promoCodeData]);
    }

    public function edit($id)
    {
        $data = PromoCode::with('partner')->findOrFail($id);
        $partners = Partner::latest()->get(['id', 'name']);

        return $this->render('admin/resources/promo-code/edit', compact('data', 'partners'));
    }

    public function update(PromoCodeRequest $request, $id)
    {
        $data = PromoCode::findOrFail($id);
        $data->code = strtoupper($request->code);
        $data->description = $request->description;
        $data->discount_type = $request->discount_type;
        $data->discount_value = $request->discount_value;
        $data->min_order_amount = $request->min_order_amount;
        $data->max_discount_amount = $request->max_discount_amount;
        $data->usage_limit = $request->usage_limit;
        $data->per_user_limit = $request->per_user_limit;
        $data->partner_id = $request->partner_id;
        $data->is_active = $request->is_active;
        $data->valid_from = $request->valid_from;
        $data->valid_until = $request->valid_until;
        $data->save();

        return Redirect::route('admin.promo-code.update', $id)->with('success', 'Promo code updated successfully');
    }

    public function destroy($id)
    {
        $promoCode = PromoCode::findOrFail($id);
        $promoCode->delete();

        return Redirect::route('admin.promo-code.index')->with('success', 'Promo code deleted successfully');
    }
}
