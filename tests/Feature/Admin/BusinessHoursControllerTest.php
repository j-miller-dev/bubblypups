<?php

use App\Models\BusinessHours;
use App\Models\User;

beforeEach(function () {
    $this->admin = User::factory()->create();
});

test('admin can update business hours with valid open and close times', function () {
    $hours = BusinessHours::create([
        'day_of_week' => 'monday',
        'is_open' => true,
        'open_time' => '09:00',
        'close_time' => '17:00',
        'slot_duration' => 30,
    ]);

    $this->actingAs($this->admin)
        ->patch(route('admin.business-hours.update', $hours), [
            'is_open' => true,
            'open_time' => '10:00',
            'close_time' => '18:00',
            'slot_duration' => 30,
        ])
        ->assertRedirect();

    expect($hours->fresh()->close_time)->toBe('18:00');
});

test('close time must be after open time', function () {
    $hours = BusinessHours::create([
        'day_of_week' => 'monday',
        'is_open' => true,
        'open_time' => '09:00',
        'close_time' => '17:00',
        'slot_duration' => 30,
    ]);

    $response = $this->actingAs($this->admin)
        ->patch(route('admin.business-hours.update', $hours), [
            'is_open' => true,
            'open_time' => '17:00',
            'close_time' => '09:00',
            'slot_duration' => 30,
        ]);

    $response->assertSessionHasErrors('close_time');
    expect($hours->fresh()->close_time)->toBe('17:00');
});

test('close time equal to open time is rejected', function () {
    $hours = BusinessHours::create([
        'day_of_week' => 'monday',
        'is_open' => true,
        'open_time' => '09:00',
        'close_time' => '17:00',
        'slot_duration' => 30,
    ]);

    $this->actingAs($this->admin)
        ->patch(route('admin.business-hours.update', $hours), [
            'is_open' => true,
            'open_time' => '09:00',
            'close_time' => '09:00',
            'slot_duration' => 30,
        ])
        ->assertSessionHasErrors('close_time');
});
