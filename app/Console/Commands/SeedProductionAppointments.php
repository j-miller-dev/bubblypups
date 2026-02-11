<?php

namespace App\Console\Commands;

use App\Models\Appointment;
use App\Models\Customer;
use App\Models\Dog;
use App\Models\Service;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class SeedProductionAppointments extends Command
{
    protected $signature = 'app:seed-appointments {--count=20 : Number of appointments to create}';

    protected $description = 'Seed fake customers, dogs, and appointments for production testing';

    private array $dogNames = ['Bella', 'Max', 'Luna', 'Charlie', 'Lucy', 'Cooper', 'Daisy', 'Buddy', 'Sadie', 'Rocky', 'Molly', 'Tucker', 'Bailey', 'Maggie', 'Bear', 'Sophie', 'Duke', 'Chloe', 'Jack', 'Penny'];

    private array $dogBreeds = ['Labrador Retriever', 'Golden Retriever', 'German Shepherd', 'Poodle', 'Bulldog', 'Beagle', 'Rottweiler', 'Yorkshire Terrier', 'Boxer', 'Dachshund', 'Shih Tzu', 'Siberian Husky', 'Cavalier King Charles', 'Border Collie', 'Australian Shepherd'];

    private array $customerNames = ['Sarah Johnson', 'Michael Chen', 'Emily Davis', 'James Wilson', 'Jessica Brown', 'David Lee', 'Amanda Martinez', 'Christopher Taylor', 'Ashley Anderson', 'Matthew Thomas', 'Stephanie Garcia', 'Daniel White', 'Nicole Robinson', 'Andrew Clark', 'Megan Lewis'];

    private array $sizes = ['small', 'medium', 'large'];

    private array $statuses = ['pending', 'confirmed', 'completed'];

    private array $times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];

    public function handle(): int
    {
        $count = (int) $this->option('count');

        $services = Service::all();
        if ($services->isEmpty()) {
            $this->error('No services found. Please seed services first.');
            return 1;
        }

        $this->info("Creating {$count} appointments...");

        $bar = $this->output->createProgressBar($count);
        $bar->start();

        for ($i = 0; $i < $count; $i++) {
            $customer = $this->createCustomer();
            $dog = $this->createDog($customer);
            $this->createAppointment($dog, $services->random());
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Successfully created {$count} appointments with customers and dogs.");

        return 0;
    }

    private function createCustomer(): Customer
    {
        $name = $this->customerNames[array_rand($this->customerNames)];
        $email = strtolower(str_replace(' ', '.', $name)) . rand(100, 999) . '@example.com';

        return Customer::create([
            'name' => $name,
            'email' => $email,
            'phone' => '04' . rand(10000000, 99999999),
            'password' => Hash::make('password'),
        ]);
    }

    private function createDog(Customer $customer): Dog
    {
        return Dog::create([
            'customer_id' => $customer->id,
            'name' => $this->dogNames[array_rand($this->dogNames)],
            'breed' => $this->dogBreeds[array_rand($this->dogBreeds)],
            'size' => $this->sizes[array_rand($this->sizes)],
            'special_notes' => rand(0, 1) ? 'Friendly with other dogs' : null,
        ]);
    }

    private function createAppointment(Dog $dog, Service $service): Appointment
    {
        $date = Carbon::now()->addDays(rand(1, 30));
        $status = $this->statuses[array_rand($this->statuses)];

        return Appointment::create([
            'customer_id' => $dog->customer_id,
            'dog_id' => $dog->id,
            'service_id' => $service->id,
            'appointment_date' => $date->toDateString(),
            'appointment_time' => $this->times[array_rand($this->times)],
            'duration' => $service->duration_minutes,
            'status' => $status,
            'confirmed_at' => $status === 'confirmed' ? now() : null,
        ]);
    }
}
