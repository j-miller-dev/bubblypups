<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class BusinessHoursSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultHours = [
            [
                'day_of_week' => 'monday',
                'is_open' => true,
                'open_time' => '09:00',
                'close_time' => '17:00',
                'slot_duration' => 30,
            ],
            [
                'day_of_week' => 'tuesday',
                'is_open' => true,
                'open_time' => '09:00',
                'close_time' => '17:00',
                'slot_duration' => 30,
            ],
            [
                'day_of_week' => 'wednesday',
                'is_open' => true,
                'open_time' => '09:00',
                'close_time' => '17:00',
                'slot_duration' => 30,
            ],
            [
                'day_of_week' => 'thursday',
                'is_open' => true,
                'open_time' => '09:00',
                'close_time' => '17:00',
                'slot_duration' => 30,
            ],
            [
                'day_of_week' => 'friday',
                'is_open' => true,
                'open_time' => '09:00',
                'close_time' => '17:00',
                'slot_duration' => 30,
            ],
            [
                'day_of_week' => 'saturday',
                'is_open' => true,
                'open_time' => '10:00',
                'close_time' => '14:00',
                'slot_duration' => 30,
            ],
            [
                'day_of_week' => 'sunday',
                'is_open' => false,
                'open_time' => null,
                'close_time' => null,
                'slot_duration' => 30,
            ],
        ];

        foreach ($defaultHours as $hours) {
            \App\Models\BusinessHours::updateOrCreate(
                ['day_of_week' => $hours['day_of_week']],
                $hours
            );
        }
    }
}
