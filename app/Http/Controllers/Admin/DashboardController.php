<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $appointments = Appointment::with(['customer', 'dog'])
            ->pending()
            ->latest()
            ->get();

        return Inertia::render('Dashboard/Overview', [
            'appointments' => $appointments,
        ]);
    }
}
