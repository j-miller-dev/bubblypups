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
    ];

    protected function casts(): array
    {
        return [
            'base_price' => 'decimal:2',
            'duration_minutes' => 'integer',
            'pricing_tiers' => 'array',
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
}
