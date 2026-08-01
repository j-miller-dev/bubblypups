<?php

namespace App\Notifications;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\Twilio\TwilioChannel;
use NotificationChannels\Twilio\TwilioSmsMessage;

class AppointmentRescheduledNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Appointment $appointment,
        public string $previousDate,
        public string $previousTime
    ) {}

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

        if ($appointment->status === AppointmentStatus::WaitingOnClient) {
            return (new TwilioSmsMessage)
                ->content("{$appointment->dog->name}'s grooming has been rescheduled to {$date} at {$time}. Please check your email to confirm the new time.");
        }

        return (new TwilioSmsMessage)
            ->content("{$appointment->dog->name}'s grooming has been rescheduled to {$date} at {$time}. See you then!");
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $subject = $this->appointment->status === AppointmentStatus::WaitingOnClient
        ? 'Please Confirm New Appointment Time For '.$this->appointment->dog->name
        : 'Appointment Rescheduled for '.$this->appointment->dog->name;

        $confirmUrl = \Illuminate\Support\Facades\URL::signedRoute(
            'appointments.confirm-from-email',
            ['appointment' => $this->appointment->id],
            now()->addDays(7) // Link expires in 7 days
        );

        return (new MailMessage)
            ->subject($subject)
            ->markdown('notifications.appointment-rescheduled', [
                'appointment' => $this->appointment,
                'customer' => $notifiable,
                'previousDate' => $this->previousDate,
                'previousTime' => $this->previousTime,
                'dashboardUrl' => route('my.appointments'),
                'confirmUrl' => $confirmUrl,
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
