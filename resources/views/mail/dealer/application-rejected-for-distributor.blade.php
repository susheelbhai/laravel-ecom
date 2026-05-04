<x-mail::message>
# Dealer account not approved

Hello,

An administrator did not approve the dealer account you created.

<x-mail::panel>
**Dealer:** {{ $dealer->name }}  
**Email:** {{ $dealer->email }}
</x-mail::panel>

@if ($rejectionNote)
<x-mail::panel>
**Note:** {{ $rejectionNote }}
</x-mail::panel>
@endif

<x-mail::button :url="route('distributor.dealer.index')">
View dealers
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
