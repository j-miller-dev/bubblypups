<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\Twilio\TwilioChannel;
use NotificationChannels\Twilio\TwilioSmsMessage;

class AppointmentCancelledNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Appointment $appointment) {}

    public function via(object $notifiable): array
    {
        $channels = ['mail'];

        if ($notifiable->phone) {
            $channels[] = TwilioChannel::class;
        }

        return $channels;
    }

    public function toTwilio(object $notifiable): TwilioSmsMessage
    {
        $appointment = $this->appointment;
        $date = $appointment->appointment_date->format('D j M');
        $time = $appointment->appointment_time->format('g:i A');

        return (new TwilioSmsMessage)
            ->content("Your appointment for {$appointment->dog->name} on {$date} at {$time} has been cancelled. Please contact us to rebook.");
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Appointment Cancelled for '.$this->appointment->dog->name)
            ->markdown('notifications.appointment-cancelled', [
                'appointment' => $this->appointment,
                'customer' => $notifiable,
                'bookingUrl' => route('booking.start'),
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [];
    }
}
