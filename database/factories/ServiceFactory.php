<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Service>
 */
class ServiceFactory extends Factory
{
    private static array $services = [
        ['name' => 'Full doggy pamper', 'emoji' => '🐕‍🦺', 'base_price' => 65.00, 'duration_minutes' => 120],
        ['name' => 'Cut and clipping', 'emoji' => '✂️', 'base_price' => 35.00, 'duration_minutes' => 60],
        ['name' => 'Deep wash', 'emoji' => '🛁', 'base_price' => 28.00, 'duration_minutes' => 45],
        ['name' => 'Teeth and nails', 'emoji' => '🦷', 'base_price' => 22.00, 'duration_minutes' => 30],
        ['name' => 'Nail trim only', 'emoji' => '💅', 'base_price' => 15.00, 'duration_minutes' => 15],
        ['name' => 'De-shedding treatment', 'emoji' => '🌪️', 'base_price' => 40.00, 'duration_minutes' => 75],
    ];

    public function definition(): array
    {
        $service = fake()->randomElement(self::$services);

        return [
            'name' => $service['name'],
            'description' => fake()->sentence(),
            'emoji' => $service['emoji'],
            'base_price' => $service['base_price'],
            'duration_minutes' => $service['duration_minutes'],
            'pricing_tiers' => [
                'small' => $service['base_price'] * 0.85,
                'medium' => $service['base_price'],
                'large' => $service['base_price'] * 1.30,
            ],
        ];
    }
}
