@component('mail::message')
# Reminder: {{ $appointment->dog->name }}'s Appointment! 🐾

This is a friendly reminder about your upcoming grooming appointment.

@component('mail::panel')
**When:** {{ $appointment->appointment_date->format('l, F j, Y') }} at {{ $appointment->appointment_time->format('g:i A') }}
**Dog:** {{ $appointment->dog->name }}
**Duration:** {{ $appointment->duration }} minutes
@endcomponent

## What to Bring
- ✓ Your dog's favorite treats
- ✓ Leash and collar
- ✓ Any special grooming instructions

## See You Soon!
We're excited to pamper {{ $appointment->dog->name }}! If you need to reschedule, please let us know as soon as possible.

@component('mail::button', ['url' => $dashboardUrl])
View Appointment Details
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
