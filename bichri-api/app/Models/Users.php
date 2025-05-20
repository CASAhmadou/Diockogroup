<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Users extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'identity_verified',
        'face_id',
        'balance',
        'id_number',
        'is_verified',
        'verification_score'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'balance' => 'decimal:2',
        'is_verified' => 'boolean',
        'verification_score' => 'decimal:2'
    ];

    public function virtualCard(){
        return $this->hasOne(VirtualCards::class);
    }

    public function identityDocument(){
        return $this->hasOne(IdentityDocuments::class);
    }

    public function faceData(){
        return $this->hasOne(FaceData::class);
    }

    public function transactions(){
        return $this->hasMany(Transactions::class);
    }


    public function sentTransactions(){
        return $this->hasMany(Transactions::class, 'sender_id')
            ->where('type', 'debit')->whereNotNull('recipient_id');
    }

    public function receivedTransactions(){
        return $this->hasMany(Transactions::class, 'recipient_id')
            ->where('type', 'credit');
    }

    public function notifications(){
        return $this->hasMany(Notifications::class, 'sender_id');
    }
}
