<x-mail::message>
# Update on Your Purchase Order

Hello {{ $order->distributor?->name }},

Your purchase order could not be approved at this time.

<x-mail::panel>
**Order Number:** {{ $order->order_number }}  
**Total Amount:** {{ number_format($order->total_amount, 2) }}
</x-mail::panel>

@if ($rejectionNote)
<x-mail::panel>
**Reason:** {{ $rejectionNote }}
</x-mail::panel>
@endif

If you have questions, please contact support.

<x-mail::button :url="route('distributor.purchase-orders.show', $order->id)">
View Order
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
