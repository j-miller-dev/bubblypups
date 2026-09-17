<?php

namespace App\Http\Requests;

use App\Services\AvailabilityService;
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
                    // Rescheduling keeps the appointment's existing service/duration.
                    $appointment = $this->route('appointment');

                    $available = app(AvailabilityService::class)->isRangeAvailable(
                        $this->appointment_date,
                        $value,
                        $appointment->duration,
                        $appointment->id,
                    );

                    if (! $available) {
                        $fail('This timeslot is not available.');
                    }
                },
            ],
            'status' => ['required', 'in:confirmed,waiting_on_client'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
