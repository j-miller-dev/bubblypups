@component('mail::message')
# Hi {{ $customer->name }},

We're sorry to let you know that the following appointment has been cancelled.

@component('mail::panel')
**When:** {{ $appointment->appointment_date->format('l, F j, Y') }} at {{ $appointment->appointment_time->format('g:i A') }}
**Dog:** {{ $appointment->dog->name }}
@endcomponent

If you'd like to rebook, you can do so at any time through our booking page.

@component('mail::button', ['url' => $bookingUrl])
Book a New Appointment
@endcomponent

We apologise for any inconvenience. Please don't hesitate to get in touch if you have any questions.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
