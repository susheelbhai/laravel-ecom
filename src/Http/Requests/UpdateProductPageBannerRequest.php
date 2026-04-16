<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductPageBannerRequest extends FormRequest
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
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'href' => ['nullable', 'string', 'max:500', 'url'],
            'target' => ['nullable', 'string', 'in:_self,_blank,_parent,_top'],
            'display_order' => ['required', 'integer', 'min:0'],
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
            'image.image' => 'The file must be an image.',
            'image.mimes' => 'Only JPEG, PNG, JPG, and WebP images are allowed.',
            'image.max' => 'Image size must not exceed 5MB.',
            'href.url' => 'Please enter a valid URL.',
            'href.max' => 'URL must not exceed 500 characters.',
            'target.in' => 'Invalid target attribute selected.',
            'display_order.required' => 'Display order is required.',
            'display_order.integer' => 'Display order must be a number.',
            'display_order.min' => 'Display order must be at least 0.',
            'is_active.required' => 'Active status is required.',
            'is_active.boolean' => 'Active status must be true or false.',
        ];
    }
}
