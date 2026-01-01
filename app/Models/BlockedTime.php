<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property \Illuminate\Support\Carbon $start_datetime
 * @property \Illuminate\Support\Carbon $end_datetime
 * @property string|null $reason
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BlockedTime active()
 * @method static \Database\Factories\BlockedTimeFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BlockedTime newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BlockedTime newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BlockedTime query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BlockedTime whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BlockedTime whereEndDatetime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BlockedTime whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BlockedTime whereReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BlockedTime whereStartDatetime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BlockedTime whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class BlockedTime extends Model
{
    use HasFactory;

    protected $fillable = [
        'start_datetime',
        'end_datetime',
        'where',
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
