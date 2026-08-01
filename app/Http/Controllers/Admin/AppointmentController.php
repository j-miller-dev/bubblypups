<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AppointmentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAppointmentRequest;
use App\Http\Requests\RescheduleAppointmentRequest;
use App\Models\Appointment;
use App\Models\Customer;
use App\Models\Dog;
use App\Models\Service;
use App\Services\AvailabilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AppointmentController extends Controller
{
    public function create(): Response
    {
        $services = Service::all()->map(fn ($service) => [
            'id' => $service->id,
            'name' => $service->name,
            'description' => $service->description,
            'emoji' => $service->emoji,
            'base_price' => $service->base_price,
            'duration_minutes' => $service->duration_minutes,
        ]);

        return Inertia::render('Admin/BookingCreate', [
            'services' => $services,
        ]);
    }

    public function availableSlots(Request $request, AvailabilityService $availabilityService): JsonResponse
    {
        $request->validate([
            'date' => ['required', 'date', 'after_or_equal:today'],
            'exclude_appointment_id' => ['nullable', 'integer', 'exists:appointments,id'],
        ]);

        $slots = $availabilityService->getAvailableSlots($request->date, $request->input('exclude_appointment_id'));

        $existingAppointments = Appointment::query()
            ->with(['dog', 'dog.customer', 'service'])
            ->whereDate('appointment_date', $request->date)
            ->whereIn('status', [AppointmentStatus::Pending, AppointmentStatus::Confirmed, AppointmentStatus::WaitingOnClient])
            ->when($request->input('exclude_appointment_id'), fn ($query, $id) => $query->where('id', '!=', $id))
            ->orderBy('appointment_time')
            ->get()
            ->map(fn ($apt) => [
                'time' => $apt->appointment_time->format('H:i'),
                'dog_name' => $apt->dog->name,
                'service' => $apt->service->name ?? 'N/A',
                'duration' => $apt->duration,
                'status' => $apt->status,
            ]);

        return response()->json([
            'slots' => $slots,
            'existing_appointments' => $existingAppointments,
        ]);
    }

    public function store(StoreAppointmentRequest $request): RedirectResponse
    {
        // Determine dog_id and customer_id: use existing or create new customer+dog
        if ($request->filled('dog_id')) {
            $dog = Dog::with('customer')->findOrFail($request->dog_id);
            $dogId = $dog->id;
            $customerId = $dog->customer_id;
        } else {
            // Create new customer with auto-generated password
            $customer = Customer::create([
                'name' => $request->input('new_customer.name'),
                'email' => $request->input('new_customer.email'),
                'phone' => $request->input('new_customer.phone'),
                'password' => Hash::make(Str::random(16)),
            ]);

            // Create new dog for this customer
            $dog = Dog::create([
                'customer_id' => $customer->id,
                'name' => $request->input('new_dog.name'),
                'breed' => $request->input('new_dog.breed'),
                'size' => $request->input('new_dog.size'),
                'special_notes' => $request->input('new_dog.special_notes'),
            ]);

            $dogId = $dog->id;
            $customerId = $customer->id;
        }

        // Get service to determine duration
        $service = Service::findOrFail($request->service_id);

        // Create appointment
        $appointment = Appointment::create([
            'dog_id' => $dogId,
            'customer_id' => $customerId,
            'service_id' => $request->service_id,
            'appointment_date' => $request->appointment_date,
            'appointment_time' => $request->appointment_time,
            'duration' => $service->duration_minutes,
            'status' => $request->status,
            'notes' => $request->notes,
            'confirmed_at' => $request->status === AppointmentStatus::Confirmed->value ? now() : null,
        ]);

        // Load relationships for notification
        $appointment->load(['dog.customer', 'service']);

        // Send booking confirmation to customer
        try {
            $appointment->dog->customer->notify(
                new \App\Notifications\AppointmentCreatedNotification($appointment)
            );
        } catch (\Exception $e) {
            \Log::error('Failed to send appointment notification', [
                'appointment_id' => $appointment->id,
                'error' => $e->getMessage(),
            ]);
        }

        return back()->with('success', 'Appointment created successfully!');
    }

    public function confirm(Appointment $appointment): RedirectResponse
    {
        $appointment->status = AppointmentStatus::Confirmed;
        $appointment->confirmed_at = now();
        $appointment->save();

        // Load relationships for notification
        $appointment->load(['dog.customer']);

        // Notify customer of notification
        try {
            $appointment->dog->customer->notify(
                new \App\Notifications\AppointmentConfirmedNotification($appointment)
            );
        } catch (\Exception $e) {
            \Log::error('Failed to send confirmation notification', [
                'appointment_id' => $appointment->id,
                'error' => $e->getMessage(),
            ]);
        }

        return back()->with('success', 'Appointment confirmed successfully!');
    }

    public function cancel(Appointment $appointment): RedirectResponse
    {
        $appointment->status = AppointmentStatus::Cancelled;
        $appointment->save();

        $appointment->load(['dog.customer']);

        try {
            $appointment->dog->customer->notify(
                new \App\Notifications\AppointmentCancelledNotification($appointment)
            );
        } catch (\Exception $e) {
            \Log::error('Failed to send cancellation notification', [
                'appointment_id' => $appointment->id,
                'error' => $e->getMessage(),
            ]);
        }

        return back()->with('success', 'Appointment cancelled successfully!');
    }

    public function confirmFromEmail(Appointment $appointment): RedirectResponse
    {
        // Only allow confirmation if status is waiting_on_client
        if ($appointment->status !== AppointmentStatus::WaitingOnClient) {
            return redirect()->route('home')->with('error', 'This appointment has already been confirmed or cannot be confirmed.');

        }

        $appointment->status = AppointmentStatus::Confirmed;
        $appointment->confirmed_at = now();
        $appointment->save();

        return redirect()
            ->route('home')
            ->with('success', 'Thank you! Your appointment has been confirmed for '
            .$appointment->appointment_date->format('F j, Y')
                .' at '.$appointment->appointment_time->format('g:i A').'.');
    }

    public function reschedule(RescheduleAppointmentRequest $request, Appointment $appointment)
    {
        // Check if the new time conflicts with blocked times
        $appointmentDateTime = \Carbon\Carbon::parse($request->appointment_date.' '.$request->appointment_time);

        $isBlocked = \App\Models\BlockedTime::query()
            ->where('start_datetime', '<=', $appointmentDateTime)
            ->where('end_datetime', '>=', $appointmentDateTime)
            ->exists();

        if ($isBlocked) {
            return back()->withErrors([
                'appointment_time' => 'This time slot is blocked and unavailable.',
            ]);
        }

        // Capture previous date/time BEFORE saving (for notification)
        $previousDate = $appointment->appointment_date->toDateString();
        $previousTime = $appointment->appointment_time->format('H:i');

        $appointment->appointment_date = $request->appointment_date;
        $appointment->appointment_time = $request->appointment_time;
        $appointment->status = $request->status;

        if ($request->status === AppointmentStatus::WaitingOnClient->value) {
            $appointment->confirmed_at = null;
        } elseif ($request->status === AppointmentStatus::Confirmed->value) {
            $appointment->confirmed_at = now();
        }

        if ($request->filled('notes')) {
            $appointment->notes = $request->notes;
        }

        $appointment->save();

        // Load relationships for notification
        $appointment->load(['dog.customer']);

        // Notify customer of reschedule
        try {
            $appointment->dog->customer->notify(
                new \App\Notifications\AppointmentRescheduledNotification(
                    $appointment,
                    $previousDate,
                    $previousTime
                )
            );
        } catch (\Exception $e) {
            \Log::error('Failed to send reschedule notification', [
                'appointment_id' => $appointment->id,
                'error' => $e->getMessage(),
            ]);
        }

        $message = $request->status === AppointmentStatus::WaitingOnClient->value
            ? 'Appointment rescheduled. Awaiting client confirmation.'
            : 'Appointment rescheduled and confirmed!';

        return back()->with('success', $message);
    }
}
