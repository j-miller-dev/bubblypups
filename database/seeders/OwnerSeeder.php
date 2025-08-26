<?php

namespace Database\Seeders;

use App\Models\Owner;
use Illuminate\Database\Seeder;

class OwnerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $owners = [
            [
                'name' => 'Sarah Mitchell',
                'email' => 'sarah.mitchell@email.com',
                'phone' => '0412 345 678',
                'address' => '123 Main Street, Sunbury VIC 3429'
            ],
            [
                'name' => 'James Thompson',
                'email' => 'james.thompson@email.com', 
                'phone' => '0423 456 789',
                'address' => '45 Oak Avenue, Diggers Rest VIC 3427'
            ],
            [
                'name' => 'Emily Rodriguez',
                'email' => 'emily.rodriguez@email.com',
                'phone' => '0434 567 890',
                'address' => '78 Pine Road, Sunbury VIC 3429'
            ],
            [
                'name' => 'Michael Chen',
                'email' => 'michael.chen@email.com',
                'phone' => '0445 678 901',
                'address' => '92 Elm Street, Fraser Rise VIC 3336'
            ],
            [
                'name' => 'Jessica Parker',
                'email' => 'jessica.parker@email.com',
                'phone' => '0456 789 012',
                'address' => '156 Birch Lane, Sunbury VIC 3429'
            ],
            [
                'name' => 'David Wilson',
                'email' => 'david.wilson@email.com',
                'phone' => '0467 890 123',
                'address' => '234 Cedar Court, Sunbury VIC 3429'
            ],
            [
                'name' => 'Lisa Anderson',
                'email' => 'lisa.anderson@email.com',
                'phone' => '0478 901 234',
                'address' => '67 Maple Drive, Diggers Rest VIC 3427'
            ],
            [
                'name' => 'Robert Taylor',
                'email' => 'robert.taylor@email.com',
                'phone' => '0489 012 345',
                'address' => '189 Willow Way, Fraser Rise VIC 3336'
            ],
            [
                'name' => 'Amanda Brown',
                'email' => 'amanda.brown@email.com',
                'phone' => '0490 123 456',
                'address' => '312 Ash Avenue, Sunbury VIC 3429'
            ],
            [
                'name' => 'Christopher Lee',
                'email' => 'christopher.lee@email.com',
                'phone' => '0401 234 567',
                'address' => '445 Poplar Place, Sunbury VIC 3429'
            ]
        ];

        foreach ($owners as $owner) {
            Owner::create($owner);
        }
    }
}
