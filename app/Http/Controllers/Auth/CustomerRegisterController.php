<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCustomerRequest;
use App\Models\Customer;
use App\Models\Dog;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomerRegisterController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create()
    {
        return Inertia::render('Auth/CustomerRegister');
    }

    public function store(StoreCustomerRequest $request)
    {
        // Create customer
        $customer = Customer::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => $request->password, // Auto-hashed by cast
        ]);

        // Create their first dog
        $dog = Dog::create([
            'customer_id' => $customer->id,
            'name' => $request->dog_name,
            'breed' => $request->dog_breed,
            'size' => $request->dog_size,
            'special_notes' => $request->dog_notes,
        ]);

        // Log them in
        Auth::guard('customer')->login($customer);

        // Redirect to booking with their new dog
        return redirect()->route('booking.create', ['dog_id' => $dog->id])
            ->with('success', 'Welcome! Let\'s book your first appointment.');
    }
}
