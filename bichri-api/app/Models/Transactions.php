<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transactions extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_type','sender_id', 'recipient_id', 'reference_id', 'reference_number', 'status', 'description'
    ];

    public function sender(){
        return $this->belongsTo(Users::class, 'sender_id');
    }

    public function recipient(){
        return $this->belongsTo(Users::class, 'recipient_id');
    }
}
