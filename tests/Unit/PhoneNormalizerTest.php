<?php

use App\Support\PhoneNormalizer;

test('normalizes a local-format mobile number', function () {
    expect(PhoneNormalizer::normalizeAustralian('0412 345 678'))->toBe('+61412345678');
});

test('normalizes a local-format landline number', function () {
    expect(PhoneNormalizer::normalizeAustralian('(03) 9123 4567'))->toBe('+61391234567');
});

test('normalizes a number already in E.164 form', function () {
    expect(PhoneNormalizer::normalizeAustralian('+61412345678'))->toBe('+61412345678');
});

test('normalizes a number with the country code but no plus', function () {
    expect(PhoneNormalizer::normalizeAustralian('61412345678'))->toBe('+61412345678');
});

test('rejects a number that is too short', function () {
    expect(PhoneNormalizer::normalizeAustralian('0412345'))->toBeNull();
});

test('rejects a non-Australian trunk digit', function () {
    expect(PhoneNormalizer::normalizeAustralian('0512345678'))->toBeNull();
});

test('rejects an empty or null value', function () {
    expect(PhoneNormalizer::normalizeAustralian(''))->toBeNull();
    expect(PhoneNormalizer::normalizeAustralian(null))->toBeNull();
});

test('rejects a US-format phone number', function () {
    expect(PhoneNormalizer::normalizeAustralian('555-123-4567'))->toBeNull();
});
