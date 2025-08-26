<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'name' => 'Full doggy pamper',
                'description' => 'Complete spa experience with bath, haircut, nail trimming, ear cleaning, and relaxing treatment. Perfect for all breeds.',
                'emoji' => '🐕‍🦺',
                'base_price' => 65.00,
                'duration_minutes' => 120,
                'pricing_tiers' => [
                    'small' => 55.00,  // Under 10kg
                    'medium' => 65.00, // 10-25kg  
                    'large' => 85.00,  // 25-40kg
                    'extra_large' => 105.00 // Over 40kg
                ]
            ],
            [
                'name' => 'Cut and clipping',
                'description' => 'Professional grooming and styling service with precision cuts and clipping to keep your pup looking their best.',
                'emoji' => '✂️',
                'base_price' => 35.00,
                'duration_minutes' => 60,
                'pricing_tiers' => [
                    'small' => 30.00,
                    'medium' => 35.00,
                    'large' => 45.00,
                    'extra_large' => 55.00
                ]
            ],
            [
                'name' => 'Deep wash',
                'description' => 'Thorough cleaning with premium shampoo, conditioning treatment, and blow dry for a fresh, healthy coat.',
                'emoji' => '🛁',
                'base_price' => 28.00,
                'duration_minutes' => 45,
                'pricing_tiers' => [
                    'small' => 25.00,
                    'medium' => 28.00,
                    'large' => 35.00,
                    'extra_large' => 42.00
                ]
            ],
            [
                'name' => 'Teeth and nails',
                'description' => 'Essential hygiene care including professional nail trimming and dental cleaning for your dog\'s health.',
                'emoji' => '🦷',
                'base_price' => 22.00,
                'duration_minutes' => 30,
                'pricing_tiers' => [
                    'small' => 20.00,
                    'medium' => 22.00,
                    'large' => 25.00,
                    'extra_large' => 28.00
                ]
            ],
            [
                'name' => 'Nail trim only',
                'description' => 'Quick and professional nail trimming service to keep your dog comfortable.',
                'emoji' => '💅',
                'base_price' => 15.00,
                'duration_minutes' => 15,
                'pricing_tiers' => [
                    'small' => 12.00,
                    'medium' => 15.00,
                    'large' => 18.00,
                    'extra_large' => 20.00
                ]
            ],
            [
                'name' => 'De-shedding treatment',
                'description' => 'Specialized treatment to reduce shedding and keep your home cleaner. Perfect for heavy shedding breeds.',
                'emoji' => '🌪️',
                'base_price' => 40.00,
                'duration_minutes' => 75,
                'pricing_tiers' => [
                    'small' => 35.00,
                    'medium' => 40.00,
                    'large' => 50.00,
                    'extra_large' => 60.00
                ]
            ]
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
