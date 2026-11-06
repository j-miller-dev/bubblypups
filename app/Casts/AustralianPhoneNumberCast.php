<?php

namespace App\Casts;

use App\Support\PhoneNormalizer;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * @implements CastsAttributes<string, string>
 */
class AustralianPhoneNumberCast implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        return $value;
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        // Validation (App\Rules\AustralianPhoneNumber) is responsible for rejecting
        // bad input before it gets here. If normalization fails anyway (e.g. legacy
        // or test-factory data that predates this rule), store the raw value rather
        // than silently dropping it or throwing.
        return PhoneNormalizer::normalizeAustralian($value) ?? $value;
    }
}
