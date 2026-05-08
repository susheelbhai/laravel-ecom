<?php

namespace App\Models;

use App\Models\BaseModels\BaseInternalAuthenticatable;
use App\Notifications\Auth\Technician\ResetPasswordNotification;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class Technician extends BaseInternalAuthenticatable
{
    use HasFactory, HasRoles, Notifiable;

    public const STATUS_PENDING = 'pending';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_REJECTED = 'rejected';

    protected $appends = ['profile_pic', 'profile_pic_converted'];

    protected $guard_name = 'technician';

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('profile_pic')
            ->singleFile();
    }

    public function getProfilePicAttribute()
    {
        $media = $this->getFirstMedia('profile_pic');

        return $media ? $media->getUrl() : null;
    }

    public function getProfilePicConvertedAttribute(): array
    {
        $media = $this->getFirstMedia('profile_pic');
        if (! $media) {
            return [];
        }
        $urls = [];
        foreach ($media->getGeneratedConversions() as $conversionName => $isGenerated) {
            if ($isGenerated) {
                $urls[$conversionName] = $media->getUrl($conversionName);
            }
        }

        return $urls;
    }

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'specialization',
        'experience_years',
        'certification',
        'address',
        'city',
        'state_id',
        'pincode',
        'id_type',
        'id_number',
        'referral_source',
        'application_status',
        'approved_at',
        'approved_by',
        'rejected_at',
        'rejection_note',
    ];

    /**
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'approved_at' => 'datetime',
            'rejected_at' => 'datetime',
        ];
    }

    public function approvedByAdmin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'approved_by');
    }

    public function state(): BelongsTo
    {
        return $this->belongsTo(State::class);
    }

    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new ResetPasswordNotification($token));
    }

    public function isApproved(): bool
    {
        return $this->application_status === self::STATUS_APPROVED;
    }
}
