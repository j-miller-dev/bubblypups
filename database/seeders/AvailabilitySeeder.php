<?php

namespace Database\Seeders;

use App\Models\Availability;
use Illuminate\Database\Seeder;

class AvailabilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $availability = [
            // Monday
            ['day_of_week' => 'monday', 'start_time' => '09:00', 'end_time' => '17:00'],

            // Tuesday
            ['day_of_week' => 'tuesday', 'start_time' => '09:00', 'end_time' => '17:00'],

            // Wednesday
            ['day_of_week' => 'wednesday', 'start_time' => '09:00', 'end_time' => '17:00'],

            // Thursday
            ['day_of_week' => 'thursday', 'start_time' => '09:00', 'end_time' => '17:00'],

            // Friday
            ['day_of_week' => 'friday', 'start_time' => '09:00', 'end_time' => '17:00'],

            // Saturday (shorter hours)
            ['day_of_week' => 'saturday', 'start_time' => '09:00', 'end_time' => '15:00'],

            // Sunday (closed)
            ['day_of_week' => 'sunday', 'start_time' => '00:00', 'end_time' => '00:00', 'is_available' => false, 'notes' => 'Closed on Sundays'],
        ];

        foreach ($availability as $slot) {
            Availability::create($slot);
        }
    }
}
