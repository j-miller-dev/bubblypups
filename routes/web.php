<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ContactController;

/*
|--------------------------------------------------------------------------
| Web Routes (Laravel + Inertia)
|--------------------------------------------------------------------------
| Define routes as usual in Laravel. Return an Inertia page component using
| Inertia::render('<PageName>') where <PageName> maps to resources/js/Pages/<PageName>.tsx.
| You can use controllers or closures. Routes are named below for convenience.
*/

// Default Laravel welcome page (Blade-only)
Route::get('/welcome', function () {
    return view('welcome');
})->name('welcome');

// Inertia routes (React pages)
Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/blog', function () {
    return Inertia::render('Blog');
})->name('blog');

Route::get('/company', function () {
    return Inertia::render('Company');
})->name('company');

Route::get('/login', function () {
    return Inertia::render('Login');
})->name('login');

Route::get('/pricing', function () {
    return Inertia::render('Pricing');
})->name('pricing');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

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

// Dashboard nested pages
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard/Overview');
})->name('dashboard.overview');

Route::get('/dashboard/bookings', function () {
    return Inertia::render('Dashboard/Bookings');
})->name('dashboard.bookings');

Route::get('/dashboard/dogs', function () {
    return Inertia::render('Dashboard/Dogs');
})->name('dashboard.dogs');

// Booking persistence endpoint (MVP)
Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
