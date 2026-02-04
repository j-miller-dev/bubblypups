<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    // GET /admin/calendar/appointments?
    public function appointments(Request $request)
    {
        $appointments = Appointment::with(['dog.customer', 'service'])
            ->whereBetween('appointment_date', [$request->start, $request->end])
            ->whereIn('status', ['pending', 'confirmed', 'waiting_on_client'])
            ->get();

        return response()->json($appointments);
    }
}
