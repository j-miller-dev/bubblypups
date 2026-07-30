<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AppointmentStatus;
use App\Http\Controllers\Controller;
use App\Models\BlockedTime;
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

        // Check for conflicting appointments
        $conflictingAppointments = \App\Models\Appointment::query()
            ->with(['dog', 'dog.customer'])
            ->where(function ($query) use ($validated) {
                // Appointment overlaps with the blocked time
                $query->whereBetween('appointment_date', [
                    \Carbon\Carbon::parse($validated['start_datetime'])->toDateString(),
                    \Carbon\Carbon::parse($validated['end_datetime'])->toDateString(),
                ]);
            })
            ->whereIn('status', [AppointmentStatus::Pending, AppointmentStatus::Confirmed, AppointmentStatus::WaitingOnClient])
            ->get();

        // If conflicts exist, return error with details
        if ($conflictingAppointments->isNotEmpty()) {
            $conflictDetails = $conflictingAppointments->map(function ($apt) {
                return sprintf(
                    '%s - %s (%s) at %s',
                    $apt->appointment_date->format('M d, Y'),
                    $apt->dog->name,
                    $apt->dog->customer->name,
                    $apt->appointment_time->format('g:i A')
                );
            })->join(', ');

            return back()->withErrors([
                'blocked_time' => "Cannot block this time. {$conflictingAppointments->count()} appointment(s) already scheduled: {$conflictDetails}",
            ]);
        }

        // Create the blocked time
        BlockedTime::create($validated);

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
