<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\Twilio\TwilioChannel;
use NotificationChannels\Twilio\TwilioSmsMessage;

class AppointmentReminderNotification extends Notification implements ShouldQueue
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
        $time = $appointment->appointment_time->format('g:i A');

        return (new TwilioSmsMessage)
            ->content("Reminder: {$appointment->dog->name}'s grooming appointment is tomorrow at {$time}. We look forward to seeing you!");
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Reminder: '.$this->appointment->dog->name.'\'s Grooming Appointment Tomorrow!')
            ->markdown('notifications.appointment-reminder', [
                'appointment' => $this->appointment,
                'customer' => $notifiable,
                'dashboardUrl' => route('my.appointments'),
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
