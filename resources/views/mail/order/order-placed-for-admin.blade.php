<x-mail::message>
# New Order Received

Dear Admin,

A new order has been placed on your website.

<x-mail::panel>
**Order Number:** {{ $order->order_number }}  
**Customer:** {{ $order->user->name }}  
**Email:** {{ $order->user->email }}  
**Total Amount:** {{ number_format($order->total_amount, 2) }}  
**Payment Method:** {{ ucfirst($order->payment_method) }}  
**Payment Status:** {{ ucfirst($order->payment_status) }}  
**Order Status:** {{ ucfirst($order->status) }}
</x-mail::panel>

## Order Items
@foreach ($order->items as $item)
- {{ $item->product->title }} × {{ $item->quantity }} - {{ number_format($item->price * $item->quantity, 2) }}
@endforeach

<x-mail::button :url="route('admin.order.show', $order->id)">
View Order Details
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
