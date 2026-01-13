@component('mail::message')
# Hi {{ $customer->name }}! 🐶

Great news! We've confirmed {{ $appointment->dog->name }}'s grooming appointment.

@component('mail::panel')
**When:** {{ $appointment->appointment_date->format('l, F j, Y') }} at {{ $appointment->appointment_time->format('g:i A') }}
**Duration:** {{ $appointment->duration }} minutes
**Dog:** {{ $appointment->dog->name }}
@endcomponent

## What to Bring
- Your dog's favorite treats
- Leash and collar
- Any special grooming instructions

@component('mail::button', ['url' => $dashboardUrl])
View My Appointments
@endcomponent

Questions? Reply to this email or give us a call!

Thanks,<br>
{{ config('app.name') }}
@endcomponent
