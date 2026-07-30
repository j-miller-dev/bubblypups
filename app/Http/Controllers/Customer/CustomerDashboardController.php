<?php

namespace App\Http\Controllers\Customer;

use App\Enums\AppointmentStatus;
use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Inertia\Inertia;

class CustomerDashboardController extends Controller
{
    public function index()
    {
        $customer = auth('customer')->user();

        $upcomingAppointments = Appointment::query()
            ->with(['dog', 'service'])
            ->whereHas('dog', fn ($q) => $q->where('customer_id', $customer->id))
            ->where('appointment_date', '>=', now()->toDateString())
            ->whereIn('status', [AppointmentStatus::Pending, AppointmentStatus::Confirmed, AppointmentStatus::WaitingOnClient])
            ->orderBy('appointment_date')
            ->orderBy('appointment_time')
            ->limit(3)
            ->get();

        $stats = [
            'upcomingCount' => Appointment::query()
                ->whereHas('dog', fn ($q) => $q->where('customer_id', $customer->id))
                ->where('appointment_date', '>=', now()->toDateString())
                ->whereIn('status', [AppointmentStatus::Pending, AppointmentStatus::Confirmed, AppointmentStatus::WaitingOnClient])
                ->count(),
            'totalDogs' => $customer->dogs()->count(),
            'nextAppointment' => $upcomingAppointments->first(),
        ];

        return Inertia::render('My/Dashboard', [
            'customer' => $customer,
            'upcomingAppointments' => $upcomingAppointments,
            'stats' => $stats,
        ]);
    }
}
