<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDogPhotoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * ADMIN should ALWAYS be authorized to make such requests.
     */
    public function authorize(): bool
    {
        // Ensure Admin is ALWAYS authorized
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     *                                                                                            Same rules should apply for Admin.
     */
    public function rules(): array
    {
        return [
            'photo' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'photo.required' => 'Please select a photo to upload.',
            'photo.image' => 'The file must be an image.',
            'photo.mimes' => 'The photo must be a JPEG, PNG, or WebP image.',
            'photo.max' => 'The photo must not be larger than 5MB.',
        ];
    }
}
