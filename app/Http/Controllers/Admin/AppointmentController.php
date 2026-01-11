<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RescheduleAppointmentRequest;
use App\Models\Appointment;
use Illuminate\Http\RedirectResponse;

class AppointmentController extends Controller
{
    public function confirm(Appointment $appointment): RedirectResponse
    {
        $appointment->status = 'confirmed';
        $appointment->confirmed_at = now();
        $appointment->save();

        return back()->with('success', 'Appointment confirmed successfully!');
    }

    public function cancel(Appointment $appointment): RedirectResponse
    {
        $appointment->delete();

        return back()->with('success', 'Appointment cancelled successfully!');
    }

    public function reschedule(RescheduleAppointmentRequest $request, Appointment $appointment)
    {
        // Check if the new time conflicts with blocked times
        $appointmentDateTime = \Carbon\Carbon::parse($request->appointment_date.' '.$request->appointment_time);

        $isBlocked = \App\Models\BlockedTime::query()
            ->where('start_datetime', '<=', $appointmentDateTime)
            ->where('end_datetime', '>=', $appointmentDateTime)
            ->exists();

        if ($isBlocked) {
            return back()->withErrors([
                'appointment_time' => 'This time slot is blocked and unavailable.',
            ]);
        }

        $appointment->appointment_date = $request->appointment_date;
        $appointment->appointment_time = $request->appointment_time;
        $appointment->status = $request->status;

        if ($request->status === 'waiting_on_client') {
            $appointment->confirmed_at = null;
        } elseif ($request->status === 'confirmed') {
            $appointment->confirmed_at = now();
        }

        if ($request->filled('notes')) {
            $appointment->notes = $request->notes;
        }

        $appointment->save();

        $message = $request->status === 'waiting_on_client'
            ? 'Appointment rescheduled. Awaiting client confirmation.'
            : 'Appointment rescheduled and confirmed!';

        return back()->with('success', $message);
    }
}
