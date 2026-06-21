<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\Twilio\TwilioChannel;
use NotificationChannels\Twilio\TwilioSmsMessage;

class AppointmentConfirmedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Appointment $appointment)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
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
            ->content("Confirmed! {$appointment->dog->name}'s {$appointment->service->name} is locked in for {$date} at {$time}. See you then!");
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Appointment Confirmed for '.$this->appointment->dog->name.'!')
            ->markdown('notifications.appointment-confirmed', [
                'appointment' => $this->appointment,
                'customer' => $notifiable,
                'dashboardUrl' => route('my.appointments'),
            ]);
    }
}
