<?php

use App\Models\Service;

test('default duration tiers scale proportionally and round to 5 minutes', function () {
    expect(Service::defaultDurationTiers(60))->toBe([
        'small' => 50,
        'medium' => 60,
        'large' => 80,
    ]);
});

test('default duration tiers never go below a 10 minute floor', function () {
    $tiers = Service::defaultDurationTiers(10);

    expect($tiers['small'])->toBeGreaterThanOrEqual(10);
});
