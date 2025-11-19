<?php

use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

// Contact form
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// Frontend booking pages (no backend yet - you'll add routes as you build)
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

// Frontend dashboard pages (no backend yet - you'll add routes as you build)
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard/Overview');
})->name('dashboard');

Route::get('/dashboard/dogs', function () {
    return Inertia::render('Dashboard/Dogs');
})->name('dashboard.dogs');

Route::get('/dashboard/bookings', function () {
    return Inertia::render('Dashboard/Bookings');
})->name('dashboard.bookings');

Route::get('/dashboard/availability', function () {
    return Inertia::render('Dashboard/Availability');
})->name('dashboard.availability');

Route::get('/dashboard/calendar', function () {
    return Inertia::render('Dashboard/Calendar');
})->name('dashboard.calendar');
