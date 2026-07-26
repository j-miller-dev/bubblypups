<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Appointment>
 */
class AppointmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

        return [
            'dog_id' => \App\Models\Dog::factory(),
            'customer_id' => function (array $attributes) {
                return \App\Models\Dog::find($attributes['dog_id'])->customer_id;
            },
            'service_id' => \App\Models\Service::factory(),
            'appointment_date' => fake()->dateTimeBetween('now', '+7 days')->format('Y-m-d'),
            'appointment_time' => fake()->randomElement($times),
            'duration' => 60,
            'status' => fake()->randomElement(['pending', 'pending', 'pending', 'confirmed', 'confirmed', 'waiting_on_client']),
            'notes' => fake()->optional(0.5)->sentence(),
            'confirmed_at' => null,
            'reminder_sent_at' => null,
        ];
    }
}
