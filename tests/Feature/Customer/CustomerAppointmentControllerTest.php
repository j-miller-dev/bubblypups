<?php

use App\Models\Appointment;
use App\Models\Customer;
use App\Models\Dog;

beforeEach(function () {
    $this->customer = Customer::factory()->create();
    $this->dog = Dog::factory()->for($this->customer)->create();
    $this->actingAs($this->customer, 'customer');
});

test('index renders appointments page', function () {
    $this->get(route('my.appointments'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('My/Appointments')
            ->has('appointments.upcoming')
            ->has('appointments.past')
            ->has('appointments.cancelled')
        );
});

test('upcoming appointments are date >= today and not cancelled', function () {
    Appointment::factory()->for($this->dog)->create([
        'appointment_date' => now()->addDays(3)->toDateString(),
        'appointment_time' => '10:00:00',
        'status' => 'confirmed',
    ]);

    $this->get(route('my.appointments'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('appointments.upcoming', 1)
            ->has('appointments.past', 0)
            ->has('appointments.cancelled', 0)
        );
});

test('past appointments are date < today', function () {
    Appointment::factory()->for($this->dog)->create([
        'appointment_date' => now()->subDays(3)->toDateString(),
        'appointment_time' => '10:00:00',
        'status' => 'completed',
    ]);

    $this->get(route('my.appointments'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('appointments.upcoming', 0)
            ->has('appointments.past', 1)
            ->has('appointments.cancelled', 0)
        );
});

test('cancelled appointments appear in cancelled list', function () {
    Appointment::factory()->for($this->dog)->create([
        'appointment_date' => now()->addDays(3)->toDateString(),
        'appointment_time' => '10:00:00',
        'status' => 'cancelled',
    ]);

    $this->get(route('my.appointments'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('appointments.upcoming', 0)
            ->has('appointments.past', 0)
            ->has('appointments.cancelled', 1)
        );
});

test('appointments from other customers are not visible', function () {
    $otherCustomer = Customer::factory()->create();
    $otherDog = Dog::factory()->for($otherCustomer)->create();

    Appointment::factory()->for($otherDog)->create([
        'appointment_date' => now()->addDays(3)->toDateString(),
        'status' => 'confirmed',
    ]);

    $this->get(route('my.appointments'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('appointments.upcoming', 0)
            ->has('appointments.past', 0)
            ->has('appointments.cancelled', 0)
        );
});

test('guests are redirected from appointments index', function () {
    auth()->logout();

    $this->get(route('my.appointments'))
        ->assertRedirect();
});
