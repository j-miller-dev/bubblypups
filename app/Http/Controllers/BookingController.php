<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Dog;
use App\Models\Owner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
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

        if (!$owner) {
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

        // Create booking
        $booking = Booking::create([
            'owner_id' => $owner->id,
            'dog_id' => $dog->id,
            'service' => $data['service'],
            'date' => $data['appointment']['date'],
            'time' => $data['appointment']['time'],
            'status' => 'pending',
            'notes' => data_get($data, 'contact.notes'),
        ]);

        // Simulate text confirmation (log)
        Log::info('[Bubbly Pups] Booking received', [
            'booking_id' => $booking->id,
            'owner' => $owner->only(['name','email','phone']),
            'dog' => $dog->only(['name','breed']),
            'service' => $booking->service,
            'when' => $booking->date?->toDateString() . ' ' . $booking->time,
        ]);

        return response()->json([
            'ok' => true,
            'booking_id' => $booking->id,
        ]);
    }
}
