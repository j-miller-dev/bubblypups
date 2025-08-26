<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Dog;
use App\Models\Owner;
use App\Models\Service;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function dogs()
    {
        $dogs = Dog::with([
            'owner', 'bookings' => function ($query) {
                $query->latest()->limit(1);
            },
        ])
            ->simplePaginate(5)
            ->through(function ($dog) {
                return [
                    'id' => $dog->id,
                    'name' => $dog->name,
                    'breed' => $dog->breed,
                    'age' => $dog->age,
                    'weight' => $dog->weight,
                    'notes' => $dog->notes,
                    'owner' => [
                        'id' => $dog->owner->id,
                        'name' => $dog->owner->name,
                        'email' => $dog->owner->email,
                        'phone' => $dog->owner->phone,
                        'address' => $dog->owner->address,
                    ],
                    'lastVisit' => $dog->bookings->isNotEmpty()
                        ? $dog->bookings->first()->scheduled_at?->format('Y-m-d')
                        : null,
                    'totalBookings' => $dog->bookings->count(),
                ];
            });

        return Inertia::render('Dashboard/Dogs', [
            'dogs' => $dogs,
        ]);
    }

    public function overview()
    {
        $stats = [
            'totalDogs' => Dog::count(),
            'totalOwners' => Owner::count(),
            'totalBookings' => Booking::count(),
            'totalServices' => Service::where('is_active', true)->count(),
        ];

        return Inertia::render('Dashboard/Overview', [
            'stats' => $stats,
        ]);
    }
}
