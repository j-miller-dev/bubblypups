<?php

namespace Database\Seeders;

use App\Models\Dog;
use Illuminate\Database\Seeder;

class DogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dogs = [
            [
                'owner_id' => 1, // Sarah Mitchell
                'name' => 'Buddy',
                'breed' => 'Golden Retriever',
                'age' => 3,
                'weight' => 28.5,
                'notes' => 'Very friendly, loves water. Gets excited around other dogs.'
            ],
            [
                'owner_id' => 2, // James Thompson
                'name' => 'Luna',
                'breed' => 'Border Collie',
                'age' => 2,
                'weight' => 18.2,
                'notes' => 'High energy, very intelligent. Can be nervous with new people.'
            ],
            [
                'owner_id' => 3, // Emily Rodriguez
                'name' => 'Max',
                'breed' => 'French Bulldog',
                'age' => 4,
                'weight' => 12.8,
                'notes' => 'Calm temperament, breathing issues - keep sessions shorter.'
            ],
            [
                'owner_id' => 4, // Michael Chen
                'name' => 'Bella',
                'breed' => 'Labrador',
                'age' => 5,
                'weight' => 25.3,
                'notes' => 'Gentle giant, loves treats. Has arthritis in back legs.'
            ],
            [
                'owner_id' => 5, // Jessica Parker
                'name' => 'Charlie',
                'breed' => 'Poodle',
                'age' => 6,
                'weight' => 15.7,
                'notes' => 'Regular customer, knows the routine. Coat mats easily.'
            ],
            [
                'owner_id' => 6, // David Wilson
                'name' => 'Ruby',
                'breed' => 'Beagle',
                'age' => 1,
                'weight' => 8.9,
                'notes' => 'Puppy - first few grooming sessions. Very curious and playful.'
            ],
            [
                'owner_id' => 7, // Lisa Anderson
                'name' => 'Rocky',
                'breed' => 'German Shepherd',
                'age' => 7,
                'weight' => 35.2,
                'notes' => 'Large dog, protective of owner. Needs confident handling.'
            ],
            [
                'owner_id' => 8, // Robert Taylor
                'name' => 'Daisy',
                'breed' => 'Cavalier King Charles Spaniel',
                'age' => 3,
                'weight' => 7.1,
                'notes' => 'Sweet nature, sensitive ears. Heart condition - avoid stress.'
            ],
            [
                'owner_id' => 9, // Amanda Brown
                'name' => 'Cooper',
                'breed' => 'Australian Cattle Dog',
                'age' => 4,
                'weight' => 22.6,
                'notes' => 'Working breed, very active. Double coat requires special attention.'
            ],
            [
                'owner_id' => 10, // Christopher Lee
                'name' => 'Milo',
                'breed' => 'Jack Russell Terrier',
                'age' => 8,
                'weight' => 6.8,
                'notes' => 'Senior dog, moves slowly. Very patient and well-behaved.'
            ],
            [
                'owner_id' => 1, // Sarah Mitchell (second dog)
                'name' => 'Rosie',
                'breed' => 'Golden Retriever',
                'age' => 1,
                'weight' => 15.2,
                'notes' => 'Buddy\'s little sister. Still learning grooming routine.'
            ],
            [
                'owner_id' => 3, // Emily Rodriguez (second dog)
                'name' => 'Coco',
                'breed' => 'Chihuahua',
                'age' => 5,
                'weight' => 2.8,
                'notes' => 'Very small, can be nippy when scared. Needs gentle handling.'
            ],
            [
                'owner_id' => 4,
                'name' => 'Luna (second dog)',
                'breed' => 'Labrador',
                'age' => 2,
                'weight' => 10.5,
                'notes' => 'Very friendly, loves treats. Needs gentle handling.'
            ],
            [
                'owner_id' => 5,
                'name' => 'Charlie (second dog)',
                'breed' => 'Poodle',
                'age' => 6,
                'weight' => 12.5,
                'notes' => 'Regular customer, knows the routine. Needs gentle handling.'
            ],
        ];

        foreach ($dogs as $dog) {
            Dog::create($dog);
        }
    }
}
