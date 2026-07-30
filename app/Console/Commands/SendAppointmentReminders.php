<?php

namespace App\Console\Commands;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Notifications\AppointmentReminderNotification;
use Illuminate\Console\Command;

class SendAppointmentReminders extends Command
{
    protected $signature = 'appointments:send-reminders';

    protected $description = 'Send appointment reminders for appointments 1-2 days away';

    public function handle(): void
    {
        // Find confirmed appointments 1-2 days away that haven't recieved a reminder
        $appointments = Appointment::query()
            ->where('status', AppointmentStatus::Confirmed)
            ->whereBetween('appointment_date', [
                now()->addDay()->startOfDay(),
                now()->addDays(2)->endOfDay(),
            ])
            ->whereNull('reminder_sent_at')
            ->with(['dog.customer'])
            ->get();

        foreach ($appointments as $appointment) {
            try {
                $appointment->dog->customer->notify(
                    new AppointmentReminderNotification($appointment)
                );

                $appointment->update(['reminder_sent_at' => now()]);
                $this->info("Reminder sent for appointment #{$appointment->id}");
            } catch (\Exception $e) {
                $this->error("Failed for appointment #{$appointment->id}: {$e->getMessage()}");
            }
        }

        $this->info("Sent {$appointments->count()} reminder(s)");
    }
}
