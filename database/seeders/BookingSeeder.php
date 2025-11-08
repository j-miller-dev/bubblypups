<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Dog;
use App\Models\Owner;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure we have some owners and dogs (assumes OwnerSeeder and DogSeeder ran)
        $dogIds = Dog::query()->pluck('id')->all();
        $ownerIds = Owner::query()->pluck('id')->all();
        if (empty($dogIds) || empty($ownerIds)) {
            // If not present, nothing to do safely
            return;
        }

        $services = [
            'Full Groom',
            'Bath & Brush',
            'Nail Trim',
            'Puppy Intro',
            'De-shedding',
        ];

        $start = Carbon::today();
        // End is end of next week (Sunday of next ISO week)
        $endOfNextWeek = (clone $start)->addWeek()->endOfWeek(Carbon::SUNDAY);

        // Create 2-3 bookings per day
        for ($day = $start->copy(); $day->lte($endOfNextWeek); $day->addDay()) {
            // Skip past days before today? We start at today inclusive per requirement
            $count = rand(2, 3);
            $times = $this->pickTimesForDay($count, $day);

            foreach ($times as $time) {
                $scheduledAt = $day->copy()->setTimeFromTimeString($time);
                $dogId = $dogIds[array_rand($dogIds)];
                // Align owner with dog's owner to maintain FK integrity and realistic data
                $dog = Dog::find($dogId);
                $ownerId = $dog?->owner_id ?? $ownerIds[array_rand($ownerIds)];

                Booking::create([
                    'owner_id' => $ownerId,
                    'dog_id' => $dogId,
                    'service' => $services[array_rand($services)],
                    'scheduled_at' => $scheduledAt,
                    'status' => 'pending',
                    'notes' => 'Auto-seeded booking for demo.',
                ]);
            }
        }
    }

    /**
     * Pick distinct HH:MM times for a given day, spaced within business hours.
     *
     * @return array<int,string>
     */
    protected function pickTimesForDay(int $count, Carbon $day): array
    {
        // Business hours roughly 9:00 to 16:30, 60-90 min slots
        $slots = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30'];
        shuffle($slots);

        return array_slice($slots, 0, max(2, min(3, $count)));
    }
}
