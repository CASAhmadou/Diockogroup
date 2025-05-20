<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transactions extends Model
{
    use HasFactory;

    protected $fillable = [
        'balance', 'transaction_type', 'amount', 'method', 'sender_id', 'recipient_id', 'reference_id', 'reference_number', 'status', 'description'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function user(){
        return $this->belongsTo(Users::class);
    }


    public function sender(){
        return $this->belongsTo(Users::class, 'sender_id');
    }

    public function recipient(){
        return $this->belongsTo(Users::class, 'recipient_id');
    }
}
