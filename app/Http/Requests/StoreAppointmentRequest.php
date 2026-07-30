<?php

namespace App\Http\Requests;

use App\Models\BlockedTime;
use App\Models\BusinessHours;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Ensure customer owns this dog
        return $this->user('customer')->dogs()->where('id', $this->dog_id)->exists();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'dog_id' => ['required', 'exists:dogs,id'],
            'service_id' => ['required', 'exists:services,id'],
            'appointment_date' => [
                'required',
                'date',
                'after_or_equal:today',
                function ($attribute, $value, $fail) {
                    $dayOfWeek = Carbon::parse($value)->format('l');
                    $hours = BusinessHours::getHoursForDay($dayOfWeek);

                    if (! $hours || ! $hours->is_open) {
                        $fail('We are not open on this day.');
                    }
                },
            ],
            'appointment_time' => [
                'required',
                'date_format:H:i',
                function ($attribute, $value, $fail) {
                    if (! $this->appointment_date) {
                        return;
                    }

                    $dayOfWeek = Carbon::parse($this->appointment_date)->format('l');
                    $hours = BusinessHours::getHoursForDay($dayOfWeek);

                    if ($hours && $hours->is_open) {
                        $slotTime = Carbon::parse($this->appointment_date.' '.$value);
                        $open = Carbon::parse($this->appointment_date.' '.$hours->open_time);
                        $close = Carbon::parse($this->appointment_date.' '.$hours->close_time);

                        if ($slotTime->lt($open) || $slotTime->gte($close)) {
                            $fail('This time is outside our business hours.');
                        }
                    }

                    $slotTime = Carbon::parse($this->appointment_date.' '.$value);

                    $blocked = BlockedTime::query()
                        ->where('start_datetime', '<=', $slotTime)
                        ->where('end_datetime', '>=', $slotTime)
                        ->exists();

                    if ($blocked) {
                        $fail('This time slot is not available for booking.');
                    }
                },
            ],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
