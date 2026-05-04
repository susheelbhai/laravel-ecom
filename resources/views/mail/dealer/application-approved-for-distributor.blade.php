<x-mail::message>
# Dealer account approved

Hello,

An administrator approved the dealer account you created.

<x-mail::panel>
**Dealer:** {{ $dealer->name }}  
**Email:** {{ $dealer->email }}  
**Phone:** {{ $dealer->phone ?? '—' }}
</x-mail::panel>

<x-mail::button :url="route('distributor.dealer.index')">
View dealers
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
