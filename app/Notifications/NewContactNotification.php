<?php

namespace App\Notifications;

use App\Models\Contact;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewContactNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Contact $contact) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject('New Contact Message - '.$this->contact->name)
            ->markdown('notifications.new-contact', [
                'contact' => $this->contact,
            ]);

        if ($this->contact->email) {
            $message->replyTo($this->contact->email, $this->contact->name);
        }

        return $message;
    }

    public function toArray(object $notifiable): array
    {
        return [];
    }
}
