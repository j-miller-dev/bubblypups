<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BlockedTime>
 */
class BlockedTimeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $start = fake()->dateTimeBetween('+1 days', '+7 days');

        return [
            'reason' => fake()->words(3, true),
            'start_datetime' => $start,
            'end_datetime' => (clone $start)->modify('+8 hours'),
        ];
    }
}
