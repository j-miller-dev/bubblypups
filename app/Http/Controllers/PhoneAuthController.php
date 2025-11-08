<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Twilio\Rest\Client;

class PhoneAuthController extends Controller
{
    public function sendOTP(Request $request)
    {
        $request->validate(['phone' => 'required|string']);

        $phone = $request->phone;
        $otp = rand(100000, 999999);

        // Store OTP
        Cache::put("otp_{$phone}", $otp, 300); // 5 minutes

        // Send via Twilio
        try {
            $twilio = new Client(env('TWILIO_SID'), env('TWILIO_TOKEN'));
            $twilio->messages->create($phone, [
                'from' => env('TWILIO_PHONE'),
                'body' => "Your Dog Grooming verification code: {$otp}",
            ]);

            return response()->json(['message' => 'OTP sent successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to send OTP'], 500);
        }
    }

    public function verifyOTP(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'otp' => 'required|string',
        ]);

        $phone = $request->phone;
        $otp = $request->otp;
        $storedOTP = Cache::get("otp_{$phone}");

        if ($otp === $storedOTP) {
            $user = User::firstOrCreate(['phone' => $phone], [
                'name' => 'Phone User',
                'phone_verified_at' => now(),
            ]);

            // Link or create Owner by phone
            $owner = \App\Models\Owner::query()
                ->where('phone', $phone)
                ->orWhere('email', $user->email)
                ->first();

            if (! $owner) {
                $owner = \App\Models\Owner::create([
                    'name' => $user->name ?? 'Customer',
                    'email' => $user->email,
                    'phone' => $phone,
                    'user_id' => $user->id,
                ]);
            } else {
                $owner->update([
                    'name' => $owner->name ?: ($user->name ?? 'Customer'),
                    'email' => $owner->email ?: $user->email,
                    'phone' => $owner->phone ?: $phone,
                    'user_id' => $user->id,
                ]);
            }

            $token = $user->createToken('auth-token')->plainTextToken;
            Cache::forget("otp_{$phone}");

            return response()->json([
                'token' => $token,
                'user' => $user,
            ]);
        }

        return response()->json(['error' => 'Invalid OTP'], 400);
    }
}
