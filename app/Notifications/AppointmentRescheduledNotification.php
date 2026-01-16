<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

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
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $subject = $this->appointment->status === 'waiting_on_client'
        ? 'Please Confirm New Appointment Time For ' . $this->appointment->dog->name
        : 'Appointment Rescheduled for ' . $this->appointment->dog->name;

        $confirmUrl = \Illuminate\Support\Facades\URL::signedRoute(
            'appointments.confirm-from-email',
            ['appointment' => $this->appointment->id],
            now()->addDays(7) // Link expires in 7 days
        );

        return (new MailMessage())
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
