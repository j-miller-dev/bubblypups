<?php

use App\Models\Service;

test('getDurationForSize returns the tiered value when present', function () {
    $service = Service::factory()->create([
        'duration_minutes' => 60,
        'duration_tiers' => ['small' => 45, 'medium' => 60, 'large' => 80],
    ]);

    expect($service->getDurationForSize('large'))->toBe(80);
});

test('getDurationForSize falls back to duration_minutes when tiers are missing', function () {
    $service = Service::factory()->create([
        'duration_minutes' => 60,
        'duration_tiers' => null,
    ]);

    expect($service->getDurationForSize('large'))->toBe(60);
});
