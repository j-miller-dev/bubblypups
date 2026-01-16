<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Handles customer profile management.
 *
 * This controller allows authenticated customers to view and update their personal
 * information including name, email, and phone number. Email uniqueness is enforced
 * while allowing customers to keep their current email address during updates.
 */

class CustomerProfileController extends Controller
{
    public function edit()
    {
        return Inertia::render('My/Profile', [
            'customer' => auth('customer')->user(),
        ]);
    }

    public function update(Request $request)
    {
        $customer = auth('customer')->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email,' . $customer->id,
            'phone' => 'required|string|max:20',
        ]);

        $customer->update($validated);

        return back()->with('success', 'Profile updated successfully!');
    }
}
