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

        // Load relationships for notification
        $appointment->load(['dog.customer']);

        // Notify customer of notification
        try {
            $appointment->dog->customer->notify(
                new \App\Notifications\AppointmentConfirmedNotification($appointment)
            );
        } catch (\Exception $e) {
            \Log::error('Failed to send confirmation notification', [
                'appointment_id' => $appointment->id,
                'error' => $e->getMessage(),
            ]);
        }

        return back()->with('success', 'Appointment confirmed successfully!');
    }

    public function cancel(Appointment $appointment): RedirectResponse
    {
        $appointment->delete();

        return back()->with('success', 'Appointment cancelled successfully!');
    }

    public function confirmFromEmail(Appointment $appointment): RedirectResponse
    {
        // Only allow confirmation if status is waiting_on_client
        if ($appointment->status !== 'waiting_on_client') {
            return redirect()->route('home')->with('error', 'This appointment has already been confirmed or cannot be confirmed.');

        }

        $appointment->status = 'confirmed';
        $appointment->confirmed_at = now();
        $appointment->save();

        return redirect()
            ->route('home')
            ->with('success', 'Thank you! Your appointment has been confirmed for '
            . $appointment->appointment_date->format('F j, Y')
                . ' at ' . $appointment->appointment_time->format('g:i A') . '.');
    }


    public function reschedule(RescheduleAppointmentRequest $request, Appointment $appointment)
    {
        // Check if the new time conflicts with blocked times
        $appointmentDateTime = \Carbon\Carbon::parse($request->appointment_date . ' ' . $request->appointment_time);

        $isBlocked = \App\Models\BlockedTime::query()
            ->where('start_datetime', '<=', $appointmentDateTime)
            ->where('end_datetime', '>=', $appointmentDateTime)
            ->exists();

        if ($isBlocked) {
            return back()->withErrors([
                'appointment_time' => 'This time slot is blocked and unavailable.',
            ]);
        }

        // Capture previous date/time BEFORE saving (for notification)
        $previousDate = $appointment->appointment_date;
        $previousTime = $appointment->appointment_time;

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

        // Load relationships for notification
        $appointment->load(['dog.customer']);

        // Notify customer of reschedule
        try {
            $appointment->dog->customer->notify(
                new \App\Notifications\AppointmentRescheduledNotification(
                    $appointment,
                    $previousDate,
                    $previousTime
                )
            );
        } catch (\Exception $e) {
            \Log::error('Failed to send reschedule notification', [
                'appointment_id' => $appointment->id,
                'error' => $e->getMessage(),
            ]);
        }

        $message = $request->status === 'waiting_on_client'
            ? 'Appointment rescheduled. Awaiting client confirmation.'
            : 'Appointment rescheduled and confirmed!';

        return back()->with('success', $message);
    }
}
