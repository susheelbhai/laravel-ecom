<x-mail::message>
# Dealer account approved

Hello {{ $dealer->name }},

Your dealer account has been approved. You can sign in and use your dashboard.

@if ($approvedBy)
<x-mail::panel>
Processed by: **{{ $approvedBy->name }}**
</x-mail::panel>
@endif

<x-mail::button :url="route('dealer.dashboard')">
Go to dashboard
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
