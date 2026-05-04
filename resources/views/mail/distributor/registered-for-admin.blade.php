<x-mail::message>
# New distributor application

Dear Admin,

A new distributor has registered and is pending review.

<x-mail::panel>
**Legal name:** {{ $distributor->legal_business_name }}  
**Signatory:** {{ $distributor->name }}  
**Email:** {{ $distributor->email }}  
**Phone:** {{ $distributor->phone ?? '—' }}  
**GSTIN:** {{ $distributor->gstin ?? '—' }}
</x-mail::panel>

<x-mail::button :url="route('admin.distributor.index')">
Review applications
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
