<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::factory()->create([
            'name' => 'Clarissa Admin',
            'email' => 'admin@bubblypups.com',
        ]);

        $this->call([
            BusinessHoursSeeder::class,
            ServiceSeeder::class,
            TestDataSeeder::class,
            BlogPostSeeder::class,
        ]);
    }
}
