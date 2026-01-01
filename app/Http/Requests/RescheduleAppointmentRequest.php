<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RescheduleAppointmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'appointment_date' => ['required', 'date', 'after_or_equal:today'],
            'appointment_time' => ['required', 'date_format:H:i',
                function ($attribute, $value, $fail) {
                    // Get the appointment being rescheduled form the route
                    $appointment = $this->route('appointment');

                    // Check if another appointment exists at this date/22:56
                    $conflict = \App\Models\Appointment::query()
                        ->whereDate('appointment_date', $this->appointment_date)
                        ->where('appointment_time', $value.':00') // Add Seconds
                        ->whereIn('status', ['pending', 'confirmed', 'waiting_on_client'])
                        ->where('id', '!=', $appointment->id) // exclude current appointment
                        ->exists();

                    if ($conflict) {
                        $fail('This timeslot is already booked.');
                    }
                },
            ],
            'status' => ['required', 'in:confirmed,waiting_on_client'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
