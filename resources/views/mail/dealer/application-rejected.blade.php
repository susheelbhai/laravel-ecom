<x-mail::message>
# Dealer account update

Hello {{ $dealer->name }},

Your dealer account application was not approved.

@if ($rejectionNote)
<x-mail::panel>
**Note:** {{ $rejectionNote }}
</x-mail::panel>
@endif

Please contact your distributor or support if you have questions.

<x-mail::button :url="route('dealer.login')">
Sign in
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
