<?php
namespace App\Services;

use App\Models\Users;
use Illuminate\Support\Facades\Hash;

class UserService{
    public function createOrRetrieveUser(array $userData){
        // Recherche de l'utilisateur par email ou création d'un nouveau
        $user = Users::firstOrCreate(
            ['email' => $userData['email']],
            [
                'name' => $userData['name'],
                //'password' => Hash::make(str_random(16)) // Mot de passe aléatoire
            ]
        );

        return $user;
    }
}
