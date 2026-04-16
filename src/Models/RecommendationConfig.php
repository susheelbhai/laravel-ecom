<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecommendationConfig extends Model
{
    /** @use HasFactory<\Database\Factories\RecommendationConfigFactory> */
    use HasFactory;

    protected $fillable = [
        'section_type',
        'is_enabled',
        'display_order',
    ];

    protected function casts(): array
    {
        return [
            'is_enabled' => 'boolean',
            'display_order' => 'integer',
        ];
    }
}
