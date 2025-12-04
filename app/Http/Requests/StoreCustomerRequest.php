<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:customers,email'],
            'phone' => ['required', 'string', 'max:20'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],

            // Dog information
            'dog_name' => ['required', 'string', 'max:255'],
            'dog_breed' => ['nullable', 'string', 'max:255'],
            'dog_size' => ['required', 'in:small,medium,large'],
            'dog_notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'dog_name.required' => 'Please provide your dog\'s name',
            'dog_size.required' => 'Please select your dog\'s size',
            'dog_size.in' => 'Dog size must be small, medium, or large',
        ];
    }
}
