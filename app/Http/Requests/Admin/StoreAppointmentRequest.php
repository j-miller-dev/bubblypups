<?php

namespace App\Http\Requests\Admin;

use App\Enums\AppointmentStatus;
use App\Models\BlockedTime;
use App\Models\BusinessHours;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAppointmentRequest extends FormRequest
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
            // Either existing dog OR new customer+dog required
            'dog_id' => ['required_without:new_customer', 'nullable', 'exists:dogs,id'],

            // New customer fields (required if dog_id not provided)
            'new_customer' => ['required_without:dog_id', 'nullable', 'array'],
            'new_customer.name' => ['required_with:new_customer', 'string', 'max:255'],
            'new_customer.email' => ['required_with:new_customer', 'email', 'unique:customers,email'],
            'new_customer.phone' => ['required_with:new_customer', 'string', 'max:255'],

            // New dog fields (required if dog_id not provided)
            'new_dog' => ['required_without:dog_id', 'nullable', 'array'],
            'new_dog.name' => ['required_with:new_dog', 'string', 'max:255'],
            'new_dog.breed' => ['required_with:new_dog', 'string', 'max:255'],
            'new_dog.size' => ['required_with:new_dog', 'string', 'in:small,medium,large'],
            'new_dog.special_notes' => ['nullable', 'string'],

            // Appointment fields (always required)
            'service_id' => ['required', 'exists:services,id'],
            'appointment_date' => [
                'required',
                'date',
                'after_or_equal:today',
                function ($attribute, $value, $fail) {
                    $dayOfWeek = Carbon::parse($value)->format('l');
                    $hours = BusinessHours::getHoursForDay($dayOfWeek);

                    if (! $hours || ! $hours->is_open) {
                        $fail('The business is not open on this day.');
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
                            $fail('This time is outside business hours.');
                        }
                    }

                    $slotTime = Carbon::parse($this->appointment_date.' '.$value);

                    $blocked = BlockedTime::query()
                        ->where('start_datetime', '<=', $slotTime)
                        ->where('end_datetime', '>=', $slotTime)
                        ->exists();

                    if ($blocked) {
                        $fail('This time slot is blocked and unavailable.');
                    }
                },
            ],
            'status' => ['required', Rule::in([AppointmentStatus::Pending, AppointmentStatus::Confirmed, AppointmentStatus::WaitingOnClient])],
            'notes' => ['nullable', 'string'],
        ];
    }
}
