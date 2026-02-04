<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

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
            'appointment_date' => ['required', 'date', 'after_or_equal:today'],
            'appointment_time' => ['required', 'date_format:H:i'],
            'status' => ['required', 'in:pending,confirmed,waiting_on_client'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
