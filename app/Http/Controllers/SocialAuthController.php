<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    public function redirect($provider)
    {
        $redirectUrl = Socialite::driver($provider)->redirect()->getTargetUrl();

        return response()->json(['redirect_url' => $redirectUrl]);
    }

    public function callback($provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->user();

            $user = User::updateOrCreate([
                $provider.'_id' => $socialUser->id,
            ], [
                'name' => $socialUser->name,
                'email' => $socialUser->email,
                'provider' => $provider,
                'email_verified_at' => now(),
            ]);

            // Link or create Owner by email
            $owner = \App\Models\Owner::where('email', $user->email)->first();
            if (! $owner) {
                \App\Models\Owner::create([
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'user_id' => $user->id,
                ]);
            } else {
                $owner->update([
                    'name' => $user->name ?: $owner->name,
                    'phone' => $owner->phone ?: $user->phone,
                    'user_id' => $user->id,
                ]);
            }

            $token = $user->createToken('auth-token')->plainTextToken;

            // Redirect to frontend with token
            return redirect(env('FRONTEND_URL').'/auth/callback?token='.$token);

        } catch (\Exception $e) {
            return redirect(env('FRONTEND_URL').'/auth/error');
        }
    }
}
