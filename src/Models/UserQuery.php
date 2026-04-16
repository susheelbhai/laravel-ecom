<?php

namespace App\Models;

use App\Traits\HasFormattedDates;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class UserQuery extends Model
{
    use HasFactory, HasFormattedDates, Notifiable;

    public function status()
    {
        return $this->belongsTo(UserQueryStatus::class, 'status_id');
    }
}
