<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Dog;
use App\Models\Owner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        // If the frontend requests JSON (Overview calendar), return bookings for a specific date
        if ($request->wantsJson() || $request->expectsJson()) {
            $date = $request->query('date');
            $query = Booking::query()->with(['dog', 'owner']);
            if ($date) {
                $query->whereDate('scheduled_at', $date);
            }
            $items = $query->orderBy('scheduled_at')->get()->map(function (Booking $b) {
                return [
                    'id' => $b->id,
                    'name' => $b->dog?->name ?? $b->owner?->name ?? 'Booking',
                    'datetime' => optional($b->scheduled_at)->toIso8601String(),
                    'date' => optional($b->scheduled_at)->format('Y-m-d'),
                    'time' => optional($b->scheduled_at)->format('H:i'),
                    'location' => $b->location,
                ];
            });
            return response()->json(['bookings' => $items]);
        }

        // Otherwise, render dashboard page
        return Inertia::render('Dashboard/Bookings');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'service' => ['required', 'string', 'max:255'],
            'dog' => ['required', 'array'],
            'dog.name' => ['required', 'string', 'max:255'],
            'dog.breed' => ['nullable', 'string', 'max:255'],
            'dog.age' => ['nullable', 'string', 'max:255'],
            'dog.weight' => ['nullable', 'string', 'max:255'],
            'dog.notes' => ['nullable', 'string'],
            'appointment' => ['required', 'array'],
            'appointment.date' => ['required', 'date'],
            'appointment.time' => ['required', 'string', 'max:50'],
            'contact' => ['required', 'array'],
            'contact.name' => ['required', 'string', 'max:255'],
            'contact.email' => ['nullable', 'email', 'max:255'],
            'contact.phone' => ['nullable', 'string', 'max:50'],
            'contact.notes' => ['nullable', 'string'],
        ]);

        // Upsert owner by email or phone when possible
        $owner = Owner::query()
            ->when(data_get($data, 'contact.email'), fn ($q, $email) => $q->orWhere('email', $email))
            ->when(data_get($data, 'contact.phone'), fn ($q, $phone) => $q->orWhere('phone', $phone))
            ->first();

        if (! $owner) {
            $owner = Owner::create([
                'name' => $data['contact']['name'],
                'email' => data_get($data, 'contact.email'),
                'phone' => data_get($data, 'contact.phone'),
                'address' => null,
            ]);
        } else {
            // Keep owner profile fresh
            $owner->update([
                'name' => $data['contact']['name'] ?: $owner->name,
                'email' => data_get($data, 'contact.email', $owner->email),
                'phone' => data_get($data, 'contact.phone', $owner->phone),
            ]);
        }

        // Find or create dog for this owner by name
        $dog = Dog::firstOrCreate([
            'owner_id' => $owner->id,
            'name' => $data['dog']['name'],
        ], [
            'breed' => data_get($data, 'dog.breed'),
            'age' => data_get($data, 'dog.age'),
            'weight' => data_get($data, 'dog.weight'),
            'notes' => data_get($data, 'dog.notes'),
        ]);

        // Compute scheduled_at from date and time (assume local time)
        $date = $data['appointment']['date'];
        $time = $data['appointment']['time'];
        $scheduledAt = \Carbon\Carbon::parse($date.' '.$time);

        // Create booking
        $booking = Booking::create([
            'owner_id' => $owner->id,
            'dog_id' => $dog->id,
            'service' => $data['service'],
            'scheduled_at' => $scheduledAt,
            'time' => $time, // keep compatibility with legacy tests
            'status' => 'pending',
            'notes' => data_get($data, 'contact.notes'),
        ]);

        // Simulate text confirmation (log)
        Log::info('[Bubbly Pups] Booking received', [
            'booking_id' => $booking->id,
            'owner' => $owner->only(['name', 'email', 'phone']),
            'dog' => $dog->only(['name', 'breed']),
            'service' => $booking->service,
            'when' => optional($booking->scheduled_at)->toDateTimeString(),
        ]);

        return response()->json([
            'ok' => true,
            'booking_id' => $booking->id,
        ]);
    }
}
