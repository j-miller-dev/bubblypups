<?php

return [
    'phone' => env('BUSINESS_PHONE', '+61400000000'),
    'phone_display' => env('BUSINESS_PHONE_DISPLAY', '0400 000 000'),

    // Left null until a real account exists — the frontend hides Instagram
    // links/CTAs entirely rather than showing a placeholder.
    'instagram_url' => env('BUSINESS_INSTAGRAM_URL'),
];
