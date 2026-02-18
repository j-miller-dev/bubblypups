@component('mail::message')
# Hi {{ $customer->name }}! 🐶

We've booked a grooming appointment for {{ $appointment->dog->name }}!

@component('mail::panel')
**When:** {{ $appointment->appointment_date->format('l, F j, Y') }} at {{ $appointment->appointment_time->format('g:i A') }}
**Duration:** {{ $appointment->duration }} minutes
**Service:** {{ $appointment->service->emoji }} {{ $appointment->service->name }}
**Dog:** {{ $appointment->dog->name }}
@endcomponent

## What to Bring
- Your dog's favorite treats
- Leash and collar
- Any special grooming instructions

@if($appointment->notes)
## Notes
{{ $appointment->notes }}
@endif

Questions? Reply to this email or give us a call!

Thanks,<br>
{{ config('app.name') }}
@endcomponent
