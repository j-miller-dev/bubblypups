<?php

namespace App\Services;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\BlockedTime;
use App\Models\BusinessHours;
use App\Models\Service;
use Carbon\Carbon;

class AvailabilityService
{
    // Note: Business hours are now stored in the database (business_hours table)
    // Use BusinessHours model to manage operating hours

    /**
     * @return array<int, string>
     */
    public function getAvailableSlots(string $date, int $serviceId, string $dogSize, ?int $excludeAppointmentId = null): array
    {
        $service = Service::find($serviceId);

        if (! $service) {
            return [];
        }

        $duration = $service->getDurationForSize($dogSize);

        $day = Carbon::parse($date);

        $businessHours = BusinessHours::getHoursForDay($day->format('l'));

        if (! $businessHours || ! $businessHours->is_open) {
            return [];
        }

        $allSlots = $this->generateTimeSlots(
            $day,
            $businessHours->open_time,
            $businessHours->close_time,
            $businessHours->slot_duration
        );

        $existingAppointments = $this->appointmentIntervalsFor($day, $excludeAppointmentId);
        $blockedIntervals = $this->blockedIntervalsFor($day);

        return array_values(array_filter($allSlots, function (string $slot) use ($day, $duration, $businessHours, $existingAppointments, $blockedIntervals) {
            $start = Carbon::parse($day->format('Y-m-d').' '.$slot);
            $end = $start->copy()->addMinutes($duration);
            $close = Carbon::parse($day->format('Y-m-d').' '.$businessHours->close_time);

            if ($end->gt($close)) {
                return false;
            }

            return ! $this->overlapsAny($start, $end, $blockedIntervals)
                && ! $this->overlapsAny($start, $end, $existingAppointments);
        }));
    }

    /**
     * Whether a candidate appointment of the given duration can be booked at $date/$time,
     * accounting for business hours, blocked periods, and overlap with existing appointments.
     */
    public function isRangeAvailable(string $date, string $time, int $durationMinutes, ?int $excludeAppointmentId = null): bool
    {
        $day = Carbon::parse($date);

        $businessHours = BusinessHours::getHoursForDay($day->format('l'));

        if (! $businessHours || ! $businessHours->is_open) {
            return false;
        }

        $start = Carbon::parse($day->format('Y-m-d').' '.$time);
        $end = $start->copy()->addMinutes($durationMinutes);

        $open = Carbon::parse($day->format('Y-m-d').' '.$businessHours->open_time);
        $close = Carbon::parse($day->format('Y-m-d').' '.$businessHours->close_time);

        if ($start->lt($open) || $end->gt($close)) {
            return false;
        }

        if ($open->diffInMinutes($start) % $businessHours->slot_duration !== 0) {
            return false;
        }

        if ($this->overlapsAny($start, $end, $this->blockedIntervalsFor($day))) {
            return false;
        }

        return ! $this->overlapsAny($start, $end, $this->appointmentIntervalsFor($day, $excludeAppointmentId));
    }

    /**
     * Convenience wrapper that resolves the candidate duration from a service + dog size.
     */
    public function isSlotAvailable(string $date, string $time, int $serviceId, string $dogSize, ?int $excludeAppointmentId = null): bool
    {
        $service = Service::find($serviceId);

        if (! $service) {
            return false;
        }

        return $this->isRangeAvailable($date, $time, $service->getDurationForSize($dogSize), $excludeAppointmentId);
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

    /**
     * @return array<int, array{start: Carbon, end: Carbon}>
     */
    protected function blockedIntervalsFor(Carbon $day): array
    {
        return BlockedTime::query()
            ->where('start_datetime', '<=', $day->copy()->endOfDay())
            ->where('end_datetime', '>=', $day->copy()->startOfDay())
            ->get()
            ->map(fn ($blocked) => ['start' => $blocked->start_datetime, 'end' => $blocked->end_datetime])
            ->all();
    }

    /**
     * @return array<int, array{start: Carbon, end: Carbon}>
     */
    protected function appointmentIntervalsFor(Carbon $day, ?int $excludeAppointmentId = null): array
    {
        return Appointment::query()
            ->whereDate('appointment_date', $day->toDateString())
            ->whereIn('status', [AppointmentStatus::Pending, AppointmentStatus::Confirmed, AppointmentStatus::WaitingOnClient])
            ->when($excludeAppointmentId, fn ($query, $id) => $query->where('id', '!=', $id))
            ->get()
            ->map(function (Appointment $appointment) use ($day) {
                $start = Carbon::parse($day->format('Y-m-d').' '.$appointment->appointment_time->format('H:i:s'));

                return ['start' => $start, 'end' => $start->copy()->addMinutes($appointment->duration)];
            })
            ->all();
    }

    /**
     * @param  array<int, array{start: Carbon, end: Carbon}>  $intervals
     */
    protected function overlapsAny(Carbon $start, Carbon $end, array $intervals): bool
    {
        foreach ($intervals as $interval) {
            if ($start->lt($interval['end']) && $end->gt($interval['start'])) {
                return true;
            }
        }

        return false;
    }
}
