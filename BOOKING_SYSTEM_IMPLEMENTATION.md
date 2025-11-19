# Booking System Implementation Guide

A complete step-by-step guide to build the Bubbly Pups booking system from scratch.

---

## Table of Contents

1. [Database Structure](#1-database-structure)
2. [Models & Relationships](#2-models--relationships)
3. [Authentication System](#3-authentication-system)
4. [New Customer Registration Flow](#4-new-customer-registration-flow)
5. [Existing Customer Login Flow](#5-existing-customer-login-flow)
6. [Timeslot Availability System](#6-timeslot-availability-system)
7. [Appointment Booking Interface](#7-appointment-booking-interface)
8. [Customer Dashboard](#8-customer-dashboard)
9. [Admin Dashboard](#9-admin-dashboard)
10. [Admin Time Blocking](#10-admin-time-blocking)
11. [Notification System](#11-notification-system)
12. [Testing](#12-testing)

---

## 1. Database Structure

### Create Migrations

```bash
php artisan make:migration create_customers_table --no-interaction
php artisan make:migration create_dogs_table --no-interaction
php artisan make:migration create_appointments_table --no-interaction
php artisan make:migration create_blocked_times_table --no-interaction
```

### Customers Table

**File:** `database/migrations/xxxx_create_customers_table.php`

```php
Schema::create('customers', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('phone');
    $table->string('password');
    $table->rememberToken();
    $table->timestamps();
});
```

**Notes:**

- Email must be unique for login
- Phone for SMS notifications
- Password for existing customer login

---

### Dogs Table

**File:** `database/migrations/xxxx_create_dogs_table.php`

```php
Schema::create('dogs', function (Blueprint $table) {
    $table->id();
    $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
    $table->string('name');
    $table->string('breed')->nullable();
    $table->enum('size', ['small', 'medium', 'large'])->default('medium');
    $table->text('special_notes')->nullable();
    $table->timestamps();
});
```

**Notes:**

- Each dog belongs to one customer
- Size affects grooming duration/pricing
- Special notes for allergies, behavior, etc.
- Cascade delete: if customer deleted, their dogs are too

---

### Appointments Table

**File:** `database/migrations/xxxx_create_appointments_table.php`

```php
Schema::create('appointments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('dog_id')->constrained()->cascadeOnDelete();
    $table->date('appointment_date');
    $table->time('appointment_time');
    $table->integer('duration')->default(60); // minutes
    $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
    $table->text('notes')->nullable();
    $table->timestamp('confirmed_at')->nullable();
    $table->timestamps();

    // Prevent double bookings
    $table->unique(['appointment_date', 'appointment_time']);
});
```

**Notes:**

- Status flow: pending → confirmed → completed
- confirmed_at tracks when admin approved
- Unique constraint prevents overlapping bookings at same time
- duration in minutes (adjust per dog size/service)

---

### Blocked Times Table

**File:** `database/migrations/xxxx_create_blocked_times_table.php`

```php
Schema::create('blocked_times', function (Blueprint $table) {
    $table->id();
    $table->dateTime('start_datetime');
    $table->dateTime('end_datetime');
    $table->string('reason')->nullable(); // "Lunch break", "Holiday", etc.
    $table->timestamps();

    // Ensure start is before end
    $table->index(['start_datetime', 'end_datetime']);
});
```

**Notes:**

- Admin can block hours, days, or weeks
- Reason helps admin track why time was blocked
- Index improves availability query performance

---

### Run Migrations

```bash
php artisan migrate
```

---

## 2. Models & Relationships

### Create Models with Factories

```bash
php artisan make:model Customer --factory --no-interaction
php artisan make:model Dog --factory --no-interaction
php artisan make:model Appointment --factory --no-interaction
php artisan make:model BlockedTime --factory --no-interaction
```

---

### Customer Model

**File:** `app/Models/Customer.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Customer extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function dogs(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Dog::class);
    }

    public function appointments(): \Illuminate\Database\Eloquent\Relations\HasManyThrough
    {
        return $this->hasManyThrough(Appointment::class, Dog::class);
    }
}
```

**Notes:**

- Extends `Authenticatable` for login functionality
- `HasMany` relationship to dogs
- `HasManyThrough` to get all appointments through dogs
- Auto-hash password with cast

---

### Dog Model

**File:** `app/Models/Dog.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dog extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'name',
        'breed',
        'size',
        'special_notes',
    ];

    protected function casts(): array
    {
        return [
            'customer_id' => 'integer',
        ];
    }

    public function customer(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function appointments(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Appointment::class);
    }
}
```

**Notes:**

- BelongsTo customer
- HasMany appointments

---

### Appointment Model

**File:** `app/Models/Appointment.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'dog_id',
        'appointment_date',
        'appointment_time',
        'duration',
        'status',
        'notes',
        'confirmed_at',
    ];

    protected function casts(): array
    {
        return [
            'dog_id' => 'integer',
            'appointment_date' => 'date',
            'appointment_time' => 'datetime:H:i',
            'duration' => 'integer',
            'confirmed_at' => 'datetime',
        ];
    }

    public function dog(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Dog::class);
    }

    public function customer(): \Illuminate\Database\Eloquent\Relations\HasOneThrough
    {
        return $this->hasOneThrough(Customer::class, Dog::class, 'id', 'id', 'dog_id', 'customer_id');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('appointment_date', '>=', now()->toDateString())
                    ->orderBy('appointment_date')
                    ->orderBy('appointment_time');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }
}
```

**Notes:**

- BelongsTo dog
- HasOneThrough to get customer
- Scopes for common queries (upcoming, pending, confirmed)
- Cast dates properly for easy manipulation

---

### BlockedTime Model

**File:** `app/Models/BlockedTime.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlockedTime extends Model
{
    use HasFactory;

    protected $fillable = [
        'start_datetime',
        'end_datetime',
        'reason',
    ];

    protected function casts(): array
    {
        return [
            'start_datetime' => 'datetime',
            'end_datetime' => 'datetime',
        ];
    }

    public function scopeActive($query)
    {
        return $query->where('end_datetime', '>=', now());
    }
}
```

**Notes:**

- Simple model for blocking time ranges
- Active scope to get current/future blocks

---

## 3. Authentication System

### Install Laravel Breeze

Laravel Breeze provides authentication scaffolding. We'll use it for the admin User authentication and then create a parallel system for Customer authentication.

```bash
composer require laravel/breeze --dev
php artisan breeze:install react --no-interaction
npm install
npm run build
```

**Notes:**
- Breeze installs authentication for the `User` model (admin access)
- We'll create a parallel customer authentication system using the same patterns
- Breeze gives you working controllers to reference/duplicate for customers

---

### Configure Customer Authentication Guard

**File:** `config/auth.php`

Add a new guard and provider for customers alongside the default `web` guard:

```php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],

    'customer' => [
        'driver' => 'session',
        'provider' => 'customers',
    ],
],

'providers' => [
    'users' => [
        'driver' => 'eloquent',
        'model' => App\Models\User::class,
    ],

    'customers' => [
        'driver' => 'eloquent',
        'model' => App\Models\Customer::class,
    ],
],
```

**Notes:**
- `web` guard = Admin users (installed by Breeze)
- `customer` guard = Customer authentication (you'll build this)
- Allows simultaneous admin/customer sessions
- Use `auth('customer')` in customer controllers

---

### Create Customer Authentication Controllers

Create controllers for customer authentication by duplicating Breeze's auth controllers:

```bash
php artisan make:controller Auth/Customer/RegisteredCustomerController --no-interaction
php artisan make:controller Auth/Customer/AuthenticatedSessionController --no-interaction
```

**Strategy:**
- Reference Breeze's `Auth/RegisteredUserController` when building `RegisteredCustomerController`
- Reference Breeze's `Auth/AuthenticatedSessionController` when building customer login
- Use the same patterns but swap `User` → `Customer` and `auth()` → `auth('customer')`

---

## 4. New Customer Registration Flow

### Create Form Request for Validation

```bash
php artisan make:request StoreCustomerRequest --no-interaction
```

**File:** `app/Http/Requests/StoreCustomerRequest.php`

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:customers,email'],
            'phone' => ['required', 'string', 'max:20'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],

            // Dog information
            'dog_name' => ['required', 'string', 'max:255'],
            'dog_breed' => ['nullable', 'string', 'max:255'],
            'dog_size' => ['required', 'in:small,medium,large'],
            'dog_notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'dog_name.required' => 'Please provide your dog\'s name',
            'dog_size.required' => 'Please select your dog\'s size',
            'dog_size.in' => 'Dog size must be small, medium, or large',
        ];
    }
}
```

**Notes:**

- Collects both customer + dog info in one form
- Password must be confirmed (password_confirmation field)
- Custom error messages for dog fields

---

### Registration Controller

**File:** `app/Http/Controllers/Auth/CustomerRegisterController.php`

```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCustomerRequest;
use App\Models\Customer;
use App\Models\Dog;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomerRegisterController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/CustomerRegister');
    }

    public function store(StoreCustomerRequest $request)
    {
        // Create customer
        $customer = Customer::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => $request->password, // Auto-hashed by cast
        ]);

        // Create their first dog
        $dog = Dog::create([
            'customer_id' => $customer->id,
            'name' => $request->dog_name,
            'breed' => $request->dog_breed,
            'size' => $request->dog_size,
            'special_notes' => $request->dog_notes,
        ]);

        // Log them in
        Auth::guard('customer')->login($customer);

        // Redirect to booking with their new dog
        return redirect()->route('booking.create', ['dog_id' => $dog->id])
            ->with('success', 'Welcome! Let\'s book your first appointment.');
    }
}
```

**Notes:**

- Uses Form Request for validation
- Creates customer, then dog in one transaction (consider DB::transaction())
- Auto-login after registration
- Redirect to booking page with dog pre-selected

---

### Registration Page Component

**File:** `resources/js/Pages/Auth/CustomerRegister.jsx`

```jsx
import {useForm} from '@inertiajs/react';

export default function CustomerRegister() {
    const {data, setData, post, processing, errors} = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        dog_name: '',
        dog_breed: '',
        dog_size: 'medium',
        dog_notes: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('customer.register'));
    }

    return (
        <form onSubmit={submit}>
            <h2>Create Your Account</h2>

            {/* Customer Fields */}
            <input
                type="text"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                placeholder="Your Name"
            />
            {errors.name && <div>{errors.name}</div>}

            {/* ... more customer fields ... */}

            <h2>Tell Us About Your Dog</h2>

            <input
                type="text"
                value={data.dog_name}
                onChange={e => setData('dog_name', e.target.value)}
                placeholder="Dog's Name"
            />
            {errors.dog_name && <div>{errors.dog_name}</div>}

            <select
                value={data.dog_size}
                onChange={e => setData('dog_size', e.target.value)}
            >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
            </select>

            <button type="submit" disabled={processing}>
                Create Account & Book Appointment
            </button>
        </form>
    );
}
```

**Notes:**

- Single form for customer + dog
- Use Inertia's useForm helper
- Show validation errors inline
- Disable submit while processing

---

## 5. Existing Customer Login Flow

### Login Controller

**File:** `app/Http/Controllers/Auth/CustomerLoginController.php`

```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomerLoginController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/CustomerLogin');
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::guard('customer')->attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            return redirect()->intended(route('customer.dashboard'));
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function destroy(Request $request)
    {
        Auth::guard('customer')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }
}
```

**Notes:**

- Uses 'customer' guard
- Remember me functionality
- Redirect to intended page or dashboard
- Logout properly invalidates session

---

## 6. Timeslot Availability System

### Create Service Class

```bash
php artisan make:class Services/AvailabilityService --no-interaction
```

**File:** `app/Services/AvailabilityService.php`

```php
<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\BlockedTime;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class AvailabilityService
{
    // Business hours configuration
    protected array $businessHours = [
        'monday' => ['09:00', '17:00'],
        'tuesday' => ['09:00', '17:00'],
        'wednesday' => ['09:00', '17:00'],
        'thursday' => ['09:00', '17:00'],
        'friday' => ['09:00', '17:00'],
        'saturday' => ['10:00', '14:00'],
        'sunday' => null, // Closed
    ];

    protected int $slotDuration = 60; // minutes

    public function getAvailableSlots(string $date): array
    {
        $day = Carbon::parse($date);

        // Check if business is open this day
        $hours = $this->businessHours[strtolower($day->format('l'))];
        if (!$hours) {
            return [];
        }

        // Generate all possible time slots
        $allSlots = $this->generateTimeSlots($day, $hours[0], $hours[1]);

        // Remove blocked times
        $slotsAfterBlocked = $this->removeBlockedSlots($allSlots, $day);

        // Remove booked appointments
        $availableSlots = $this->removeBookedSlots($slotsAfterBlocked, $day);

        return $availableSlots;
    }

    protected function generateTimeSlots(Carbon $day, string $start, string $end): array
    {
        $slots = [];
        $startTime = Carbon::parse($day->format('Y-m-d') . ' ' . $start);
        $endTime = Carbon::parse($day->format('Y-m-d') . ' ' . $end);

        $current = $startTime->copy();
        while ($current->lt($endTime)) {
            $slots[] = $current->format('H:i');
            $current->addMinutes($this->slotDuration);
        }

        return $slots;
    }

    protected function removeBlockedSlots(array $slots, Carbon $day): array
    {
        $blockedTimes = BlockedTime::query()
            ->where('start_datetime', '<=', $day->endOfDay())
            ->where('end_datetime', '>=', $day->startOfDay())
            ->get();

        if ($blockedTimes->isEmpty()) {
            return $slots;
        }

        return array_filter($slots, function ($slot) use ($day, $blockedTimes) {
            $slotTime = Carbon::parse($day->format('Y-m-d') . ' ' . $slot);

            foreach ($blockedTimes as $blocked) {
                if ($slotTime->between($blocked->start_datetime, $blocked->end_datetime)) {
                    return false;
                }
            }

            return true;
        });
    }

    protected function removeBookedSlots(array $slots, Carbon $day): array
    {
        $bookedSlots = Appointment::query()
            ->where('appointment_date', $day->toDateString())
            ->whereIn('status', ['pending', 'confirmed'])
            ->pluck('appointment_time')
            ->map(fn($time) => Carbon::parse($time)->format('H:i'))
            ->toArray();

        return array_values(array_diff($slots, $bookedSlots));
    }
}
```

**Notes:**

- Configure business hours per day
- Checks blocked times and existing appointments
- Returns only available slots
- Move business hours to config file for easy updates

---

### Alternative: Move Business Hours to Config

**File:** `config/booking.php` (create new file)

```php
<?php

return [
    'business_hours' => [
        'monday' => ['09:00', '17:00'],
        'tuesday' => ['09:00', '17:00'],
        'wednesday' => ['09:00', '17:00'],
        'thursday' => ['09:00', '17:00'],
        'friday' => ['09:00', '17:00'],
        'saturday' => ['10:00', '14:00'],
        'sunday' => null,
    ],

    'slot_duration' => 60, // minutes
    'booking_advance_days' => 60, // How far ahead customers can book
];
```

Then in service: `config('booking.business_hours')`

---

## 7. Appointment Booking Interface

### Create Booking Controller

```bash
php artisan make:controller BookingController --no-interaction
```

**File:** `app/Http/Controllers/BookingController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\Dog;
use App\Services\AvailabilityService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function __construct(
        protected AvailabilityService $availabilityService
    ) {}

    public function create(Request $request)
    {
        $customer = auth('customer')->user();

        // Get customer's dogs
        $dogs = $customer->dogs()->get();

        // Pre-select dog if provided
        $selectedDogId = $request->integer('dog_id') ?? $dogs->first()?->id;

        return Inertia::render('Booking/Create', [
            'dogs' => $dogs,
            'selectedDogId' => $selectedDogId,
        ]);
    }

    public function availableSlots(Request $request)
    {
        $request->validate([
            'date' => ['required', 'date', 'after_or_equal:today'],
        ]);

        $slots = $this->availabilityService->getAvailableSlots($request->date);

        return response()->json(['slots' => $slots]);
    }
}
```

---

### Create Appointment Store Request

```bash
php artisan make:request StoreAppointmentRequest --no-interaction
```

**File:** `app/Http/Requests/StoreAppointmentRequest.php`

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Ensure customer owns this dog
        return $this->user('customer')->dogs()->where('id', $this->dog_id)->exists();
    }

    public function rules(): array
    {
        return [
            'dog_id' => ['required', 'exists:dogs,id'],
            'appointment_date' => ['required', 'date', 'after_or_equal:today'],
            'appointment_time' => ['required', 'date_format:H:i'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
```

---

### Store Appointment Method

Add to `BookingController`:

```php
public function store(StoreAppointmentRequest $request)
{
    $appointment = Appointment::create([
        'dog_id' => $request->dog_id,
        'appointment_date' => $request->appointment_date,
        'appointment_time' => $request->appointment_time,
        'duration' => 60, // Or calculate based on dog size
        'status' => 'pending',
        'notes' => $request->notes,
    ]);

    return redirect()->route('customer.dashboard')
        ->with('success', 'Appointment requested! We\'ll confirm via email/text soon.');
}
```

---

### Booking Page Component

**File:** `resources/js/Pages/Booking/Create.jsx`

```jsx
import {useForm} from '@inertiajs/react';
import {useState, useEffect} from 'react';
import axios from 'axios';

export default function CreateBooking({dogs, selectedDogId}) {
    const [availableSlots, setAvailableSlots] = useState([]);

    const {data, setData, post, processing, errors} = useForm({
        dog_id: selectedDogId,
        appointment_date: '',
        appointment_time: '',
        notes: '',
    });

    // Fetch available slots when date changes
    useEffect(() => {
        if (data.appointment_date) {
            axios.get(route('booking.available-slots', {date: data.appointment_date}))
                .then(response => setAvailableSlots(response.data.slots))
                .catch(() => setAvailableSlots([]));
        }
    }, [data.appointment_date]);

    function submit(e) {
        e.preventDefault();
        post(route('booking.store'));
    }

    return (
        <form onSubmit={submit}>
            <h1>Book an Appointment</h1>

            <select
                value={data.dog_id}
                onChange={e => setData('dog_id', e.target.value)}
            >
                {dogs.map(dog => (
                    <option key={dog.id} value={dog.id}>{dog.name}</option>
                ))}
            </select>

            <input
                type="date"
                value={data.appointment_date}
                onChange={e => setData('appointment_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
            />

            {availableSlots.length > 0 ? (
                <div>
                    <h3>Available Times</h3>
                    {availableSlots.map(slot => (
                        <button
                            key={slot}
                            type="button"
                            onClick={() => setData('appointment_time', slot)}
                            className={data.appointment_time === slot ? 'selected' : ''}
                        >
                            {slot}
                        </button>
                    ))}
                </div>
            ) : data.appointment_date ? (
                <p>No available slots for this date</p>
            ) : null}

            <textarea
                value={data.notes}
                onChange={e => setData('notes', e.target.value)}
                placeholder="Special requests or notes..."
            />

            <button type="submit" disabled={processing}>
                Request Appointment
            </button>
        </form>
    );
}
```

**Notes:**

- Dynamically fetch available slots via API
- Show time slot buttons
- Validate date is in future
- Submit creates pending appointment

---

## 8. Customer Dashboard

### Create Dashboard Controller

```bash
php artisan make:controller Customer/DashboardController --no-interaction
```

**File:** `app/Http/Controllers/Customer/DashboardController.php`

```php
<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $customer = auth('customer')->user();

        return Inertia::render('Customer/Dashboard', [
            'dogs' => $customer->dogs()->get(),
            'upcomingAppointments' => $customer->appointments()
                ->with('dog')
                ->upcoming()
                ->get(),
            'allFutureAppointments' => $customer->appointments()
                ->with('dog')
                ->where('appointment_date', '>=', now()->toDateString())
                ->orderBy('appointment_date')
                ->orderBy('appointment_time')
                ->get(),
        ]);
    }
}
```

---

### Dashboard Component

**File:** `resources/js/Pages/Customer/Dashboard.jsx`

```jsx
export default function CustomerDashboard({dogs, upcomingAppointments, allFutureAppointments}) {
    return (
        <div>
            <h1>My Dashboard</h1>

            <section>
                <h2>My Dogs</h2>
                {dogs.map(dog => (
                    <div key={dog.id}>
                        <h3>{dog.name}</h3>
                        <p>Breed: {dog.breed}</p>
                        <p>Size: {dog.size}</p>
                    </div>
                ))}
            </section>

            <section>
                <h2>Upcoming Appointments (Next 30 Days)</h2>
                {upcomingAppointments.map(apt => (
                    <div key={apt.id}>
                        <p>{apt.dog.name}</p>
                        <p>{apt.appointment_date} at {apt.appointment_time}</p>
                        <span className={`status-${apt.status}`}>{apt.status}</span>
                    </div>
                ))}
            </section>

            <section>
                <h2>All Future Bookings</h2>
                {/* Similar structure */}
            </section>
        </div>
    );
}
```

---

## 9. Admin Dashboard

### Create Admin Appointment Controller

```bash
php artisan make:controller Admin/AppointmentController --no-interaction
```

**File:** `app/Http/Controllers/Admin/AppointmentController.php`

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Notifications\AppointmentConfirmed;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Appointment::query()
            ->with(['dog.customer']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date
        if ($request->has('date')) {
            $query->where('appointment_date', $request->date);
        }

        $appointments = $query->orderBy('appointment_date')
            ->orderBy('appointment_time')
            ->paginate(20);

        return Inertia::render('Admin/Appointments/Index', [
            'appointments' => $appointments,
            'filters' => $request->only(['status', 'date']),
        ]);
    }

    public function confirm(Appointment $appointment)
    {
        $appointment->update([
            'status' => 'confirmed',
            'confirmed_at' => now(),
        ]);

        // Send notification (email + SMS)
        $customer = $appointment->dog->customer;
        $customer->notify(new AppointmentConfirmed($appointment));

        return back()->with('success', 'Appointment confirmed and customer notified!');
    }

    public function cancel(Request $request, Appointment $appointment)
    {
        $appointment->update(['status' => 'cancelled']);

        return back()->with('success', 'Appointment cancelled.');
    }
}
```

---

### Admin Dashboard Component

**File:** `resources/js/Pages/Admin/Appointments/Index.jsx`

```jsx
import {Link, router} from '@inertiajs/react';

export default function AdminAppointments({appointments, filters}) {
    function confirmAppointment(appointmentId) {
        router.post(route('admin.appointments.confirm', appointmentId));
    }

    return (
        <div>
            <h1>Appointment Management</h1>

            {/* Filters */}
            <select onChange={e => router.get(route('admin.appointments.index', {status: e.target.value}))}>
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
            </select>

            {/* Appointments Table */}
            <table>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Customer</th>
                    <th>Dog</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {appointments.data.map(apt => (
                    <tr key={apt.id}>
                        <td>{apt.appointment_date}</td>
                        <td>{apt.appointment_time}</td>
                        <td>{apt.dog.customer.name}</td>
                        <td>{apt.dog.name}</td>
                        <td>{apt.status}</td>
                        <td>
                            {apt.status === 'pending' && (
                                <button onClick={() => confirmAppointment(apt.id)}>
                                    Confirm & Notify
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
```

---

## 10. Admin Time Blocking

### Create BlockedTime Controller

```bash
php artisan make:controller Admin/BlockedTimeController --no-interaction
```

**File:** `app/Http/Controllers/Admin/BlockedTimeController.php`

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlockedTime;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlockedTimeController extends Controller
{
    public function index()
    {
        $blockedTimes = BlockedTime::query()
            ->active()
            ->orderBy('start_datetime')
            ->get();

        return Inertia::render('Admin/BlockedTimes/Index', [
            'blockedTimes' => $blockedTimes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'start_datetime' => ['required', 'date'],
            'end_datetime' => ['required', 'date', 'after:start_datetime'],
            'reason' => ['nullable', 'string', 'max:255'],
        ]);

        BlockedTime::create($validated);

        return back()->with('success', 'Time blocked successfully!');
    }

    public function destroy(BlockedTime $blockedTime)
    {
        $blockedTime->delete();

        return back()->with('success', 'Time block removed.');
    }
}
```

---

### Blocked Times Component

**File:** `resources/js/Pages/Admin/BlockedTimes/Index.jsx`

```jsx
import {useForm} from '@inertiajs/react';

export default function BlockedTimesIndex({blockedTimes}) {
    const {data, setData, post, processing, errors, reset} = useForm({
        start_datetime: '',
        end_datetime: '',
        reason: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('admin.blocked-times.store'), {
            onSuccess: () => reset(),
        });
    }

    return (
        <div>
            <h1>Block Out Times</h1>

            <form onSubmit={submit}>
                <input
                    type="datetime-local"
                    value={data.start_datetime}
                    onChange={e => setData('start_datetime', e.target.value)}
                />

                <input
                    type="datetime-local"
                    value={data.end_datetime}
                    onChange={e => setData('end_datetime', e.target.value)}
                />

                <input
                    type="text"
                    value={data.reason}
                    onChange={e => setData('reason', e.target.value)}
                    placeholder="Reason (e.g., Lunch, Holiday)"
                />

                <button type="submit" disabled={processing}>
                    Block Time
                </button>
            </form>

            <h2>Current Blocks</h2>
            <table>
                <thead>
                <tr>
                    <th>Start</th>
                    <th>End</th>
                    <th>Reason</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {blockedTimes.map(block => (
                    <tr key={block.id}>
                        <td>{block.start_datetime}</td>
                        <td>{block.end_datetime}</td>
                        <td>{block.reason}</td>
                        <td>
                            <button onClick={() => router.delete(route('admin.blocked-times.destroy', block.id))}>
                                Remove
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
```

---

## 11. Notification System

### Create Notification Class

```bash
php artisan make:notification AppointmentConfirmed --no-interaction
```

**File:** `app/Notifications/AppointmentConfirmed.php`

```php
<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AppointmentConfirmed extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Appointment $appointment
    ) {}

    public function via(object $notifiable): array
    {
        // Enable both email and SMS (nexmo/vonage)
        return ['mail', 'vonage'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Appointment Confirmed - Bubbly Pups')
            ->greeting('Hi ' . $notifiable->name . '!')
            ->line('Your grooming appointment has been confirmed.')
            ->line('**Dog:** ' . $this->appointment->dog->name)
            ->line('**Date:** ' . $this->appointment->appointment_date->format('l, F j, Y'))
            ->line('**Time:** ' . $this->appointment->appointment_time->format('g:i A'))
            ->action('View Appointment', route('customer.dashboard'))
            ->line('We look forward to seeing ' . $this->appointment->dog->name . '!');
    }

    public function toVonage(object $notifiable): array
    {
        return [
            'content' => sprintf(
                'Hi %s! Your appointment for %s is confirmed on %s at %s. See you then!',
                $notifiable->name,
                $this->appointment->dog->name,
                $this->appointment->appointment_date->format('M j'),
                $this->appointment->appointment_time->format('g:i A')
            ),
        ];
    }
}
```

---

### Configure SMS Service (Vonage/Twilio)

**Install Vonage:**

```bash
composer require laravel/vonage-notification-channel
```

**Environment Variables (.env):**

```env
VONAGE_SMS_FROM="Bubbly Pups"
VONAGE_KEY=your_key
VONAGE_SECRET=your_secret
```

**Add routeNotificationForVonage to Customer Model:**

```php
// In Customer model
public function routeNotificationForVonage($notification): string
{
    return $this->phone;
}
```

---

### Alternative: Twilio

```bash
composer require twilio/sdk
```

Then use Twilio's API in notification instead of Vonage channel.

---

## 12. Testing

### Create Feature Tests

```bash
php artisan make:test --pest CustomerRegistrationTest --no-interaction
php artisan make:test --pest BookingFlowTest --no-interaction
php artisan make:test --pest AdminAppointmentManagementTest --no-interaction
```

---

### Example: Customer Registration Test

**File:** `tests/Feature/CustomerRegistrationTest.php`

```php
<?php

use App\Models\Customer;
use App\Models\Dog;

it('registers a new customer with dog information', function () {
    $response = $this->post(route('customer.register'), [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'phone' => '555-1234',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'dog_name' => 'Buddy',
        'dog_breed' => 'Golden Retriever',
        'dog_size' => 'large',
        'dog_notes' => 'Loves treats',
    ]);

    expect(Customer::where('email', 'john@example.com')->exists())->toBeTrue();
    expect(Dog::where('name', 'Buddy')->exists())->toBeTrue();

    $response->assertRedirect(route('booking.create'));
    $this->assertAuthenticatedAs(Customer::first(), 'customer');
});

it('validates required fields', function () {
    $response = $this->post(route('customer.register'), []);

    $response->assertSessionHasErrors(['name', 'email', 'password', 'dog_name', 'dog_size']);
});
```

---

### Example: Booking Flow Test

**File:** `tests/Feature/BookingFlowTest.php`

```php
<?php

use App\Models\Customer;
use App\Models\Dog;
use App\Models\Appointment;

it('allows authenticated customer to book an appointment', function () {
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();

    $response = $this->actingAs($customer, 'customer')
        ->post(route('booking.store'), [
            'dog_id' => $dog->id,
            'appointment_date' => now()->addDays(7)->toDateString(),
            'appointment_time' => '10:00',
            'notes' => 'First grooming',
        ]);

    expect(Appointment::where('dog_id', $dog->id)->exists())->toBeTrue();
    $response->assertRedirect(route('customer.dashboard'));
});

it('prevents booking in the past', function () {
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();

    $response = $this->actingAs($customer, 'customer')
        ->post(route('booking.store'), [
            'dog_id' => $dog->id,
            'appointment_date' => now()->subDay()->toDateString(),
            'appointment_time' => '10:00',
        ]);

    $response->assertSessionHasErrors('appointment_date');
});
```

---

### Example: Admin Tests

**File:** `tests/Feature/AdminAppointmentManagementTest.php`

```php
<?php

use App\Models\User;
use App\Models\Appointment;
use App\Models\Customer;
use App\Models\Dog;
use Illuminate\Support\Facades\Notification;
use App\Notifications\AppointmentConfirmed;

it('allows admin to confirm pending appointment', function () {
    Notification::fake();

    $admin = User::factory()->create();
    $customer = Customer::factory()->create();
    $dog = Dog::factory()->for($customer)->create();
    $appointment = Appointment::factory()->for($dog)->create(['status' => 'pending']);

    $response = $this->actingAs($admin)
        ->post(route('admin.appointments.confirm', $appointment));

    $appointment->refresh();
    expect($appointment->status)->toBe('confirmed');
    expect($appointment->confirmed_at)->not->toBeNull();

    Notification::assertSentTo($customer, AppointmentConfirmed::class);
});
```

---

## Routes Summary

**File:** `routes/web.php`

```php
use App\Http\Controllers\Auth\CustomerLoginController;
use App\Http\Controllers\Auth\CustomerRegisterController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\Customer\DashboardController;
use App\Http\Controllers\Admin\AppointmentController;
use App\Http\Controllers\Admin\BlockedTimeController;

// Customer Authentication
Route::get('/register', [CustomerRegisterController::class, 'create'])->name('customer.register.form');
Route::post('/register', [CustomerRegisterController::class, 'store'])->name('customer.register');
Route::get('/login', [CustomerLoginController::class, 'create'])->name('customer.login.form');
Route::post('/login', [CustomerLoginController::class, 'store'])->name('customer.login');
Route::post('/logout', [CustomerLoginController::class, 'destroy'])->name('customer.logout');

// Customer Routes (Protected)
Route::middleware(['auth:customer'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('customer.dashboard');
    Route::get('/booking/create', [BookingController::class, 'create'])->name('booking.create');
    Route::post('/booking', [BookingController::class, 'store'])->name('booking.store');
    Route::get('/booking/available-slots', [BookingController::class, 'availableSlots'])->name('booking.available-slots');
});

// Admin Routes (Protected)
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/appointments', [AppointmentController::class, 'index'])->name('appointments.index');
    Route::post('/appointments/{appointment}/confirm', [AppointmentController::class, 'confirm'])->name('appointments.confirm');
    Route::delete('/appointments/{appointment}', [AppointmentController::class, 'cancel'])->name('appointments.cancel');

    Route::get('/blocked-times', [BlockedTimeController::class, 'index'])->name('blocked-times.index');
    Route::post('/blocked-times', [BlockedTimeController::class, 'store'])->name('blocked-times.store');
    Route::delete('/blocked-times/{blockedTime}', [BlockedTimeController::class, 'destroy'])->name('blocked-times.destroy');
});
```

---

## Additional Recommendations

### 0. **Breeze Admin vs Customer Auth**

After installing Breeze:
- Breeze's default routes (`/login`, `/register`) will be for **admin users** only
- Create separate customer routes: `/customer/register`, `/customer/login`
- Or rename Breeze routes to `/admin/login` and use `/login` for customers
- Admin dashboard (Breeze) uses `auth()` middleware for User model
- Customer dashboard uses `auth:customer` middleware for Customer model

### 1. **Database Transaction for Customer Registration**

Wrap customer + dog creation in a transaction:

```php
DB::transaction(function () use ($request) {
    $customer = Customer::create([...]);
    $dog = Dog::create([...]);
});
```

### 2. **Queue Notifications**

Notifications implement `ShouldQueue` - ensure queue worker is running:

```bash
php artisan queue:work
```

### 3. **Appointment Reminders**

Create a scheduled command to send reminders 24 hours before appointment:

```bash
php artisan make:command SendAppointmentReminders --no-interaction
```

In `routes/console.php`:

```php
Schedule::command('appointments:send-reminders')->daily();
```

### 4. **Calendar View for Admin**

Consider adding a full calendar view using a package like FullCalendar.js to visualize appointments.

### 5. **Multiple Dogs Support**

Allow customers to add more dogs from their dashboard with a "Add Another Dog" button.

### 6. **Cancellation Policy**

Add customer-side cancellation with time limits (e.g., must cancel 24hrs in advance).

### 7. **Services & Pricing**

Extend to support multiple service types (bath, full groom, nail trim) with different durations and prices.

### 8. **Email Verification**

Add email verification for new customers using Laravel's built-in email verification.

---

## Final Checklist

- [ ] Install Laravel Breeze (Section 3)
- [ ] Run migrations (Section 1)
- [ ] Create and configure all models (Section 2)
- [ ] Set up customer authentication guard (Section 3)
- [ ] Build registration flow (customer + dog)
- [ ] Build login/logout flow
- [ ] Implement availability service
- [ ] Create booking interface
- [ ] Build customer dashboard
- [ ] Build admin appointment management
- [ ] Implement time blocking for admin
- [ ] Set up email notifications
- [ ] Configure SMS notifications (Vonage/Twilio)
- [ ] Write feature tests for all flows
- [ ] Run `vendor/bin/pint --dirty` to format code
- [ ] Run tests: `php artisan test`
- [ ] Configure queue worker for notifications
- [ ] Set up appointment reminders (optional)

---

**Good luck with your implementation!** 🐕✨
