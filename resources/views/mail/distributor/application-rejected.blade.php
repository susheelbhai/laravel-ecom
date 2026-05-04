<x-mail::message>
# Application update

Hello {{ $distributor->name }},

Your distributor application was not approved.

@if ($rejectionNote)
<x-mail::panel>
**Note:** {{ $rejectionNote }}
</x-mail::panel>
@endif

If you have questions, please contact support.

<x-mail::button :url="route('distributor.login')">
Sign in
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
