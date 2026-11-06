<?php

use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('shows real service pricing by size on the public pricing page', function () {
    $service = Service::factory()->create([
        'name' => 'Full doggy pamper',
        'base_price' => 65.00,
        'duration_minutes' => 120,
        'pricing_tiers' => ['small' => 55.00, 'medium' => 65.00, 'large' => 85.00],
        'duration_tiers' => ['small' => 95, 'medium' => 120, 'large' => 155],
    ]);

    $response = $this->get('/pricing');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Pricing')
        ->has('services', 1)
        ->where('services.0.name', $service->name)
        ->where('services.0.pricing_tiers.small', 55)
        ->where('services.0.pricing_tiers.medium', 65)
        ->where('services.0.pricing_tiers.large', 85)
        ->where('services.0.duration_tiers.small', 95)
        ->where('services.0.duration_tiers.medium', 120)
        ->where('services.0.duration_tiers.large', 155)
    );
});

it('falls back to the flat duration when a service has no duration tiers configured', function () {
    Service::factory()->create([
        'duration_minutes' => 60,
        'duration_tiers' => null,
    ]);

    $response = $this->get('/pricing');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('services.0.duration_tiers.medium', 60)
    );
});
