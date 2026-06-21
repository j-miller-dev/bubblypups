<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\Twilio\TwilioChannel;
use NotificationChannels\Twilio\TwilioSmsMessage;

class NewBookingNotification extends Notification implements ShouldQueue
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
        $customer = $appointment->dog->customer;
        $date = $appointment->appointment_date->format('D j M');
        $time = $appointment->appointment_time->format('g:i A');

        return (new TwilioSmsMessage)
            ->content("New booking request! {$customer->name}'s {$appointment->dog->name} for {$appointment->service->name} on {$date} at {$time}.");
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Appointment Request - '.$this->appointment->dog->customer->name)
            ->markdown('notifications.new-booking', [
                'appointment' => $this->appointment,
                'admin' => $notifiable,
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
