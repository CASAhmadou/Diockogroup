<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IdentityDocuments extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'document_type', 'document_number', 'image', 'full_name', 'date_of_v=birth', 'expiry_date','country','verified','verification_date'
    ];


    public function user(){
        return $this->belongsTo(Users::class);
    }
}
