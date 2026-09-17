<?php

use App\Models\Customer;

test('customer login screen can be rendered', function () {
    $response = $this->get(route('customer.login.form'));

    $response->assertOk();
});

test('customers can authenticate using the login screen', function () {
    $customer = Customer::factory()->create();

    $response = $this->post(route('customer.login'), [
        'email' => $customer->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated('customer');
    $response->assertRedirect(route('my.dashboard'));
});

test('customer login is throttled after repeated failed attempts', function () {
    $customer = Customer::factory()->create();

    for ($i = 0; $i < 5; $i++) {
        $this->post(route('customer.login'), [
            'email' => $customer->email,
            'password' => 'wrong-password',
        ]);
    }

    $response = $this->post(route('customer.login'), [
        'email' => $customer->email,
        'password' => 'wrong-password',
    ]);

    $response->assertStatus(429);
});

test('customer registration is throttled after repeated attempts', function () {
    for ($i = 0; $i < 5; $i++) {
        $this->post(route('customer.register'), []);
    }

    $response = $this->post(route('customer.register'), []);

    $response->assertStatus(429);
});
