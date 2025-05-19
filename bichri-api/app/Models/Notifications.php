<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notifications extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'type', 'title', 'content', 'is_read'
    ];

    public function notification(){
        return $this->belongsTo(Users::class, 'sender_id');
    }
}
