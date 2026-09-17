<?php

use App\Models\Customer;
use App\Models\Dog;

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'phone' => '0412345678',
        'password' => 'password',
        'password_confirmation' => 'password',
        'dog_name' => 'Buddy',
        'dog_size' => 'medium',
    ]);

    $this->assertAuthenticated('customer');
    $response->assertRedirectContains(route('booking.create', absolute: false));
    $this->assertDatabaseHas('customers', [
        'email' => 'test@example.com',
        'phone' => '+61412345678',
    ]);
});

test('registration rejects an invalid phone number', function () {
    $response = $this->postJson('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'phone' => '555-123-4567',
        'password' => 'password',
        'password_confirmation' => 'password',
        'dog_name' => 'Buddy',
        'dog_size' => 'medium',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['phone']);
});

test('registration rolls back the customer if dog creation fails', function () {
    Dog::creating(function () {
        throw new \RuntimeException('simulated failure');
    });

    $this->withoutExceptionHandling();

    try {
        $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '0412345678',
            'password' => 'password',
            'password_confirmation' => 'password',
            'dog_name' => 'Buddy',
            'dog_size' => 'medium',
        ]);
    } catch (\RuntimeException $e) {
        // expected
    }

    $this->assertGuest('customer');
    expect(Customer::where('email', 'test@example.com')->exists())->toBeFalse();
});
