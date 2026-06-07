<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDogController extends Controller
{
    public function index(): Response
    {
        $dogs = Dog::with('customer')
            ->withCount('appointments')
            ->withMax('appointments', 'appointment_date')
            ->orderBy('name')
            ->paginate(25)
            ->through(function ($dog) {
                return [
                    'id' => $dog->id,
                    'name' => $dog->name,
                    'breed' => $dog->breed,
                    'size' => $dog->size,
                    'special_notes' => $dog->special_notes,
                    'photo_url' => $dog->photo_url,
                    'owner' => [
                        'id' => $dog->customer->id,
                        'name' => $dog->customer->name,
                        'email' => $dog->customer->email,
                        'phone' => $dog->customer->phone,
                    ],
                    'lastVisit' => $dog->appointments_max_appointment_date
                        ? Carbon::parse($dog->appointments_max_appointment_date)->format('d M Y')
                        : null,
                    'totalBookings' => $dog->appointments_count,
                ];
            });

        return Inertia::render('Dashboard/Dogs', [
            'dogs' => $dogs,
        ]);
    }

    /**
     * Search for dogs by dog name, customer name, phone, or email.
     * Returns JSON array of matching dogs with customer information.
     */
    public function search(Request $request)
    {
        $query = $request->input('query', '');

        if (strlen($query) < 2) {
            return response()->json(['dogs' => []]);
        }

        $dogs = Dog::with('customer')
            ->where(function ($q) use ($query) {
                $q->where('name', 'LIKE', "%{$query}%")
                    ->orWhereHas('customer', function ($cq) use ($query) {
                        $cq->where('name', 'LIKE', "%{$query}%")
                            ->orWhere('phone', 'LIKE', "%{$query}%")
                            ->orWhere('email', 'LIKE', "%{$query}%");
                    });
            })
            ->limit(10)
            ->get()
            ->map(function ($dog) {
                return [
                    'id' => $dog->id,
                    'name' => $dog->name,
                    'breed' => $dog->breed,
                    'size' => $dog->size,
                    'customer' => [
                        'id' => $dog->customer->id,
                        'name' => $dog->customer->name,
                        'phone' => $dog->customer->phone,
                        'email' => $dog->customer->email,
                    ],
                    'display' => "{$dog->name} ({$dog->customer->name}, {$dog->customer->phone})",
                ];
            });

        return response()->json(['dogs' => $dogs]);
    }
}
