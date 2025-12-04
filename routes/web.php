<?php

use App\Http\Controllers\Admin\AppointmentController;
use App\Http\Controllers\Admin\BlockedTimeController;
use App\Http\Controllers\Auth\CustomerLoginController;
use App\Http\Controllers\Auth\CustomerRegisterController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\Customer\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Customer Authentication
Route::get('/register', [CustomerRegisterController::class, 'create'])->name('customer.register.form');
Route::post('/register', [CustomerRegisterController::class, 'store'])->name('customer.register');
Route::get('/customer/login', [CustomerLoginController::class, 'create'])->name('customer.login.form');
Route::post('/customer/login', [CustomerLoginController::class, 'store'])->name('customer.login');
Route::post('/customer/logout', [CustomerLoginController::class, 'destroy'])->name('customer.logout');

// Customer Routes (Protected)
Route::middleware(['auth:customer'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('customer.dashboard');
    Route::get('/booking/create', [BookingController::class, 'create'])->name('booking.create');
    Route::post('/booking', [BookingController::class, 'store'])->name('booking.store');
    Route::get('/booking/available-slots', [BookingController::class, 'availableSlots'])->name('booking.available-slots');
});

// Admin Routes (Protected)
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/appointments', [AppointmentController::class, 'index'])->name('appointments.index');
    Route::post('/appointments/{appointment}/confirm', [AppointmentController::class, 'confirm'])->name('appointments.confirm');
    Route::delete('/appointments/{appointment}', [AppointmentController::class, 'cancel'])->name('appointments.cancel');

    Route::get('/blocked-times', [BlockedTimeController::class, 'index'])->name('blocked-times.index');
    Route::post('/blocked-times', [BlockedTimeController::class, 'store'])->name('blocked-times.store');
    Route::delete('/blocked-times/{blockedTime}', [BlockedTimeController::class, 'destroy'])->name('blocked-times.destroy');
});

require __DIR__.'/auth.php';
