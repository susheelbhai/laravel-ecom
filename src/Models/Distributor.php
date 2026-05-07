<?php

namespace App\Models;

use App\Models\BaseModels\BaseInternalAuthenticatable;
use App\Notifications\Auth\Distributor\ResetPasswordNotification;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class Distributor extends BaseInternalAuthenticatable
{
    use HasFactory, HasRoles, Notifiable;

    public const STATUS_PENDING = 'pending';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_REJECTED = 'rejected';

    protected $appends = ['profile_pic', 'profile_pic_converted'];

    protected $guard_name = 'distributor';

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('profile_pic')
            ->singleFile();
    }

    public function getProfilePicAttribute()
    {
        $media = $this->getFirstMedia('profile_pic');

        return $media ? $media->getUrl() : $this->avatar;
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
        'legal_business_name',
        'trade_name',
        'business_constitution',
        'authorized_signatory_designation',
        'kyc_id_type',
        'kyc_id_number',
        'pan_number',
        'gstin',
        'tan_number',
        'msme_udyam_number',
        'nature_of_business',
        'years_in_business',
        'expected_monthly_purchase_band',
        'referral_source',
        'pincode',
        'warehouse_address',
        'bank_account_holder_name',
        'bank_name',
        'bank_branch',
        'bank_account_number',
        'bank_ifsc',
        'email',
        'phone',
        'password',
        'address',
        'city',
        'state',
        'dob',
        'google_id',
        'facebook_id',
        'x_id',
        'linkedin_id',
        'github_id',
        'gitlab_id',
        'bitbucket_id',
        'slack_id',
        'apple_id',
        'amazon_id',
        'avatar',
        'application_status',
        'approved_at',
        'approved_by',
        'rejected_at',
        'rejection_note',
        'commission_percentage',
    ];

    /**
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'google_id',
        'facebook_id',
        'x_id',
        'linkedin_id',
        'github_id',
        'gitlab_id',
        'bitbucket_id',
        'slack_id',
        'apple_id',
        'amazon_id',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'approved_at' => 'datetime',
            'rejected_at' => 'datetime',
            'commission_percentage' => 'float',
        ];
    }

    public function approvedByAdmin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'approved_by');
    }

    /**
     * @return HasMany<Dealer, $this>
     */
    public function dealers(): HasMany
    {
        return $this->hasMany(Dealer::class);
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
