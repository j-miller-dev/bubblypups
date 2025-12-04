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
