<x-mail::message>
# Serial Number Marked as Damaged

Dear Admin,

A serial number has been marked as damaged.

<x-mail::panel>
**Serial Number:** {{ $serialNumber->serial_number }}  
**Product:** {{ $serialNumber->product?->title ?? '—' }}  
**Marked By:** {{ $actor->name ?? '—' }}
</x-mail::panel>

<x-mail::button :url="route('admin.serial-numbers.show', $serialNumber->id)">
View Serial Number
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
