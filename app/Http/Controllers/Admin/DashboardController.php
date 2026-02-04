<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
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
}
