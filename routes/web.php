<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

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

// Dashboard routes (temporarily public while auth is removed)
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard/Overview');
})->name('dashboard');

Route::get('/dashboard/dogs', [DashboardController::class, 'dogs'])
    ->name('dashboard.dogs');

Route::get('/dashboard/bookings', [BookingController::class, 'index'])
    ->name('dashboard.bookings');

Route::get('/dashboard/availability', function () {
    return Inertia::render('Dashboard/Availability');
})->name('dashboard.availability');

Route::get('/dashboard/calendar', function () {
    return Inertia::render('Dashboard/Calendar');
})->name('dashboard.calendar');

// Profile routes removed while auth is reset

// Booking persistence endpoint (MVP)
Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// Auth routes removed (Fortify/Breeze)
