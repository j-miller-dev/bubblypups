<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Inertia\Inertia;

/**
 * Handles customer appointment management operations.
 *
 * This controller allows authenticated customers to view their appointment history
 * (upcoming, past, and cancelled), view detailed appointment information, and cancel
 * upcoming appointments. All operations are scoped to the authenticated customer's
 * appointments only, ensuring customers cannot access or modify other customers' data.
 */

class CustomerAppointmentController extends Controller
{
    public function index()
    {
        $customer = auth('customer')->user();

        $appointments = Appointment::query()
            ->with(['dog', 'service'])
            ->whereHas('dog', fn($q) => $q->where('customer_id', $customer->id))
            ->orderBy('appointment_date', 'desc')
            ->orderBy('appointment_time', 'desc')
            ->get();

        return Inertia::render('My/Appointments', [
            'customer' => $customer,
            'appointments' => [
                'upcoming' => $appointments->filter(fn($a) => $a->appointment_date >= now()->toDateString() && $a->status !== 'cancelled')->values(),
                'past' => $appointments->filter(fn($a) => $a->appointment_date < now()->toDateString())->values(),
                'cancelled' => $appointments->filter(fn($a) => $a->status === 'cancelled')->values(),
            ],
        ]);
    }

    public function show(Appointment $appointment)
    {
        if ($appointment->dog->customer_id !== auth('customer')->id()) {
            abort(403);
        }

        $appointment->load(['dog', 'service']);

        return Inertia::render('My/AppointmentDetail', [
            'customer' => auth('customer')->user(),
            'appointment' => $appointment,
        ]);
    }

    public function cancel(Appointment $appointment)
    {
        if ($appointment->dog->customer_id !== auth('customer')->id()) {
            abort(403);
        }

        if ($appointment->appointment_date < now()->toDateString() || $appointment->status === 'cancelled') {
            return back()->withErrors(['error' => 'This appointment cannot be cancelled.']);
        }

        $appointment->status = 'cancelled';
        $appointment->save();

        return back()->with('success', 'Appointment cancelled successfully.');
    }
}
