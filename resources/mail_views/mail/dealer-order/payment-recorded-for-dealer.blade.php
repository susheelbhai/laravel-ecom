<x-mail::message>
# Payment Received for Your Order

Hello {{ $order->dealer?->name }},

A payment has been recorded against your order.

<x-mail::panel>
**Order Number:** {{ $order->order_number }}  
**Amount Paid:** {{ number_format($payment->amount, 2) }}  
**Payment Method:** {{ ucfirst($payment->payment_method) }}  
**Order Total:** {{ number_format($order->total_amount, 2) }}  
**Amount Paid to Date:** {{ number_format($order->amount_paid, 2) }}  
**Remaining Balance:** {{ number_format(max(0, $order->total_amount - $order->amount_paid), 2) }}
</x-mail::panel>

<x-mail::button :url="route('dealer.orders.show', $order->id)">
View Order
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
