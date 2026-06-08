<?php

use App\Models\Customer;
use App\Notifications\CustomerResetPasswordNotification;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;

it('renders the forgot password page', function () {
    $response = $this->get(route('customer.password.request'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('Auth/CustomerForgotPassword'));
});

it('sends a password reset link email', function () {
    Notification::fake();

    $customer = Customer::factory()->create();

    $response = $this->post(route('customer.password.email'), [
        'email' => $customer->email,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('status');

    Notification::assertSentTo($customer, CustomerResetPasswordNotification::class);
});

it('does not reveal whether an email is registered', function () {
    Notification::fake();

    $response = $this->post(route('customer.password.email'), [
        'email' => 'notregistered@example.com',
    ]);

    $response->assertRedirect();

    Notification::assertNothingSent();
});

it('renders the reset password page with token and email', function () {
    $customer = Customer::factory()->create();

    $token = Password::broker('customers')->createToken($customer);

    $response = $this->get(route('customer.password.reset', [
        'token' => $token,
        'email' => $customer->email,
    ]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Auth/CustomerResetPassword')
        ->where('token', $token)
        ->where('email', $customer->email)
    );
});

it('resets the password with a valid token', function () {
    $customer = Customer::factory()->create();

    $token = Password::broker('customers')->createToken($customer);

    $response = $this->post(route('customer.password.update'), [
        'token' => $token,
        'email' => $customer->email,
        'password' => 'new-password-123!',
        'password_confirmation' => 'new-password-123!',
    ]);

    $response->assertRedirect(route('customer.login.form'));
    $response->assertSessionHas('status');
});

it('fails to reset password with an invalid token', function () {
    $customer = Customer::factory()->create();

    $response = $this->post(route('customer.password.update'), [
        'token' => 'invalid-token',
        'email' => $customer->email,
        'password' => 'new-password-123!',
        'password_confirmation' => 'new-password-123!',
    ]);

    $response->assertRedirect();
    $response->assertSessionHasErrors('email');
});

it('requires password confirmation to match', function () {
    $customer = Customer::factory()->create();

    $token = Password::broker('customers')->createToken($customer);

    $response = $this->post(route('customer.password.update'), [
        'token' => $token,
        'email' => $customer->email,
        'password' => 'new-password-123!',
        'password_confirmation' => 'does-not-match',
    ]);

    $response->assertSessionHasErrors('password');
});
