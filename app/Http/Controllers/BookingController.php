<?php

namespace App\Http\Controllers;

use App\Enums\AppointmentStatus;
use App\Http\Requests\StoreAppointmentRequest;
use App\Models\Appointment;
use App\Models\Dog;
use App\Models\Service;
use App\Models\Setting;
use App\Services\AvailabilityService;
use Illuminate\Contracts\Cache\LockTimeoutException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
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
            'service_id' => ['required', 'integer', 'exists:services,id'],
            'dog_id' => ['required', 'integer'],
        ]);

        $dog = auth('customer')->user()->dogs()->find($request->integer('dog_id'));

        if (! $dog) {
            abort(403);
        }

        $windowWeeks = (int) Setting::get('booking_window_weeks', 4);
        if ($request->date > now()->addWeeks($windowWeeks)->format('Y-m-d')) {
            return response()->json(['slots' => []]);
        }

        $slots = $this->availabilityService->getAvailableSlots($request->date, $request->integer('service_id'), $dog->size);

        return response()->json(['slots' => $slots]);
    }

    public function store(StoreAppointmentRequest $request)
    {
        $service = Service::findOrFail($request->service_id);
        $dog = Dog::findOrFail($request->dog_id);

        try {
            $appointment = Cache::lock('booking-slot:'.$request->appointment_date, 10)
                ->block(5, function () use ($request, $service, $dog) {
                    return DB::transaction(function () use ($request, $service, $dog) {
                        $duration = $service->getDurationForSize($dog->size);

                        if (! $this->availabilityService->isRangeAvailable(
                            $request->appointment_date,
                            $request->appointment_time,
                            $duration,
                        )) {
                            throw ValidationException::withMessages([
                                'appointment_time' => 'This time slot was just booked. Please choose another time.',
                            ]);
                        }

                        return Appointment::create([
                            'customer_id' => auth('customer')->id(),
                            'dog_id' => $request->dog_id,
                            'service_id' => $request->service_id,
                            'appointment_date' => $request->appointment_date,
                            'appointment_time' => $request->appointment_time,
                            'duration' => $duration,
                            'status' => AppointmentStatus::Pending,
                            'notes' => $request->notes,
                        ]);
                    });
                });
        } catch (LockTimeoutException $e) {
            throw ValidationException::withMessages([
                'appointment_time' => 'We\'re processing another booking for this time. Please try again in a moment.',
            ]);
        }

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

        return redirect()->route('my.appointments')
            ->with('success', 'Booking request received! We\'ll confirm your time shortly — keep an eye out for an SMS or email.');
    }
}
