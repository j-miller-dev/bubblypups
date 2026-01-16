<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAppointmentRequest;
use App\Models\Appointment;
use App\Models\Dog;
use App\Models\Service;
use App\Services\AvailabilityService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function __construct(
        protected AvailabilityService $availabilityService
    ) {}

    public function create(Request $request)
    {
        $customer = auth('customer')->user();

        // get customer's doggies
        $dogs = $customer->dogs()->get();

        // pre-select dog if provided
        $selectedDogId = $request->integer('dog_id');

        // Get all available services from database
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

        return Inertia::render('Booking/Create', [
            'dogs' => $dogs,
            'selectedDogId' => $selectedDogId,
            'services' => $services,
        ]);
    }

    public function availableSlots(Request $request)
    {
        $request->validate([
            'date' => ['required', 'date', 'after_or_equal:today'],
        ]);

        $slots = $this->availabilityService->getAvailableSlots($request->date);

        return response()->json(['slots' => $slots]);
    }

    public function store(StoreAppointmentRequest $request)
    {
        $appointment = Appointment::create([
            'customer_id' => auth('customer')->id(),
            'dog_id' => $request->dog_id,
            'service_id' => $request->service_id,
            'appointment_date' => $request->appointment_date,
            'appointment_time' => $request->appointment_time,
            'duration' => 60,
            'status' => 'pending',
            'notes' => $request->notes,
        ]);

        // Load relationships for notification
        $appointment->load(['dog.customer']);

        // Notify all admin users of new booking
        try {
            \App\Models\User::all()->each(function ($admin) use ($appointment) {
                $admin->notify(new \App\Notifications\NewBookingNotification($appointment));
            });
        } catch (\Exception $e) {
            \Log::error('Failed to send new booking notification', [
                'appointment_id' => $appointment->id,
                'error' => $e->getMessage(),
            ]);
        }

        return redirect()->route('home')
            ->with('success', 'Appointment requested! We\'ll confirm via email/text soon.');
    }
}
