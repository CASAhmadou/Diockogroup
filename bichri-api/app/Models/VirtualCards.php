<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VirtualCards extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'card_number', 'balance', 'is_active', 'expires_at'
    ];


    public function user(){
        return $this->belongsTo(Users::class);
    }
}
