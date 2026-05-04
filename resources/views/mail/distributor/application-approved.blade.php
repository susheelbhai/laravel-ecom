<x-mail::message>
# Application approved

Hello {{ $distributor->name }},

Your distributor application has been approved. You can sign in and use your distributor dashboard.

@if ($approvedBy)
<x-mail::panel>
Processed by: **{{ $approvedBy->name }}**
</x-mail::panel>
@endif

<x-mail::button :url="route('distributor.dashboard')">
Go to dashboard
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
