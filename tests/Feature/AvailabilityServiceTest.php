<?php

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\BlockedTime;
use App\Models\BusinessHours;
use App\Models\Customer;
use App\Models\Dog;
use App\Models\Service;
use App\Services\AvailabilityService;
use Carbon\Carbon;

beforeEach(function () {
    $this->testDate = Carbon::parse('next thursday')->format('Y-m-d');

    BusinessHours::create([
        'day_of_week' => 'thursday',
        'is_open' => true,
        'open_time' => '09:00',
        'close_time' => '17:00',
        'slot_duration' => 30,
    ]);

    $this->availability = app(AvailabilityService::class);

    $this->createAppointment = function (string $date, string $time, int $duration, AppointmentStatus $status = AppointmentStatus::Confirmed): Appointment {
        $customer = Customer::factory()->create();
        $dog = Dog::factory()->for($customer)->create();

        return Appointment::factory()->create([
            'customer_id' => $customer->id,
            'dog_id' => $dog->id,
            'appointment_date' => $date,
            'appointment_time' => $time,
            'duration' => $duration,
            'status' => $status,
        ]);
    };
});

test('a candidate slot starting during an existing appointment is rejected', function () {
    ($this->createAppointment)($this->testDate, '10:00', 90); // occupies 10:00-11:30

    expect($this->availability->isRangeAvailable($this->testDate, '10:30', 30))->toBeFalse();
});

test('a candidate slot starting before and ending during an existing appointment is rejected', function () {
    ($this->createAppointment)($this->testDate, '10:00', 90); // occupies 10:00-11:30

    expect($this->availability->isRangeAvailable($this->testDate, '09:30', 60))->toBeFalse();
});

test('a candidate slot starting after an existing appointment ends is accepted', function () {
    ($this->createAppointment)($this->testDate, '10:00', 90); // occupies 10:00-11:30

    expect($this->availability->isRangeAvailable($this->testDate, '11:30', 30))->toBeTrue();
});

test('a candidate slot that would finish after closing time is rejected', function () {
    expect($this->availability->isRangeAvailable($this->testDate, '16:45', 30))->toBeFalse();
});

test('getAvailableSlots excludes every slot a longer appointment overlaps', function () {
    $service = Service::factory()->create(['duration_minutes' => 30]);
    ($this->createAppointment)($this->testDate, '10:00', 90); // occupies 10:00-11:30

    $slots = $this->availability->getAvailableSlots($this->testDate, $service->id);

    expect($slots)->not->toContain('10:00')
        ->not->toContain('10:30')
        ->not->toContain('11:00')
        ->toContain('11:30');
});

test('a cancelled appointment frees its slot for reuse', function () {
    $service = Service::factory()->create(['duration_minutes' => 30]);
    $appointment = ($this->createAppointment)($this->testDate, '10:00', 30, AppointmentStatus::Confirmed);

    expect($this->availability->getAvailableSlots($this->testDate, $service->id))->not->toContain('10:00');

    $appointment->update(['status' => AppointmentStatus::Cancelled]);

    expect($this->availability->getAvailableSlots($this->testDate, $service->id))->toContain('10:00');
});

test('a candidate slot overlapping a blocked period is rejected regardless of duration', function () {
    BlockedTime::create([
        'start_datetime' => $this->testDate.' 12:00:00',
        'end_datetime' => $this->testDate.' 13:00:00',
        'reason' => 'Lunch',
    ]);

    expect($this->availability->isRangeAvailable($this->testDate, '11:45', 30))->toBeFalse();
    expect($this->availability->isRangeAvailable($this->testDate, '13:00', 30))->toBeTrue();
});
