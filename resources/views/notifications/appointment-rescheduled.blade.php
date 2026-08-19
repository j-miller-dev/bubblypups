@component('mail::message')
# Hi {{ $customer->name }}! 🐶

Your appointment for {{ $appointment->dog->name }} has been rescheduled.

@component('mail::panel')
**Previous Time:**
~~{{ \Carbon\Carbon::parse($previousDate)->format('l, F j, Y') }} at {{ \Carbon\Carbon::parse($previousTime)->format('g:i A') }}~~

**New Time:**
**{{ $appointment->appointment_date->format('l, F j, Y') }} at {{ $appointment->appointment_time->format('g:i A') }}**
**Duration:** {{ $appointment->duration }} minutes
@endcomponent

Your appointment is confirmed at the new time — nothing else needed from you!

@if($appointment->notes)
## Note from Groomer
{{ $appointment->notes }}
@endif

@component('mail::button', ['url' => $dashboardUrl])
View My Appointments
@endcomponent

Need to change the time? Reply to this email or give us a call!

Thanks,<br>
{{ config('app.name') }}
@endcomponent
