<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class Appointment extends Model
{
    /** @use HasFactory<\Database\Factories\AppointmentFactory> */
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'dog_id',
        'appointment_date',
        'appointment_time',
        'status',
        'duration',
        'notes',
        'confirmed_at',
    ];

    public function casts(): array
    {
        return [
            'dog_id' => 'integer',
            'appointment_date' => 'date',
            'appointment_time' => 'datetime:H:i',
            'duration' => 'integer',
            'confirmed_at' => 'datetime',
        ];
    }

    public function dog(): BelongsTo
    {
        return $this->belongsTo(Dog::class);
    }

    public function customer(): HasOneThrough
    {
        return $this->HasOneThrough(Customer::class, Dog::class, 'id', 'id', 'dog_id', 'customer_id');
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
