<x-mail::message>
# New dealer pending approval

Dear Admin,

A distributor added a dealer account that needs administrator approval.

<x-mail::panel>
**Dealer:** {{ $dealer->name }}  
**Email:** {{ $dealer->email }}  
**Phone:** {{ $dealer->phone ?? '—' }}  
**Distributor:** {{ $dealer->distributor?->name ?? '—' }}  
@if ($dealer->distributor)
**Distributor email:** {{ $dealer->distributor->email }}
@endif
</x-mail::panel>

<x-mail::button :url="route('admin.dealer.index')">
Review dealers
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
