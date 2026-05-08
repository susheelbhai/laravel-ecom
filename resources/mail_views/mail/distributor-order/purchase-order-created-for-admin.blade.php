<x-mail::message>
# New Purchase Order from Distributor

Dear Admin,

A distributor has submitted a new purchase order pending your review.

<x-mail::panel>
**Order Number:** {{ $order->order_number }}  
**Distributor:** {{ $order->distributor?->name }} ({{ $order->distributor?->legal_business_name }})  
**Total Amount:** {{ number_format($order->total_amount, 2) }}  
**Placed At:** {{ $order->created_at->format('F j, Y, g:i a') }}
</x-mail::panel>

<x-mail::button :url="route('admin.distributor-orders.show', $order->id)">
Review Order
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
