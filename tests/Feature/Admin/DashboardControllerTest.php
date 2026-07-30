<?php

use App\Models\Appointment;
use App\Models\Customer;
use App\Models\Dog;
use App\Models\User;

beforeEach(function () {
    $this->admin = User::factory()->create();
    $this->actingAs($this->admin);
});

test('bookings page renders for admin', function () {
    $this->get(route('dashboard.bookings'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Dashboard/Bookings')->has('appointments'));
});

test('calendar page renders for admin', function () {
    $this->get(route('dashboard.calendar'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Dashboard/Calendar')
            ->has('businessHours')
            ->has('appointments')
            ->has('blockedTimes')
            ->has('initialDate')
        );
});

test('bookings page includes upcoming appointment data', function () {
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->create(['customer_id' => $customer->id]);

    Appointment::factory()->create([
        'customer_id' => $customer->id,
        'dog_id' => $dog->id,
        'appointment_date' => now()->addDay()->format('Y-m-d'),
        'appointment_time' => '10:00:00',
        'status' => 'confirmed',
    ]);

    $this->get(route('dashboard.bookings'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Dashboard/Bookings')
            ->has('appointments', 1, fn ($appt) => $appt
                ->has('id')
                ->has('dog')
                ->has('breed')
                ->has('owner')
                ->has('service')
                ->has('date')
                ->has('time')
                ->has('status')
                ->etc()
            )
        );
});

test('bookings page is inaccessible to guests', function () {
    auth()->logout();

    $this->get(route('dashboard.bookings'))
        ->assertRedirect();
});

test('calendar page is inaccessible to guests', function () {
    auth()->logout();

    $this->get(route('dashboard.calendar'))
        ->assertRedirect();
});
