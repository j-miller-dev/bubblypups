<?php

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\BlockedTime;
use App\Models\BusinessHours;
use App\Models\Customer;
use App\Models\Dog;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = User::factory()->create();
    $this->service = Service::factory()->create(['duration_minutes' => 60]);

    foreach (['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as $day) {
        BusinessHours::create([
            'day_of_week' => $day,
            'is_open' => true,
            'open_time' => '09:00',
            'close_time' => '17:00',
            'slot_duration' => 30,
        ]);
    }

    BusinessHours::create([
        'day_of_week' => 'sunday',
        'is_open' => false,
        'open_time' => '09:00',
        'close_time' => '17:00',
        'slot_duration' => 30,
    ]);
});

// --- create page ---

test('booking create page renders for admin', function () {
    $this->actingAs($this->admin)
        ->get(route('admin.bookings.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Admin/BookingCreate')->has('services'));
});

test('booking create page is inaccessible to guests', function () {
    $this->get(route('admin.bookings.create'))->assertRedirect();
});

// --- store: existing dog ---

test('admin can create appointment for existing dog', function () {
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();

    $this->actingAs($this->admin)
        ->post(route('admin.appointments.store'), [
            'dog_id' => $dog->id,
            'service_id' => $this->service->id,
            'appointment_date' => now()->next('Monday')->format('Y-m-d'),
            'appointment_time' => '10:00',
            'status' => AppointmentStatus::Confirmed->value,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('appointments', [
        'dog_id' => $dog->id,
        'customer_id' => $customer->id,
        'service_id' => $this->service->id,
        'status' => AppointmentStatus::Confirmed,
    ]);
});

test('admin can create appointment with new customer and dog', function () {
    $this->actingAs($this->admin)
        ->post(route('admin.appointments.store'), [
            'new_customer' => [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'phone' => '0412345678',
            ],
            'new_dog' => [
                'name' => 'Biscuit',
                'breed' => 'Poodle',
                'size' => 'small',
            ],
            'service_id' => $this->service->id,
            'appointment_date' => now()->next('Monday')->format('Y-m-d'),
            'appointment_time' => '10:00',
            'status' => AppointmentStatus::Pending->value,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('customers', ['email' => 'jane@example.com']);
    $this->assertDatabaseHas('dogs', ['name' => 'Biscuit']);
    $this->assertDatabaseHas('appointments', ['status' => AppointmentStatus::Pending]);
});

test('confirmed_at is set when admin creates confirmed appointment', function () {
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();

    $this->actingAs($this->admin)
        ->post(route('admin.appointments.store'), [
            'dog_id' => $dog->id,
            'service_id' => $this->service->id,
            'appointment_date' => now()->next('Monday')->format('Y-m-d'),
            'appointment_time' => '10:00',
            'status' => AppointmentStatus::Confirmed->value,
        ]);

    $appointment = Appointment::first();
    expect($appointment->confirmed_at)->not->toBeNull();
});

// --- store: blocked time validation ---

test('admin cannot create appointment during a blocked time', function () {
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();

    $date = now()->next('Monday')->format('Y-m-d');

    BlockedTime::factory()->create([
        'start_datetime' => $date.' 09:00:00',
        'end_datetime' => $date.' 17:00:00',
    ]);

    $this->actingAs($this->admin)
        ->postJson(route('admin.appointments.store'), [
            'dog_id' => $dog->id,
            'service_id' => $this->service->id,
            'appointment_date' => $date,
            'appointment_time' => '10:00',
            'status' => AppointmentStatus::Confirmed->value,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['appointment_time']);
});

test('admin cannot create appointment on a closed day', function () {
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();

    $this->actingAs($this->admin)
        ->postJson(route('admin.appointments.store'), [
            'dog_id' => $dog->id,
            'service_id' => $this->service->id,
            'appointment_date' => now()->next('Sunday')->format('Y-m-d'),
            'appointment_time' => '10:00',
            'status' => AppointmentStatus::Confirmed->value,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['appointment_date']);
});

test('admin cannot create appointment outside business hours', function () {
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();

    $this->actingAs($this->admin)
        ->postJson(route('admin.appointments.store'), [
            'dog_id' => $dog->id,
            'service_id' => $this->service->id,
            'appointment_date' => now()->next('Monday')->format('Y-m-d'),
            'appointment_time' => '07:00',
            'status' => AppointmentStatus::Confirmed->value,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['appointment_time']);
});

test('store is inaccessible to guests', function () {
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();

    $this->postJson(route('admin.appointments.store'), [
        'dog_id' => $dog->id,
        'service_id' => $this->service->id,
        'appointment_date' => now()->next('Monday')->format('Y-m-d'),
        'appointment_time' => '10:00',
        'status' => AppointmentStatus::Confirmed->value,
    ])->assertUnauthorized();
});

// --- available slots ---

test('available slots returns slots for a given date', function () {
    $this->actingAs($this->admin)
        ->getJson('/admin/appointments/available-slots?date='.now()->next('Monday')->format('Y-m-d'))
        ->assertOk()
        ->assertJsonStructure(['slots', 'existing_appointments']);
});

test('available slots returns empty for a closed day', function () {
    $this->actingAs($this->admin)
        ->getJson('/admin/appointments/available-slots?date='.now()->next('Sunday')->format('Y-m-d'))
        ->assertOk()
        ->assertJson(['slots' => [], 'existing_appointments' => []]);
});

test('available slots excludes a given appointment id', function () {
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();

    $date = now()->next('Monday')->format('Y-m-d');

    $appointment = Appointment::factory()->create([
        'dog_id' => $dog->id,
        'customer_id' => $customer->id,
        'appointment_date' => $date,
        'appointment_time' => '10:00:00',
        'status' => AppointmentStatus::Confirmed,
    ]);

    $response = $this->actingAs($this->admin)
        ->getJson("/admin/appointments/available-slots?date={$date}&exclude_appointment_id={$appointment->id}")
        ->assertOk();

    expect($response->json('slots'))->toContain('10:00');
});
