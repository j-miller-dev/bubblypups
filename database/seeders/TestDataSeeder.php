<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Customer;
use App\Models\Dog;
use Illuminate\Database\Seeder;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create 15 customers, each with 1-3 dogs
        Customer::factory(15)
            ->has(Dog::factory()->count(rand(1, 3)))
            ->create();

        // Create appointments for the next 30 days
        $dogs = Dog::all();
        $times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
        $usedSlots = [];

        // Status weights for realistic distribution
        // More pending than waiting, more confirmed than pending
        $statuses = [
            'pending',
            'pending',
            'pending',
            'pending',
            'pending',
            'confirmed',
            'confirmed',
            'confirmed',
            'confirmed',
            'confirmed',
            'confirmed',
            'confirmed',
            'waiting_on_client',
            'waiting_on_client',
        ];

        // Generate 40-50 appointments spread across the next month
        $appointmentsToCreate = rand(40, 50);
        $created = 0;

        while ($created < $appointmentsToCreate) {
            $dog = $dogs->random();
            $date = now()->addDays(rand(0, 30))->format('Y-m-d');
            $time = fake()->randomElement($times);

            // Ensure no duplicate date+time (unique constraint)
            $slot = $date.'-'.$time;
            if (in_array($slot, $usedSlots)) {
                continue;
            }
            $usedSlots[] = $slot;

            $status = fake()->randomElement($statuses);

            // Set confirmed_at based on status
            $confirmedAt = null;
            if ($status === 'confirmed') {
                // Confirmed between 1-7 days ago
                $confirmedAt = now()->subDays(rand(1, 7));
            }

            Appointment::create([
                'dog_id' => $dog->id,
                'customer_id' => $dog->customer_id,
                'appointment_date' => $date,
                'appointment_time' => $time,
                'duration' => 60,
                'status' => $status,
                'notes' => fake()->optional(0.3)->sentence(),
                'confirmed_at' => $confirmedAt,
            ]);

            $created++;
        }

        // Output summary
        $this->command->info('✓ Created '.Customer::count().' customers');
        $this->command->info('✓ Created '.Dog::count().' dogs');
        $this->command->info('✓ Created '.Appointment::count().' appointments');
        $this->command->newLine();

        // Show breakdown by status
        $pending = Appointment::where('status', 'pending')->count();
        $confirmed = Appointment::where('status', 'confirmed')->count();
        $waiting = Appointment::where('status', 'waiting_on_client')->count();

        $this->command->info('Appointment breakdown:');
        $this->command->info("  - Pending: {$pending}");
        $this->command->info("  - Confirmed: {$confirmed}");
        $this->command->info("  - Waiting on Client: {$waiting}");
    }
}
