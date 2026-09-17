<?php

use App\Notifications\NewContactNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

test('contact form succeeds with email only', function () {
    $this->post(route('contact.store'), [
        'name' => 'Jane Smith',
        'email' => 'jane@example.com',
        'message' => 'Hello, I have a question.',
    ])->assertRedirect(route('contact'));

    $this->assertDatabaseHas('contacts', ['email' => 'jane@example.com']);
});

test('contact form succeeds with phone only', function () {
    $this->post(route('contact.store'), [
        'name' => 'Jane Smith',
        'phone' => '0412345678',
        'message' => 'Hello, I have a question.',
    ])->assertRedirect(route('contact'));

    $this->assertDatabaseHas('contacts', ['phone' => '0412345678']);
});

test('contact form succeeds with both email and phone', function () {
    $this->post(route('contact.store'), [
        'name' => 'Jane Smith',
        'email' => 'jane@example.com',
        'phone' => '0412345678',
        'message' => 'Hello, I have a question.',
    ])->assertRedirect(route('contact'));

    $this->assertDatabaseHas('contacts', [
        'email' => 'jane@example.com',
        'phone' => '0412345678',
    ]);
});

test('contact form fails with neither email nor phone', function () {
    $this->postJson(route('contact.store'), [
        'name' => 'Jane Smith',
        'message' => 'Hello, I have a question.',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email', 'phone']);
});

test('contact form requires name', function () {
    $this->postJson(route('contact.store'), [
        'email' => 'jane@example.com',
        'message' => 'Hello.',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name']);
});

test('contact form requires message', function () {
    $this->postJson(route('contact.store'), [
        'name' => 'Jane Smith',
        'email' => 'jane@example.com',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['message']);
});

test('contact form sends notification to owner', function () {
    Notification::fake();

    $this->post(route('contact.store'), [
        'name' => 'Jane Smith',
        'email' => 'jane@example.com',
        'message' => 'Hello, I have a question.',
    ]);

    Notification::assertSentOnDemand(NewContactNotification::class);
});

test('contact form rejects submissions with the honeypot field filled in', function () {
    $this->postJson(route('contact.store'), [
        'name' => 'Bot',
        'email' => 'bot@example.com',
        'message' => 'Buy cheap watches',
        'website' => 'http://spam.example.com',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['website']);

    $this->assertDatabaseMissing('contacts', ['email' => 'bot@example.com']);
});

test('contact form is throttled after 5 requests per minute', function () {
    for ($i = 0; $i < 5; $i++) {
        $this->post(route('contact.store'), [
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'message' => 'Hello, I have a question.',
        ]);
    }

    $this->post(route('contact.store'), [
        'name' => 'Jane Smith',
        'email' => 'jane@example.com',
        'message' => 'Hello, I have a question.',
    ])->assertStatus(429);
});
