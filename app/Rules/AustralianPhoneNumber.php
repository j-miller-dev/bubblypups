<?php

namespace App\Rules;

use App\Support\PhoneNormalizer;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AustralianPhoneNumber implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || PhoneNormalizer::normalizeAustralian($value) === null) {
            $fail('The :attribute must be a valid Australian phone number.');
        }
    }
}
