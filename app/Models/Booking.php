<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id', 'dog_id', 'service', 'date', 'time', 'status', 'notes',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(Owner::class);
    }

    public function dog(): BelongsTo
    {
        return $this->belongsTo(Dog::class);
    }
}
