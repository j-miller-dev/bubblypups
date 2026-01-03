<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $customer_id
 * @property string $name
 * @property string|null $breed
 * @property string $size
 * @property string|null $special_notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Appointment> $appointments
 * @property-read int|null $appointments_count
 * @property-read \App\Models\Customer $customer
 *
 * @method static \Database\Factories\DogFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dog query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dog whereBreed($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dog whereCustomerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dog whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dog whereSize($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dog whereSpecialNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dog whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class Dog extends Model
{
    /** @use HasFactory<\Database\Factories\DogFactory> */
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'name',
        'breed',
        'photo_url',
        'size',
        'special_notes',
    ];

    protected function casts(): array
    {
        return [
            'customer_id' => 'integer',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }
}
