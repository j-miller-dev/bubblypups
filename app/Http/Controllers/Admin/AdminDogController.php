<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dog;
use Illuminate\Http\Request;

class AdminDogController extends Controller
{
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
