<?php

use App\Http\Controllers\Admin\AdminDogController;
use App\Http\Controllers\Admin\AppointmentController;
use App\Http\Controllers\Admin\BlockedTimeController;
use App\Http\Controllers\Admin\BlogPostController;
use App\Http\Controllers\Admin\BusinessHoursController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Auth\CustomerForgotPasswordController;
use App\Http\Controllers\Auth\CustomerLoginController;
use App\Http\Controllers\Auth\CustomerNewPasswordController;
use App\Http\Controllers\Auth\CustomerRegisterController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Customer\CustomerAppointmentController;
use App\Http\Controllers\Customer\CustomerDashboardController;
use App\Http\Controllers\Customer\CustomerDogController;
use App\Http\Controllers\Customer\CustomerProfileController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/booking', function () {
    return redirect()->route('booking.start');
})->name('booking');

Route::get('/booking/start', function () {
    return Inertia::render('Booking/Start');
})->name('booking.start');

Route::get('/blog', [BlogController::class, 'index'])->name('blog');
Route::get('/blog/{blogPost:slug}', [BlogController::class, 'show'])->name('blog.show');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

Route::post('contact', [ContactController::class, 'store'])->name('contact.store');

Route::get('/company', function () {
    return Inertia::render('Company');
})->name('company');

Route::get('/pricing', function () {
    return Inertia::render('Pricing');
})->name('pricing');

Route::middleware('auth')->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Dashboard Pages
    Route::get('/dashboard/bookings', [DashboardController::class, 'bookings'])->name('dashboard.bookings');

    Route::get('/dashboard/dogs', [AdminDogController::class, 'index'])->name('dashboard.dogs');

    Route::get('/dashboard/calendar', [DashboardController::class, 'calendar'])->name('dashboard.calendar');

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

// Customer Password Reset
Route::get('/customer/forgot-password', [CustomerForgotPasswordController::class, 'create'])->name('customer.password.request');
Route::post('/customer/forgot-password', [CustomerForgotPasswordController::class, 'store'])->name('customer.password.email');
Route::get('/customer/reset-password/{token}', [CustomerNewPasswordController::class, 'create'])->name('customer.password.reset');
Route::post('/customer/reset-password', [CustomerNewPasswordController::class, 'store'])->name('customer.password.update');

// Customer Routes (Protected)
Route::middleware(['auth:customer'])->group(function () {
    Route::get('/booking/create', [BookingController::class, 'create'])->name('booking.create');
    Route::post('/booking', [BookingController::class, 'store'])->middleware('throttle:5,1')->name('booking.store');
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
    Route::get('/dogs/{dog}', [CustomerDogController::class, 'show'])->name('dogs.show');
    Route::post('/dogs', [CustomerDogController::class, 'store'])
        ->name('dogs.store');
    Route::patch('/dogs/{dog}', [CustomerDogController::class, 'update'])
        ->name('dogs.update');
    Route::post('/dogs/{dog}/photo', [CustomerDogController::class, 'updatePhoto'])
        ->name('dogs.photo.update');
    Route::delete('/dogs/{dog}/photo', [CustomerDogController::class, 'deletePhoto'])
        ->name('dogs.photo.destroy');

    // Profile
    Route::get('/profile', [CustomerProfileController::class, 'edit'])
        ->name('profile.edit');
    Route::patch('/profile', [CustomerProfileController::class, 'update'])
        ->name('profile.update');
});

// Admin Routes (Protected)
Route::middleware(['ensure.not.customer', 'auth'])->prefix('admin')->name('admin.')->group(function () {
    // Dog search for booking
    Route::get('/dogs/search', [AdminDogController::class, 'search'])->name('dogs.search');

    // Booking create page
    Route::get('/bookings/create', [AppointmentController::class, 'create'])->name('bookings.create');

    // Create appointment
    Route::post('/appointments', [AppointmentController::class, 'store'])->name('appointments.store');

    Route::post('/appointments/{appointment}/confirm', [AppointmentController::class, 'confirm'])->name('appointments.confirm');
    Route::delete('/appointments/{appointment}', [AppointmentController::class, 'cancel'])->name('appointments.cancel');
    // Reschedule Endpoint
    Route::patch('/appointments/{appointment}/reschedule', [AppointmentController::class, 'reschedule'])->name('appointments.reschedule');
    // Available slots API for modal
    Route::get('/appointments/available-slots', [AppointmentController::class, 'availableSlots'])->name('appointments.available-slots');

    Route::get('/blocked-times', [BusinessHoursController::class, 'index'])->name('blocked-times.index');
    Route::post('/blocked-times', [BlockedTimeController::class, 'store'])->name('blocked-times.store');
    Route::delete('/blocked-times/{blockedTime}', [BlockedTimeController::class, 'destroy'])->name('blocked-times.destroy');

    Route::get('/dashboard/calendar', [DashboardController::class, 'calendar'])->name('dashboard.calendar');

    // Business hours management
    Route::patch('/business-hours/{businessHours}', [BusinessHoursController::class, 'update'])->name('business-hours.update');

    // Blog post management
    Route::get('/blog', [BlogPostController::class, 'index'])->name('blog.index');
    Route::get('/blog/create', [BlogPostController::class, 'create'])->name('blog.create');
    Route::post('/blog', [BlogPostController::class, 'store'])->name('blog.store');
    Route::get('/blog/{blogPost}/edit', [BlogPostController::class, 'edit'])->name('blog.edit');
    Route::patch('/blog/{blogPost}', [BlogPostController::class, 'update'])->name('blog.update');
    Route::delete('/blog/{blogPost}', [BlogPostController::class, 'destroy'])->name('blog.destroy');
    Route::patch('/blog/{blogPost}/publish', [BlogPostController::class, 'publish'])->name('blog.publish');
});

require __DIR__ . '/auth.php';
