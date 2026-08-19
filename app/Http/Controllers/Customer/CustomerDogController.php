<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\UpdateDogPhotoRequest;
use App\Models\Dog;
use App\Services\DogPhotoService;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Manages dog profiles for authenticated customers.
 *
 * This controller provides CRUD operations for customer-owned dogs, including listing
 * all dogs, viewing individual dog details with appointment history, creating new dog
 * profiles, and updating existing dog information. Authorization checks ensure customers
 * can only manage their own dogs.
 */
class CustomerDogController extends Controller
{
    public function index()
    {
        $customer = auth('customer')->user();

        return Inertia::render('My/Dogs', [
            'customer' => $customer,
            'dogs' => $customer->dogs,
        ]);
    }

    public function show(Dog $dog)
    {
        if ($dog->customer_id !== auth('customer')->id()) {
            abort(403);
        }

        $dog->load('appointments.service');

        return Inertia::render('My/DogDetail', [
            'customer' => auth('customer')->user(),
            'dog' => $dog,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'breed' => 'required|string|max:255',
            'size' => 'required|in:small,medium,large',
            'special_notes' => 'nullable|string',
        ]);

        $dog = auth('customer')->user()->dogs()->create($validated);

        return redirect()->route('my.dogs')->with('success', 'Dog added successfully!');
    }

    public function update(Request $request, Dog $dog)
    {
        if ($dog->customer_id !== auth('customer')->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'breed' => 'required|string|max:255',
            'size' => 'required|in:small,medium,large',
            'special_notes' => 'nullable|string',
        ]);

        $dog->update($validated);

        return back()->with('success', 'Dog updated successfully!');
    }

    public function destroy(Dog $dog, DogPhotoService $photoService): \Illuminate\Http\RedirectResponse
    {
        if ($dog->customer_id !== auth('customer')->id()) {
            abort(403);
        }

        if ($dog->photo_url) {
            $photoService->deletePhoto($dog);
        }

        $dog->delete();

        return redirect()->route('my.dogs')->with('success', 'Dog profile removed.');
    }

    public function updatePhoto(UpdateDogPhotoRequest $request, Dog $dog, DogPhotoService $photoService): \Illuminate\Http\RedirectResponse
    {
        $photoService->uploadPhoto($dog, $request->validated('photo'));

        return back()->with('success', 'Photo updated successfully!');
    }

    public function deletePhoto(Dog $dog, DogPhotoService $photoService): \Illuminate\Http\RedirectResponse
    {
        if ($dog->customer_id !== auth('customer')->id()) {
            abort(403);
        }

        $photoService->deletePhoto($dog);

        return back()->with('success', 'Photo removed successfully!');
    }
}
