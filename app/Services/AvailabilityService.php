<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\BlockedTime;
use App\Models\BusinessHours;
use Carbon\Carbon;

class AvailabilityService
{
    // Note: Business hours are now stored in the database (business_hours table)
    // Use BusinessHours model to manage operating hours

    public function getAvailableSlots(string $date, ?int $excludeAppointmentId = null): array
    {
        $day = Carbon::parse($date);

        // Get business hours from database
        $businessHours = BusinessHours::getHoursForDay($day->format('l'));

        // Check if business is open this day
        if (! $businessHours || ! $businessHours->is_open) {
            return [];
        }

        // Generate all possible time slots using database values
        $allSlots = $this->generateTimeSlots(
            $day,
            $businessHours->open_time,
            $businessHours->close_time,
            $businessHours->slot_duration
        );

        // Remove blocked times
        $slotsAfterBlocked = $this->removeBlockedSlots($allSlots, $day);

        // Remove booked appointments
        $availableSlots = $this->removeBookedSlots($slotsAfterBlocked, $day, $excludeAppointmentId);

        return $availableSlots;
    }

    protected function generateTimeSlots(Carbon $day, string $start, string $end, int $slotDuration = 30): array
    {
        $slots = [];
        $startTime = Carbon::parse($day->format('Y-m-d').' '.$start);
        $endTime = Carbon::parse($day->format('Y-m-d').' '.$end);

        $current = $startTime->copy();
        while ($current->lt($endTime)) {
            $slots[] = $current->format('H:i');
            $current->addMinutes($slotDuration);
        }

        return $slots;
    }

    protected function removeBlockedSlots(array $slots, Carbon $day): array
    {
        $blockedTimes = BlockedTime::query()
            ->where('start_datetime', '<=', $day->copy()->endOfDay())
            ->where('end_datetime', '>=', $day->copy()->startOfDay())
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

    protected function removeBookedSlots(array $slots, Carbon $day, ?int $excludeAppointmentId = null): array
    {
        $bookedSlots = Appointment::query()
            ->whereDate('appointment_date', $day->toDateString())
            ->whereIn('status', ['pending', 'confirmed', 'waiting_on_client'])
            ->when($excludeAppointmentId, fn ($query, $id) => $query->where('id', '!=', $id))
            ->pluck('appointment_time')
            ->map(fn ($time) => Carbon::parse($time)->format('H:i'))
            ->toArray();

        return array_values(array_diff($slots, $bookedSlots));
    }
}
