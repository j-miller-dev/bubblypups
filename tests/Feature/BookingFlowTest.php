<?php

use App\Models\BlockedTime;
use App\Models\BusinessHours;
use App\Models\Customer;
use App\Models\Dog;
use App\Models\Service;
use App\Models\User;
use App\Notifications\NewBookingNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

beforeEach(function () {
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

test('booking form renders correctly', function () {
    $customer = Customer::factory()->create();
    Dog::factory()->for($customer)->create();

    $response = $this->actingAs($customer, 'customer')
        ->get('/booking/create');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('Booking/Create'));
});

test('booking requires authentication', function () {
    $response = $this->post('/booking', []);

    $response->assertRedirect(route('customer.login.form'));
});

test('booking submission creates appointment successfully', function () {
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();

    $response = $this->actingAs($customer, 'customer')
        ->post('/booking', [
            'dog_id' => $dog->id,
            'service_id' => $this->service->id,
            'appointment_date' => now()->addDays(7)->format('Y-m-d'),
            'appointment_time' => '10:00',
        ]);

    $response->assertRedirect(route('home'));
    $this->assertDatabaseHas('appointments', [
        'customer_id' => $customer->id,
        'dog_id' => $dog->id,
        'service_id' => $this->service->id,
        'status' => 'pending',
    ]);
});

test('booking validation requires all fields', function () {
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();

    // Provide dog_id so authorize() passes, leaving other required fields empty
    $response = $this->actingAs($customer, 'customer')
        ->postJson('/booking', ['dog_id' => $dog->id]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['service_id', 'appointment_date', 'appointment_time']);
});

test('booking rejects a dog owned by another customer', function () {
    $customer = Customer::factory()->create();
    $otherCustomer = Customer::factory()->create();
    $otherDog = Dog::factory()->for($otherCustomer)->create();

    $response = $this->actingAs($customer, 'customer')
        ->postJson('/booking', [
            'dog_id' => $otherDog->id,
            'service_id' => $this->service->id,
            'appointment_date' => now()->addDays(7)->format('Y-m-d'),
            'appointment_time' => '10:00',
        ]);

    $response->assertForbidden();
});

test('booking rejects a past date', function () {
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();

    $response = $this->actingAs($customer, 'customer')
        ->postJson('/booking', [
            'dog_id' => $dog->id,
            'service_id' => $this->service->id,
            'appointment_date' => now()->subDay()->format('Y-m-d'),
            'appointment_time' => '10:00',
        ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['appointment_date']);
});

test('booking rejects invalid time format', function () {
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();

    $response = $this->actingAs($customer, 'customer')
        ->postJson('/booking', [
            'dog_id' => $dog->id,
            'service_id' => $this->service->id,
            'appointment_date' => now()->addDays(7)->format('Y-m-d'),
            'appointment_time' => '10:00 AM',
        ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['appointment_time']);
});

test('booking saves notes', function () {
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();

    $this->actingAs($customer, 'customer')
        ->post('/booking', [
            'dog_id' => $dog->id,
            'service_id' => $this->service->id,
            'appointment_date' => now()->addDays(7)->format('Y-m-d'),
            'appointment_time' => '10:00',
            'notes' => 'Please be gentle, he is nervous',
        ]);

    $this->assertDatabaseHas('appointments', [
        'dog_id' => $dog->id,
        'notes' => 'Please be gentle, he is nervous',
    ]);
});

test('booking rejects a slot during a blocked time', function () {
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();

    $date = now()->addDays(7)->format('Y-m-d');

    BlockedTime::factory()->create([
        'start_datetime' => $date.' 09:00:00',
        'end_datetime' => $date.' 17:00:00',
    ]);

    $response = $this->actingAs($customer, 'customer')
        ->postJson('/booking', [
            'dog_id' => $dog->id,
            'service_id' => $this->service->id,
            'appointment_date' => $date,
            'appointment_time' => '10:00',
        ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['appointment_time']);
});

test('booking accepts a slot outside blocked time range', function () {
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();

    $date = now()->addDays(7)->format('Y-m-d');

    BlockedTime::factory()->create([
        'start_datetime' => $date.' 09:00:00',
        'end_datetime' => $date.' 11:00:00',
    ]);

    $response = $this->actingAs($customer, 'customer')
        ->post('/booking', [
            'dog_id' => $dog->id,
            'service_id' => $this->service->id,
            'appointment_date' => $date,
            'appointment_time' => '14:00',
        ]);

    $response->assertRedirect(route('home'));
});

test('booking uses service duration not hardcoded 60 minutes', function () {
    $service = Service::factory()->create(['duration_minutes' => 45]);
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();

    $this->actingAs($customer, 'customer')
        ->post('/booking', [
            'dog_id' => $dog->id,
            'service_id' => $service->id,
            'appointment_date' => now()->next('Monday')->format('Y-m-d'),
            'appointment_time' => '10:00',
        ]);

    $this->assertDatabaseHas('appointments', [
        'dog_id' => $dog->id,
        'service_id' => $service->id,
        'duration' => 45,
    ]);
});

test('booking rejects a day the business is closed', function () {
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();

    $this->actingAs($customer, 'customer')
        ->postJson('/booking', [
            'dog_id' => $dog->id,
            'service_id' => $this->service->id,
            'appointment_date' => now()->next('Sunday')->format('Y-m-d'),
            'appointment_time' => '10:00',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['appointment_date']);
});

test('booking rejects a time outside business hours', function () {
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();

    $this->actingAs($customer, 'customer')
        ->postJson('/booking', [
            'dog_id' => $dog->id,
            'service_id' => $this->service->id,
            'appointment_date' => now()->next('Monday')->format('Y-m-d'),
            'appointment_time' => '07:00',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['appointment_time']);
});

test('booking is rate limited after 5 requests per minute', function () {
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();

    $payload = [
        'dog_id' => $dog->id,
        'service_id' => $this->service->id,
        'appointment_date' => now()->addDays(7)->format('Y-m-d'),
        'appointment_time' => '10:00',
    ];

    for ($i = 0; $i < 5; $i++) {
        $this->actingAs($customer, 'customer')->post('/booking', $payload);
    }

    $this->actingAs($customer, 'customer')
        ->post('/booking', $payload)
        ->assertStatus(429);
});

test('booking notifies all admin users on submission', function () {
    Notification::fake();

    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();
    $admin = User::factory()->create();

    $this->actingAs($customer, 'customer')
        ->post('/booking', [
            'dog_id' => $dog->id,
            'service_id' => $this->service->id,
            'appointment_date' => now()->addDays(7)->format('Y-m-d'),
            'appointment_time' => '10:00',
        ]);

    Notification::assertSentTo($admin, NewBookingNotification::class);
});
