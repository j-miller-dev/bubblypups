<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Models\Contact;
use App\Models\User;
use App\Notifications\NewContactNotification;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function store(StoreContactRequest $request)
    {
        $data = $request->validated();

        $contact = Contact::create($data);

        Log::info('[Bubbly Pups] Contact form received', $data);

        try {
            User::all()->each(fn ($admin) => $admin->notify(new NewContactNotification($contact)));
        } catch (\Exception $e) {
            Log::error('Failed to send contact notification', ['error' => $e->getMessage()]);
        }

        return redirect()->route('contact');
    }
}
