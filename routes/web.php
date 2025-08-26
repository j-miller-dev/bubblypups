<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

// Admin Login
Route::get('/login', [AuthenticatedSessionController::class, 'create'])
    ->middleware('guest')
    ->name('login');

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('guest');


// Booking routes
Route::get('/booking', function () {
    return Inertia::render('Booking/Start');
})->name('booking');

Route::get('/booking/register', function () {
    return Inertia::render('Booking/Register');
})->name('booking.register');

Route::get('/booking/returning', function () {
    return Inertia::render('Booking/Returning');
})->name('booking.returning');

Route::get('/booking/appointment', function () {
    return Inertia::render('Booking');
})->name('booking.appointment');

// Dashboard routes
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard/Overview');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard/dogs', [DashboardController::class, 'dogs'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard.dogs');

Route::get('/dashboard/bookings', function () {
    return Inertia::render('Dashboard/Bookings');
})->middleware(['auth', 'verified'])->name('dashboard.bookings');

Route::get('/dashboard/availability', function () {
    return Inertia::render('Dashboard/Availability');
})->middleware(['auth', 'verified'])->name('dashboard.availability');

Route::get('/dashboard/calendar', function () {
    return Inertia::render('Dashboard/Calendar');
})->middleware(['auth', 'verified'])->name('dashboard.calendar');

Route::middleware('auth')->group(function () {
    Route::get('/profile',
        [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile',
        [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile',
        [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Booking persistence endpoint (MVP)
Route::post('/bookings',
    [BookingController::class, 'store'])->name('bookings.store');
Route::post('/contact',
    [ContactController::class, 'store'])->name('contact.store');

require __DIR__.'/auth.php';
