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

@if($appointment->status === 'waiting_on_client')
## Please Confirm
We've proposed a new time for your appointment. Please confirm if this works for you:

@component('mail::button', ['url' => $confirmUrl, 'color' => 'success'])
✓ Confirm This Time Works
@endcomponent

Or if you need a different time, please let us know.
@else
## Confirmed
Your appointment has been rescheduled and confirmed at the new time.
@endif

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
