<?php

use App\Models\Customer;

beforeEach(function () {
    $this->customer = Customer::factory()->create();
});

test('customer can view their profile', function () {
    $this->actingAs($this->customer, 'customer')
        ->get(route('my.profile.edit'))
        ->assertOk();
});

test('customer can update their profile and phone number is normalized', function () {
    $this->actingAs($this->customer, 'customer')
        ->patch(route('my.profile.update'), [
            'name' => 'Updated Name',
            'email' => $this->customer->email,
            'phone' => '0412 345 678',
        ])
        ->assertRedirect();

    expect($this->customer->fresh())
        ->name->toBe('Updated Name')
        ->phone->toBe('+61412345678');
});

test('profile update rejects an invalid phone number', function () {
    $response = $this->actingAs($this->customer, 'customer')
        ->patchJson(route('my.profile.update'), [
            'name' => 'Updated Name',
            'email' => $this->customer->email,
            'phone' => 'not-a-phone-number',
        ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['phone']);
});

test('guests cannot update a customer profile', function () {
    $this->patch(route('my.profile.update'), [
        'name' => 'Updated Name',
        'email' => $this->customer->email,
        'phone' => '0412345678',
    ])->assertRedirect(route('customer.login.form'));
});
