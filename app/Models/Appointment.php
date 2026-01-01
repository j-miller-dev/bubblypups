<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

/**
 * @property int $id
 * @property int $dog_id
 * @property int $customer_id
 * @property \Illuminate\Support\Carbon $appointment_date
 * @property \Illuminate\Support\Carbon $appointment_time
 * @property int $duration
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $confirmed_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $status
 * @property-read \App\Models\Customer|null $customer
 * @property-read \App\Models\Dog $dog
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment confirmed()
 * @method static \Database\Factories\AppointmentFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment pending()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment upcoming()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment whereAppointmentDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment whereAppointmentTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment whereConfirmedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment whereCustomerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment whereDogId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment whereDuration($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
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
