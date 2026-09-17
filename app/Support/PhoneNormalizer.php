<?php

namespace App\Support;

class PhoneNormalizer
{
    /**
     * Normalize an Australian phone number to E.164 form (+61XXXXXXXXX).
     * Returns null if the value doesn't look like a valid Australian number.
     */
    public static function normalizeAustralian(?string $raw): ?string
    {
        if ($raw === null || trim($raw) === '') {
            return null;
        }

        $digits = preg_replace('/[^\d+]/', '', $raw);

        if (str_starts_with($digits, '+61')) {
            $national = substr($digits, 3);
        } elseif (str_starts_with($digits, '61') && strlen($digits) === 11) {
            $national = substr($digits, 2);
        } elseif (str_starts_with($digits, '0')) {
            $national = substr($digits, 1);
        } else {
            $national = $digits;
        }

        // Australian numbers: 9-digit national significant number starting
        // with 2, 3, 7, 8 (landline area codes) or 4 (mobile).
        if (! preg_match('/^[23478]\d{8}$/', $national)) {
            return null;
        }

        return '+61'.$national;
    }
}
