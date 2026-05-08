<x-mail::message>
# Your Purchase Order Has Been Approved

Hello {{ $order->distributor?->name }},

Great news — your purchase order has been approved and stock has been transferred to your inventory.

<x-mail::panel>
**Order Number:** {{ $order->order_number }}  
**Total Amount:** {{ number_format($order->total_amount, 2) }}  
**Approved At:** {{ $order->approved_at?->format('F j, Y, g:i a') }}
</x-mail::panel>

<x-mail::button :url="route('distributor.purchase-orders.show', $order->id)">
View Order
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
