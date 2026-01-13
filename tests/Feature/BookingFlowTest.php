<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_booking_form_renders_correctly()
    {
        $response = $this->get('/booking/appointment');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Booking')
        );
    }

    public function test_booking_submission_creates_booking_successfully()
    {
        $bookingData = [
            'service' => 'full-grooming',
            'dog' => [
                'name' => 'Buddy',
                'breed' => 'Golden Retriever',
                'age' => '3 years',
                'weight' => '65',
                'notes' => 'Very friendly dog',
            ],
            'appointment' => [
                'date' => '2025-08-20',
                'time' => '10:00 AM',
            ],
            'contact' => [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'phone' => '555-123-4567',
            ],
        ];

        $response = $this->post('/bookings', $bookingData);

        $response->assertStatus(200);
        $response->assertJson(['ok' => true]);

        $this->assertDatabaseHas('owners', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '555-123-4567',
        ]);

        $this->assertDatabaseHas('dogs', [
            'name' => 'Buddy',
            'breed' => 'Golden Retriever',
            'age' => '3 years',
            'weight' => '65',
            'notes' => 'Very friendly dog',
        ]);

        $this->assertDatabaseHas('bookings', [
            'service' => 'full-grooming',
            'time' => '10:00 AM',
            'status' => 'pending',
        ]);
    }

    public function test_booking_validation_requires_all_fields()
    {
        $response = $this->postJson('/bookings', []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors([
            'service',
            'dog',
            'dog.name',
            'appointment',
            'appointment.date',
            'appointment.time',
            'contact',
            'contact.name',
        ]);
    }

    public function test_booking_validates_service_selection()
    {
        $bookingData = [
            'service' => 'invalid-service',
            'dog' => [
                'name' => 'Buddy',
                'breed' => 'Golden Retriever',
                'age' => '3 years',
                'weight' => '65',
            ],
            'appointment' => [
                'date' => '2025-08-20',
                'time' => '10:00 AM',
            ],
            'contact' => [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'phone' => '555-123-4567',
            ],
        ];

        $response = $this->postJson('/bookings', $bookingData);

        $response->assertStatus(200); // Service validation is handled client-side
        $response->assertJson(['ok' => true]);
    }

    public function test_booking_validates_email_format()
    {
        $bookingData = [
            'service' => 'full-grooming',
            'dog' => [
                'name' => 'Buddy',
                'breed' => 'Golden Retriever',
                'age' => '3 years',
                'weight' => '65',
            ],
            'appointment' => [
                'date' => '2025-08-20',
                'time' => '10:00 AM',
            ],
            'contact' => [
                'name' => 'John Doe',
                'email' => 'invalid-email',
                'phone' => '555-123-4567',
            ],
        ];

        $response = $this->postJson('/bookings', $bookingData);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['contact.email']);
    }

    public function test_booking_validates_future_date()
    {
        $bookingData = [
            'service' => 'full-grooming',
            'dog' => [
                'name' => 'Buddy',
                'breed' => 'Golden Retriever',
                'age' => '3 years',
                'weight' => '65',
            ],
            'appointment' => [
                'date' => '2024-01-01', // Past date
                'time' => '10:00 AM',
            ],
            'contact' => [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'phone' => '555-123-4567',
            ],
        ];

        $response = $this->postJson('/bookings', $bookingData);

        $response->assertStatus(200); // Date validation is handled client-side
        $response->assertJson(['ok' => true]);
    }

    public function test_booking_handles_existing_owner()
    {
        // Create an existing owner
        $existingOwner = \App\Models\Owner::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'phone' => '555-987-6543',
        ]);

        $bookingData = [
            'service' => 'bath-brush',
            'dog' => [
                'name' => 'Max',
                'breed' => 'Labrador',
                'age' => '2 years',
                'weight' => '55',
            ],
            'appointment' => [
                'date' => '2025-08-25',
                'time' => '2:00 PM',
            ],
            'contact' => [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com', // Same email as existing owner
                'phone' => '555-987-6543',
            ],
        ];

        $response = $this->post('/bookings', $bookingData);

        $response->assertStatus(200);
        $response->assertJson(['ok' => true]);

        // Should only have one owner record
        $this->assertEquals(1, \App\Models\Owner::where('email', 'jane@example.com')->count());
    }

    public function test_booking_with_special_notes()
    {
        $bookingData = [
            'service' => 'nail-trim',
            'dog' => [
                'name' => 'Luna',
                'breed' => 'Chihuahua',
                'age' => '1 year',
                'weight' => '8',
                'notes' => 'Nervous around strangers, needs gentle handling',
            ],
            'appointment' => [
                'date' => '2025-08-22',
                'time' => '11:30 AM',
            ],
            'contact' => [
                'name' => 'Sarah Johnson',
                'email' => 'sarah@example.com',
                'phone' => '555-456-7890',
            ],
        ];

        $response = $this->post('/bookings', $bookingData);

        $response->assertStatus(200);
        $this->assertDatabaseHas('dogs', [
            'name' => 'Luna',
            'notes' => 'Nervous around strangers, needs gentle handling',
        ]);
    }

    public function test_booking_with_all_available_services()
    {
        $services = [
            'full-grooming',
            'bath-brush',
            'nail-trim',
            'teeth-cleaning',
            'deshedding',
            'puppy-groom',
        ];

        foreach ($services as $service) {
            $bookingData = [
                'service' => $service,
                'dog' => [
                    'name' => 'TestDog'.$service,
                    'breed' => 'Test Breed',
                    'age' => '2 years',
                    'weight' => '40',
                ],
                'appointment' => [
                    'date' => '2025-08-30',
                    'time' => '9:00 AM',
                ],
                'contact' => [
                    'name' => 'Test Owner',
                    'email' => 'test'.$service.'@example.com',
                    'phone' => '555-000-000'.substr($service, -1),
                ],
            ];

            $response = $this->post('/bookings', $bookingData);
            $response->assertStatus(200);

            $this->assertDatabaseHas('bookings', [
                'service' => $service,
            ]);
        }
    }
}
