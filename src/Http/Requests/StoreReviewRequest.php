<?php

namespace App\Http\Requests;

use App\Models\OrderItem;
use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // User must be authenticated
        if (! $this->user()) {
            return false;
        }

        // User must have a verified purchase of the product
        $productId = $this->route('product')?->id ?? $this->input('product_id');

        return OrderItem::query()
            ->where('product_id', $productId)
            ->whereHas('order', function ($query) {
                $query->where('user_id', $this->user()->id)
                    ->where('payment_status', 'paid');
            })
            ->exists();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'title' => ['nullable', 'string', 'max:255'],
            'content' => ['required', 'string', 'min:10', 'max:5000'],
            'images.*' => ['nullable', 'image', 'max:5120'],
            'videos.*' => ['nullable', 'mimetypes:video/mp4,video/mpeg', 'max:51200'],
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
            'rating.required' => 'Rating is required.',
            'rating.integer' => 'Rating must be a whole number.',
            'rating.min' => 'Rating must be at least 1 star.',
            'rating.max' => 'Rating must be at most 5 stars.',
            'title.string' => 'Title must be a valid text.',
            'title.max' => 'Title cannot exceed 255 characters.',
            'content.required' => 'Review content is required.',
            'content.string' => 'Review content must be valid text.',
            'content.min' => 'Review content must be at least 10 characters.',
            'content.max' => 'Review content cannot exceed 5000 characters.',
            'images.*.image' => 'Each file must be a valid image.',
            'images.*.max' => 'Each image must be less than 5MB.',
            'videos.*.mimetypes' => 'Videos must be in MP4 or MPEG format.',
            'videos.*.max' => 'Each video must be less than 50MB.',
        ];
    }
}
