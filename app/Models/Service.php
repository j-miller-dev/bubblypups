<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'emoji',
        'base_price',
        'duration_minutes',
        'pricing_tiers',
        'duration_tiers',
    ];

    protected function casts(): array
    {
        return [
            'base_price' => 'decimal:2',
            'duration_minutes' => 'integer',
            'pricing_tiers' => 'array',
            'duration_tiers' => 'array',
        ];
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    /**
     * Get the price for a specific dog size.
     */
    public function getPriceForSize(string $size): float
    {
        return $this->pricing_tiers[$size] ?? $this->base_price;
    }

    /**
     * Get the appointment duration (in minutes) for a specific dog size.
     */
    public function getDurationForSize(string $size): int
    {
        return $this->duration_tiers[$size] ?? $this->duration_minutes;
    }

    /**
     * Proportionally scale a base duration into small/medium/large tiers.
     * Used to backfill/seed duration_tiers when only a flat duration is known.
     * Rounded to the nearest 5 minutes, with a 10-minute floor.
     *
     * @return array<string, int>
     */
    public static function defaultDurationTiers(int $baseDurationMinutes): array
    {
        $round = fn (float $minutes) => max(10, (int) (round($minutes / 5) * 5));

        return [
            'small' => $round($baseDurationMinutes * 0.8),
            'medium' => $baseDurationMinutes,
            'large' => $round($baseDurationMinutes * 1.3),
        ];
    }
}
