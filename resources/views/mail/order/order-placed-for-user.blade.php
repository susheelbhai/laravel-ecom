<x-mail::message>
# Thank You for Your Order!

Hello {{ $order->user->name }},

Your order has been successfully placed. We're preparing it for you!

<x-mail::panel>
**Order Number:** {{ $order->order_number }}  
**Order Date:** {{ $order->created_at->format('F j, Y, g:i a') }}  
**Total Amount:** {{ number_format($order->total_amount, 2) }}  
**Payment Method:** {{ ucfirst($order->payment_method) }}  
**Payment Status:** {{ ucfirst($order->payment_status) }}
</x-mail::panel>

## Order Items
@foreach ($order->items as $item)
- {{ $item->product->title }} × {{ $item->quantity }} - {{ number_format($item->price * $item->quantity, 2) }}
@endforeach

@if ($order->address)
## Shipping Address
{{ $order->address->address_line1 }}@if ($order->address->address_line2), {{ $order->address->address_line2 }}@endif  
{{ $order->address->city }}, {{ $order->address->state }} {{ $order->address->pincode }}  
{{ $order->address->country }}
@endif

<x-mail::button :url="config('app.url')">
Visit Our Website
</x-mail::button>

If you have any questions about your order, please reply to this email.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
