<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AppointmentStatus;
use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\BlockedTime;
use App\Models\BusinessHours;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $appointments = Appointment::with(['dog.customer', 'service'])
            ->upcoming()
            ->get()
            ->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'dog' => $appointment->dog?->name ?? 'Unknown',
                    'owner' => $appointment->dog?->customer?->name ?? 'Unknown',
                    'photo_url' => $appointment->dog?->photo_url,
                    'service' => $appointment->service?->name ?? 'No service',
                    'service_emoji' => $appointment->service?->emoji ?? '',
                    'date' => $appointment->appointment_date->format('Y-m-d'),
                    'time' => $appointment->appointment_time->format('h:i A'),
                    'datetime' => $appointment->appointment_date->format('Y-m-d').'T'.$appointment->appointment_time->format('H:i:s'),
                    'status' => $appointment->status,
                ];
            });

        $services = Service::all()->map(function ($service) {
            return [
                'id' => $service->id,
                'name' => $service->name,
                'description' => $service->description,
                'emoji' => $service->emoji,
                'base_price' => $service->base_price,
                'duration_minutes' => $service->duration_minutes,
            ];
        });

        return Inertia::render('Dashboard/Overview', [
            'appointments' => $appointments,
            'services' => $services,
        ]);
    }

    public function bookings(): Response
    {
        $appointments = Appointment::with(['dog.customer', 'service'])
            ->upcoming()
            ->get()
            ->map(function ($appointment) {
                $service = $appointment->service;
                $dogSize = $appointment->dog?->size ?? 'medium';

                return [
                    'id' => $appointment->id,
                    'dog' => $appointment->dog?->name ?? 'Unknown',
                    'breed' => $appointment->dog?->breed ?? 'Unknown',
                    'owner' => $appointment->dog?->customer?->name ?? 'Unknown',
                    'photo_url' => $appointment->dog?->photo_url,
                    'phone' => $appointment->dog?->customer?->phone ?? null,
                    'email' => $appointment->dog?->customer?->email ?? null,
                    'service' => $service?->name ?? 'No service',
                    'service_emoji' => $service?->emoji ?? '',
                    'price' => $service ? $service->getPriceForSize($dogSize) : 0,
                    'date' => $appointment->appointment_date->format('Y-m-d'),
                    'time' => $appointment->appointment_time->format('h:i A'),
                    'status' => $appointment->status,
                ];
            });

        return Inertia::render('Dashboard/Bookings', [
            'appointments' => $appointments,
        ]);
    }

    public function calendar(): Response
    {
        $businessHours = BusinessHours::query()
            ->orderByRaw("CASE day_of_week
                WHEN 'monday' THEN 1
                WHEN 'tuesday' THEN 2
                WHEN 'wednesday' THEN 3
                WHEN 'thursday' THEN 4
                WHEN 'friday' THEN 5
                WHEN 'saturday' THEN 6
                WHEN 'sunday' THEN 7
            END")
            ->get();

        $appointments = Appointment::with(['dog.customer', 'service'])
            ->whereIn('status', [AppointmentStatus::Pending, AppointmentStatus::Confirmed, AppointmentStatus::WaitingOnClient])
            ->get();

        $blockedTimes = BlockedTime::active()->get();

        return Inertia::render('Dashboard/Calendar', [
            'businessHours' => $businessHours,
            'appointments' => $appointments,
            'blockedTimes' => $blockedTimes,
            'initialDate' => now()->format('Y-m-d'),
        ]);
    }
}
