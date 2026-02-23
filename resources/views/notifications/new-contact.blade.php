@component('mail::message')
# New Contact Message 🐾

Someone has sent a message through the contact form!

@component('mail::panel')
**Name:** {{ $contact->name }}
**Email:** {{ $contact->email ?? 'Not provided' }}
**Phone:** {{ $contact->phone ?? 'Not provided' }}

**Message:**
{{ $contact->message }}
@endcomponent

@component('mail::button', ['url' => route('dashboard')])
View Dashboard
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
