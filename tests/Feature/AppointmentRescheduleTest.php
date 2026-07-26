<?php

use App\Models\Appointment;
use App\Models\BusinessHours;
use App\Models\Customer;
use App\Models\Dog;
use App\Models\User;
use Carbon\Carbon;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);

    // Use next Thursday so business hours match and dates are always in the future
    $this->testDate = Carbon::parse('next thursday')->format('Y-m-d');
    $this->nextDate = Carbon::parse('next thursday')->addDay()->format('Y-m-d');

    BusinessHours::create([
        'day_of_week' => 'thursday',
        'is_open' => true,
        'open_time' => '09:00',
        'close_time' => '17:00',
        'slot_duration' => 30,
    ]);
});

test('available slots endpoint excludes appointment being rescheduled', function () {
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->create(['customer_id' => $customer->id]);

    $appointment = Appointment::factory()->create([
        'customer_id' => $customer->id,
        'dog_id' => $dog->id,
        'appointment_date' => $this->testDate,
        'appointment_time' => '10:00:00',
        'status' => 'confirmed',
    ]);

    $response = $this->getJson('/admin/appointments/available-slots?date='.$this->testDate.'&exclude_appointment_id='.$appointment->id);

    $response->assertSuccessful();
    $slots = $response->json('slots');

    // The 10:00 slot should be available since we're excluding this appointment
    expect($slots)->toContain('10:00');
});

test('available slots endpoint shows slot as booked when not excluding appointment', function () {
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->create(['customer_id' => $customer->id]);

    Appointment::factory()->create([
        'customer_id' => $customer->id,
        'dog_id' => $dog->id,
        'appointment_date' => $this->testDate,
        'appointment_time' => '10:00:00',
        'status' => 'confirmed',
    ]);

    $response = $this->getJson('/admin/appointments/available-slots?date='.$this->testDate);

    $response->assertSuccessful();
    $slots = $response->json('slots');

    // The 10:00 slot should NOT be available
    expect($slots)->not->toContain('10:00');
});

test('can reschedule appointment to same time without constraint violation', function () {
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->create(['customer_id' => $customer->id]);

    $appointment = Appointment::factory()->create([
        'customer_id' => $customer->id,
        'dog_id' => $dog->id,
        'appointment_date' => $this->testDate,
        'appointment_time' => '10:00:00',
        'status' => 'pending',
    ]);

    $response = $this->patchJson("/admin/appointments/{$appointment->id}/reschedule", [
        'appointment_date' => $this->testDate,
        'appointment_time' => '10:00',
        'status' => 'confirmed',
        'notes' => 'Confirming current time',
    ]);

    $response->assertRedirect();

    $appointment->refresh();
    expect($appointment->status)->toBe('confirmed');
    expect($appointment->confirmed_at)->not->toBeNull();
});

test('can reschedule appointment to different available time', function () {
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->create(['customer_id' => $customer->id]);

    $appointment = Appointment::factory()->create([
        'customer_id' => $customer->id,
        'dog_id' => $dog->id,
        'appointment_date' => $this->testDate,
        'appointment_time' => '10:00:00',
        'status' => 'pending',
    ]);

    $response = $this->patchJson("/admin/appointments/{$appointment->id}/reschedule", [
        'appointment_date' => $this->testDate,
        'appointment_time' => '11:00',
        'status' => 'confirmed',
        'notes' => 'Moving to 11am',
    ]);

    $response->assertRedirect();

    $appointment->refresh();
    expect($appointment->appointment_time->format('H:i'))->toBe('11:00');
    expect($appointment->status)->toBe('confirmed');
});

test('cannot reschedule to already booked time slot', function () {
    $customer1 = Customer::factory()->create();
    $dog1 = Dog::factory()->create(['customer_id' => $customer1->id]);

    $customer2 = Customer::factory()->create();
    $dog2 = Dog::factory()->create(['customer_id' => $customer2->id]);

    // Create first appointment at 10:00
    Appointment::factory()->create([
        'customer_id' => $customer1->id,
        'dog_id' => $dog1->id,
        'appointment_date' => $this->testDate,
        'appointment_time' => '10:00:00',
        'status' => 'confirmed',
    ]);

    // Create second appointment at 11:00
    $appointment2 = Appointment::factory()->create([
        'customer_id' => $customer2->id,
        'dog_id' => $dog2->id,
        'appointment_date' => $this->testDate,
        'appointment_time' => '11:00:00',
        'status' => 'confirmed',
    ]);

    // Try to reschedule appointment2 to 10:00 (already taken by appointment1)
    $response = $this->patchJson("/admin/appointments/{$appointment2->id}/reschedule", [
        'appointment_date' => $this->testDate,
        'appointment_time' => '10:00',
        'status' => 'confirmed',
    ]);

    // Should fail with a validation error, not redirect
    expect($response->status())->not->toBe(302);
});

test('reschedule with waiting_on_client status clears confirmed_at', function () {
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->create(['customer_id' => $customer->id]);

    $appointment = Appointment::factory()->create([
        'customer_id' => $customer->id,
        'dog_id' => $dog->id,
        'appointment_date' => $this->testDate,
        'appointment_time' => '10:00:00',
        'status' => 'confirmed',
        'confirmed_at' => now(),
    ]);

    $response = $this->patchJson("/admin/appointments/{$appointment->id}/reschedule", [
        'appointment_date' => $this->nextDate,
        'appointment_time' => '14:00',
        'status' => 'waiting_on_client',
        'notes' => 'Proposing new time to client',
    ]);

    $response->assertRedirect();

    $appointment->refresh();
    expect($appointment->status)->toBe('waiting_on_client');
    expect($appointment->confirmed_at)->toBeNull();
});
