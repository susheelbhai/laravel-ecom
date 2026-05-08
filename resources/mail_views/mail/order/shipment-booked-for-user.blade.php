<x-mail::message>
# Your Order Has Been Shipped

Hello {{ $order->user?->name }},

Great news — your order is on its way!

<x-mail::panel>
**Order Number:** {{ $order->order_number }}  
**Tracking Number:** {{ $trackingNumber }}
</x-mail::panel>

You can track your shipment using the button below.

<x-mail::button :url="route('order.shipping.track', $order->id)">
Track Shipment
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
