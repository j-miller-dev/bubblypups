<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BusinessHours;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BusinessHoursController extends Controller
{
    // Show the availability management page
    // This loads all business hours from the database and sends them to the frontend
    public function index()
    {
        // Get all business hours from database, ordered by day of week
        $businessHours = BusinessHours::query()
            ->orderByRaw("CASE day_of_week
                WHEN 'monday' THEN 1
                WHEN 'tuesday' THEN 2
                WHEN 'wednesday' THEN 3
                WHEN 'thursday' THEN 4
                WHEN 'friday' THEN 5
                WHEN 'saturday' THEN 6
                WHEN 'sunday' THEN 7
            END")
            ->get();

        // Get all blocked times (future and active)
        $blockedTimes = \App\Models\BlockedTime::query()
            ->where('end_datetime', '>=', now())
            ->orderBy('start_datetime')
            ->get();

        // Send data to the react page
        return Inertia::render('Dashboard/Availability', [
            'businessHours' => $businessHours,
            'blockedTimes' => $blockedTimes,
        ]);
    }

    // Update business hours for a specific day (this saves the admin's changes to the DB)
    public function update(Request $request, BusinessHours $businessHours)
    {
        // validate the incoming data
        $validated = $request->validate([
            'is_open' => ['required', 'boolean'],
            'open_time' => ['nullable', 'required_if:is_open,true', 'date_format:H:i'],
            'close_time' => ['nullable', 'required_if:is_open,true', 'date_format:H:i'],
            'slot_duration' => ['required', 'integer', 'min:5', 'max:120'],
        ]);

        // Update the business hours in the database
        $businessHours->update($validated);

        // Redirect back with success message!
        return back()->with('success', 'Business hours updated successfully!');
    }
}
