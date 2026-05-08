<x-mail::message>
# New Order Placed for You

Hello {{ $order->dealer?->name }},

Your distributor has placed a new order for you. Stock has been transferred to your inventory.

<x-mail::panel>
**Order Number:** {{ $order->order_number }}  
**Total Amount:** {{ number_format($order->total_amount, 2) }}  
**Placed At:** {{ $order->created_at->format('F j, Y, g:i a') }}
</x-mail::panel>

<x-mail::button :url="route('dealer.orders.show', $order->id)">
View Order
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
