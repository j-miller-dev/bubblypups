<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Dog>
 */
class DogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $breeds = ['Golden Retriever', 'Labrador', 'Poodle', 'German Shepherd', 'Bulldog', 'Beagle', 'Chihuahua', 'Husky', 'Corgi', 'Dachshund'];
        $dogNames = ['Max', 'Bella', 'Charlie', 'Luna', 'Cooper', 'Daisy', 'Rocky', 'Sadie', 'Duke', 'Molly', 'Bear', 'Lola', 'Zeus', 'Penny'];

        return [
            'customer_id' => \App\Models\Customer::factory(),
            'name' => fake()->randomElement($dogNames),
            'breed' => fake()->randomElement($breeds),
            'size' => fake()->randomElement(['small', 'medium', 'large']),
            'special_notes' => fake()->optional(0.3)->sentence(),
        ];
    }
}
