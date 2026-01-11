<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessHours extends Model
{
    use HasFactory;

    protected $fillable = [
        'day_of_week',
        'is_open',
        'open_time',
        'close_time',
        'slot_duration',
    ];

    protected function casts(): array
    {
        return [
            'is_open' => 'boolean',
            'slot_duration' => 'integer',
        ];
    }

    /**
     * Get business hours for a specific day
     */
    public static function getHoursForDay(string $dayOfWeek): ?self
    {
        return self::where('day_of_week', strtolower($dayOfWeek))->first();
    }

    /**
     * Check if business is open on a specific day
     */
    public static function isOpenOn(string $dayOfWeek): bool
    {
        $hours = self::getHoursForDay($dayOfWeek);

        return $hours?->is_open ?? false;
    }
}
