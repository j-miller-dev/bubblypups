@component('mail::message')
# New Appointment Request 🐾

A customer has requested a new grooming appointment!

@component('mail::panel')
**Customer:** {{ $appointment->dog->customer->name }}
**Email:** {{ $appointment->dog->customer->email }}
**Phone:** {{ $appointment->dog->customer->phone }}

**Dog:** {{ $appointment->dog->name }} ({{ $appointment->dog->breed }})
**Size:** {{ ucfirst($appointment->dog->size) }}

**Date:** {{ $appointment->appointment_date->format('l, F j, Y') }}
**Time:** {{ $appointment->appointment_time->format('g:i A') }}
**Duration:** {{ $appointment->duration }} minutes
@endcomponent

@if($appointment->notes)
## Special Notes
{{ $appointment->notes }}
@endif

@component('mail::button', ['url' => route('dashboard.bookings')])
View Dashboard
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
