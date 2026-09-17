@component('mail::message')
# Appointment Cancelled ❌

A customer has cancelled their grooming appointment.

@component('mail::panel')
**Customer:** {{ $appointment->dog->customer->name }}
**Email:** {{ $appointment->dog->customer->email }}
**Phone:** {{ $appointment->dog->customer->phone }}

**Dog:** {{ $appointment->dog->name }} ({{ $appointment->dog->breed }})

**Was scheduled for:** {{ $appointment->appointment_date->format('l, F j, Y') }} at {{ $appointment->appointment_time->format('g:i A') }}
@endcomponent

This slot is now free again.

@component('mail::button', ['url' => route('dashboard.bookings')])
View Dashboard
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
