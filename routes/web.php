<?php

use App\Http\Controllers\Admin\AppointmentController;
use App\Http\Controllers\Admin\BlockedTimeController;
use App\Http\Controllers\Admin\BusinessHoursController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Auth\CustomerLoginController;
use App\Http\Controllers\Auth\CustomerRegisterController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Customer\CustomerAppointmentController;
use App\Http\Controllers\Customer\CustomerDashboardController;
use App\Http\Controllers\Customer\CustomerDogController;
use App\Http\Controllers\Customer\CustomerProfileController;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/booking', function () {
    return Inertia::render('Booking');
})->name('booking');

Route::get('/booking/start', function () {
    return Inertia::render('Booking/Start');
})->name('booking.start');

Route::get('/blog', function () {
    return Inertia::render('Blog');
})->name('blog');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

Route::get('/company', function () {
    return Inertia::render('Company');
})->name('company');

Route::get('/pricing', function () {
    return Inertia::render('Pricing');
})->name('pricing');

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Dashboard Pages
    Route::get('/dashboard/bookings', function () {
        $appointments = \App\Models\Appointment::with(['dog.customer', 'service'])
            ->upcoming()
            ->get()
            ->map(function ($appointment) {
                $service = $appointment->service;
                $dogSize = $appointment->dog?->size ?? 'medium';

                return [
                    'id' => $appointment->id,
                    'dog' => $appointment->dog?->name ?? 'Unknown',
                    'breed' => $appointment->dog?->breed ?? 'Unknown',
                    'owner' => $appointment->dog?->customer?->name ?? 'Unknown',
                    'photo_url' => $appointment->dog?->photo_url,
                    'phone' => $appointment->dog?->customer?->phone ?? null,
                    'email' => $appointment->dog?->customer?->email ?? null,
                    'service' => $service?->name ?? 'No service',
                    'service_emoji' => $service?->emoji ?? '',
                    'price' => $service ? $service->getPriceForSize($dogSize) : 0,
                    'date' => $appointment->appointment_date->format('Y-m-d'),
                    'time' => $appointment->appointment_time->format('h:i A'),
                    'status' => $appointment->status,
                ];
            });

        return Inertia::render('Dashboard/Bookings', [
            'appointments' => $appointments,
        ]);
    })->name('dashboard.bookings');

    Route::get('/dashboard/dogs', function () {
        return Inertia::render('Dashboard/Dogs');
    })->name('dashboard.dogs');

    Route::get('/dashboard/calendar', function () {
        return Inertia::render('Dashboard/Calendar');
    })->name('dashboard.calendar');

    Route::get('/dashboard/availability', [BusinessHoursController::class, 'index'])->name('dashboard.availability');
});

// Public appointment confirmation via email (signed URL)
Route::get('/appointments/{appointment}/confirm-reschedule', [
    AppointmentController::class, 'confirmFromEmail',
])
    ->name('appointments.confirm-from-email')
    ->middleware('signed');

// Customer Authentication
Route::get('/register', [CustomerRegisterController::class, 'create'])->name('customer.register.form');
Route::post('/register', [CustomerRegisterController::class, 'store'])->name('customer.register');
Route::get('/customer/login', [CustomerLoginController::class, 'create'])->name('customer.login.form');
Route::post('/customer/login', [CustomerLoginController::class, 'store'])->name('customer.login');
Route::post('/customer/logout', [CustomerLoginController::class, 'destroy'])->name('customer.logout');

// Customer Routes (Protected)
Route::middleware(['auth:customer'])->group(function () {
    Route::get('/booking/create', [BookingController::class, 'create'])->name('booking.create');
    Route::post('/booking', [BookingController::class, 'store'])->name('booking.store');
    Route::get('/booking/available-slots', [BookingController::class, 'availableSlots'])->name('booking.available-slots');
});

// Customer Dashboard Routes (Protected)
Route::middleware(['auth:customer'])->prefix('my')->name('my.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [CustomerDashboardController::class, 'index'])
        ->name('dashboard');

    // Appointments
    Route::get('/appointments', [CustomerAppointmentController::class, 'index'])
        ->name('appointments');
    Route::get('/appointments/{appointment}', [CustomerAppointmentController::class, 'show'])
        ->name('appointments.show');
    Route::post('/appointments/{appointment}/cancel', [CustomerAppointmentController::class, 'cancel'])
        ->name('appointments.cancel');
    // Dogs
    Route::get('/dogs', [CustomerDogController::class, 'index'])
        ->name('dogs');
    Route::get('/dogs/{dog}', [CustomerDogController::class, 'show'])          ->name('dogs.show');
    Route::post('/dogs', [CustomerDogController::class, 'store'])
        ->name('dogs.store');
    Route::patch('/dogs/{dog}', [CustomerDogController::class, 'update'])
        ->name('dogs.update');

    // Profile
    Route::get('/profile', [CustomerProfileController::class, 'edit'])
        ->name('profile.edit');
    Route::patch('/profile', [CustomerProfileController::class, 'update'])
        ->name('profile.update');
});

// Admin Routes (Protected)
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::post('/appointments/{appointment}/confirm', [AppointmentController::class, 'confirm'])->name('appointments.confirm');
    Route::delete('/appointments/{appointment}', [AppointmentController::class, 'cancel'])->name('appointments.cancel');
    // Reschedule Endpoint
    Route::patch('/appointments/{appointment}/reschedule', [AppointmentController::class, 'reschedule'])->name('appointments.reschedule');
    // Available slots API for modal
    Route::get('/appointments/available-slots', function (\Illuminate\Http\Request $request) {
        $request->validate([
            'date' => ['required', 'date', 'after_or_equal:today'],
            'exclude_appointment_id' => ['nullable', 'integer', 'exists:appointments,id'],
        ]);

        $availabilityService = app(\App\Services\AvailabilityService::class);
        $slots = $availabilityService->getAvailableSlots($request->date, $request->input('exclude_appointment_id'));

        // Get existing appointments for the day to show schedule context
        $existingAppointments = \App\Models\Appointment::query()
            ->with(['dog', 'dog.customer', 'service'])
            ->whereDate('appointment_date', $request->date)
            ->whereIn('status', ['pending', 'confirmed', 'waiting_on_client'])
            ->when($request->input('exclude_appointment_id'), fn($query, $id) => $query->where('id', '!=', $id))
            ->orderBy('appointment_time')
            ->get()
            ->map(fn($apt) => [
                'time' => $apt->appointment_time->format('H:i'),
                'dog_name' => $apt->dog->name,
                'service' => $apt->service->name ?? 'N/A',
                'duration' => $apt->duration,
                'status' => $apt->status,
            ]);

        return response()->json([
            'slots' => $slots,
            'existing_appointments' => $existingAppointments,
        ]);
    })->name('admin.appointments.available-slots');

    Route::get('/blocked-times', [BlockedTimeController::class, 'index'])->name('blocked-times.index');
    Route::post('/blocked-times', [BlockedTimeController::class, 'store'])->name('blocked-times.store');
    Route::delete('/blocked-times/{blockedTime}', [BlockedTimeController::class, 'destroy'])->name('blocked-times.destroy');

    // Business hours management
    Route::patch('/business-hours/{businessHours}', [BusinessHoursController::class, 'update'])->name('business-hours.update');
});

require __DIR__ . '/auth.php';
