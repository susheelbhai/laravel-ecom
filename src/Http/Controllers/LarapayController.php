<?php

namespace App\Http\Controllers\User;

use App\Actions\ConfirmOrder;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Susheelbhai\Larapay\Models\Payment;
use Susheelbhai\Larapay\Models\PaymentRefund;
use Susheelbhai\Larapay\Models\PaymentTemp;

class LarapayController extends Controller
{
    public function preOrderMethod(Request $request, $gateway): void
    {
        $input = $request->all();
        $request_from = request()->headers->get('referer');
        $request['gst_percentage'] = 18;
        $request['gst'] = 0.01 * $request['gst_percentage'];
        $request['customer_id'] = Auth::guard('web')->user()->id;
        $request['name'] = Auth::guard('web')->user()->name;
        $request['phone'] = Auth::guard('web')->user()->phone ?? '';
        $request['email'] = Auth::guard('web')->user()->email;
        // dd($request->all());
    }

    public function postOrderMethod(Request $request, $order_id, $gateway): void
    {
        $input = $request->all();

        $temp_data = [
            'payment_gateway_id' => $gateway,
            'amount' => $input['amount'],
            'email' => $input['email'],
            'phone' => $input['phone'] ?? '',
            'user_id' => Auth::guard('web')->user()->id,
            'payable_type' => Order::class,
            'payable_id' => 1,
        ];

        PaymentTemp::updateOrCreate(
            ['order_id' => $order_id],
            $temp_data
        );
        $a = Order::where('order_number', $request->order_number)->update([
            'payment_gateway_order_id' => $order_id,
        ]);
        // dd($a);
        // dd($request->all(), $order_id);
    }

    public function paymentSuccessful($request, $data, $payment_temp)
    {
        // dd($data, $payment_temp);
        $orderNumber = $data['payment_data']['order_id'];

        // Find the existing order
        $order = Order::where('payment_gateway_order_id', $orderNumber)->first();
        // dd($order);
        if (! $order) {
            return false;
        }

        // Complete the order (process items, clear cart, etc.)
        app(ConfirmOrder::class)->completeOrder($order);

        Payment::updateOrCreate(
            ['payment_id' => $data['payment_data']['payment_id']],
            [
                'order_id' => $orderNumber,
                'amount' => $payment_temp['amount'],
                'payment_gateway_id' => $payment_temp['payment_gateway_id'],
                'payment_status' => 1,
                'payable_type' => Order::class,
                'payable_id' => $order->id,
            ]
        );

        return true;
    }

    public function paymentFailed($request): bool
    {
        // Find the order
        $order = Order::where('order_number', $request['order_id'])->first();

        if (! $order) {
            return false;
        }

        PaymentTemp::updateOrCreate(
            ['order_id' => $request['order_id']],
            [
                'payment_status' => 0,
                'payable_type' => Order::class,
                'payable_id' => $order->id,
            ]
        );

        // Update order payment status
        $order->update([
            'payment_status' => 'failed',
        ]);

        return true;
    }

    public function paymentRefunded($payment_data, $response): bool
    {
        if ($response['status'] == 'processed') {
            PaymentRefund::updateOrCreate(
                [
                    'payment_id' => $payment_data['id'],
                    'refund_id' => $response['refund_id'],
                    'amount' => $response['amount_refunded'],
                ]
            );
        }

        return true;
    }
}
