<?php

use App\Models\Appointment;
use App\Models\BusinessHours;
use App\Models\Customer;
use App\Models\Dog;
use App\Models\User;
use App\Notifications\AppointmentConfirmedNotification;
use App\Notifications\AppointmentReminderNotification;
use App\Notifications\AppointmentRescheduledNotification;
use App\Notifications\NewBookingNotification;
use Illuminate\Support\Facades\Notification;

beforeEach(function () {
    // Create business hours for testing
    BusinessHours::create([
        'day_of_week' => 'monday',
        'is_open' => true,
        'open_time' => '09:00',
        'close_time' => '17:00',
        'slot_duration' => 30,
    ]);

    BusinessHours::create([
        'day_of_week' => 'tuesday',
        'is_open' => true,
        'open_time' => '09:00',
        'close_time' => '17:00',
        'slot_duration' => 30,
    ]);

    BusinessHours::create([
        'day_of_week' => 'wednesday',
        'is_open' => true,
        'open_time' => '09:00',
        'close_time' => '17:00',
        'slot_duration' => 30,
    ]);

    BusinessHours::create([
        'day_of_week' => 'thursday',
        'is_open' => true,
        'open_time' => '09:00',
        'close_time' => '17:00',
        'slot_duration' => 30,
    ]);

    BusinessHours::create([
        'day_of_week' => 'friday',
        'is_open' => true,
        'open_time' => '09:00',
        'close_time' => '17:00',
        'slot_duration' => 30,
    ]);
});

test('sends new booking notification to admin when customer books', function () {
    Notification::fake();

    $customer = Customer::factory()->create();
    $dog = Dog::factory()->create(['customer_id' => $customer->id]);
    $admin = User::factory()->create();

    $this->actingAs($customer, 'customer')
        ->post('/booking', [
            'dog_id' => $dog->id,
            'appointment_date' => now()->addDays(3)->toDateString(),
            'appointment_time' => '10:00',
        ]);

    Notification::assertSentTo($admin, NewBookingNotification::class);
});

test('sends confirmation to customer when admin confirms', function () {
    Notification::fake();

    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();
    $appointment = Appointment::factory()->for($dog)->create(['status' => 'pending']);
    $admin = User::factory()->create();

    $this->actingAs($admin)->post("/admin/appointments/{$appointment->id}/confirm");

    Notification::assertSentTo($customer, AppointmentConfirmedNotification::class);
});

test('sends reschedule notification to customer when admin reschedules', function () {
    Notification::fake();

    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();
    $appointment = Appointment::factory()->create([
        'customer_id' => $customer->id,
        'dog_id' => $dog->id,
        'status' => 'confirmed',
        'appointment_date' => '2026-01-20',
        'appointment_time' => '10:00:00',
    ]);
    $admin = User::factory()->create();

    $response = $this->actingAs($admin)->patch("/admin/appointments/{$appointment->id}/reschedule", [
        'appointment_date' => '2026-01-21',
        'appointment_time' => '14:00',
        'status' => 'confirmed',
        'notes' => 'Changed to afternoon',
    ]);

    $response->assertRedirect();
    Notification::assertSentTo($customer, AppointmentRescheduledNotification::class);
});

test('sends reminder to customers with appointments tomorrow', function () {
    Notification::fake();

    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();
    $appointment = Appointment::factory()->for($dog)->create([
        'status' => 'confirmed',
        'appointment_date' => now()->addDay()->toDateString(),
        'reminder_sent_at' => null,
    ]);

    $this->artisan('appointments:send-reminders');

    Notification::assertSentTo($customer, AppointmentReminderNotification::class);
    expect($appointment->fresh()->reminder_sent_at)->not->toBeNull();
});

test('does not send reminder twice to same appointment', function () {
    Notification::fake();

    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();
    $appointment = Appointment::factory()->for($dog)->create([
        'status' => 'confirmed',
        'appointment_date' => now()->addDay()->toDateString(),
        'reminder_sent_at' => now()->subHour(), // Already sent
    ]);

    $this->artisan('appointments:send-reminders');

    Notification::assertNothingSent();
});
