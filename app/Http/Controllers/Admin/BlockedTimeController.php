<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AppointmentStatus;
use App\Http\Controllers\Controller;
use App\Models\BlockedTime;
use Carbon\Carbon;
use Illuminate\Http\Request;

class BlockedTimeController extends Controller
{
    /**
     * Store a new blocked time (holiday, vacation, etc.)
     */
    public function store(Request $request)
    {
        // Validate the data
        $validated = $request->validate([
            'start_datetime' => ['required', 'date', 'after_or_equal:today'],
            'end_datetime' => ['required', 'date', 'after:start_datetime'],
            'reason' => ['nullable', 'string', 'max:255'],
        ]);

        $startDatetime = Carbon::parse($validated['start_datetime'])->startOfDay();
        $endDatetime   = Carbon::parse($validated['end_datetime'])->endOfDay();

        // Check for conflicting appointments
        $conflictingAppointments = \App\Models\Appointment::query()
            ->with(['dog', 'dog.customer'])
            ->whereBetween('appointment_date', [
                $startDatetime->toDateString(),
                $endDatetime->toDateString(),
            ])
            ->whereIn('status', [AppointmentStatus::Pending, AppointmentStatus::Confirmed, AppointmentStatus::WaitingOnClient])
            ->get();

        // If conflicts exist, return error with details
        if ($conflictingAppointments->isNotEmpty() && ! $request->boolean('force')) {
            return back()->with('conflicts', $conflictingAppointments->map(fn($apt) => [
                'id'    => $apt->id,
                'date'  => $apt->appointment_date->format('M d, Y'),
                'time'  => $apt->appointment_time->format('g:i A'),
                'dog'   => $apt->dog->name,
                'owner' => $apt->dog->customer->name,
            ])->toArray());
        }

        if ($conflictingAppointments->isNotEmpty() && $request->boolean('force')) {
            foreach ($conflictingAppointments as $appointment) {
                $appointment->update(['status' => AppointmentStatus::Cancelled]);
                $appointment->dog->customer->notify(
                    new \App\Notifications\AppointmentCancelledNotification($appointment)
                );
            }
        }

        // Create the blocked time
        BlockedTime::create([
            'start_datetime' => $startDatetime,
            'end_datetime'   => $endDatetime,
            'reason'         => $validated['reason'] ?? null,
        ]);

        // Redirect back with success message
        return back()->with('success', 'Time blocked successfully!');
    }

    /**
     * Delete a blocked time
     */
    public function destroy(BlockedTime $blockedTime)
    {
        $blockedTime->delete();

        return back()->with('success', 'Blocked time removed successfully!');
    }
}
