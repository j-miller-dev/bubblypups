<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\BlockedTime;
use Carbon\Carbon;

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
        if (! $hours) {
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
        $startTime = Carbon::parse($day->format('Y-m-d').' '.$start);
        $endTime = Carbon::parse($day->format('Y-m-d').' '.$end);

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
            $slotTime = Carbon::parse($day->format('Y-m-d').' '.$slot);

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
            ->map(fn ($time) => Carbon::parse($time)->format('H:i'))
            ->toArray();

        return array_values(array_diff($slots, $bookedSlots));
    }
}
