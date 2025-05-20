<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * profil user
     */
    public function getProfile(Request $request){
        $user = $request->user()->load('transactions');

        return response()->json([
            'user' => $user,
            'stats' => [
                'total_transactions' => $user->transactions->count(),
                'total_received' => $user->transactions->where('type', 'credit')->sum('amount'),
                'total_sent' => abs($user->transactions->where('type', 'debit')->sum('amount'))
            ]
        ]);
    }

    /**
     * mettre à jour le profil
     */
    public function updateProfile(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' .$request->user()->id,
            'phone' => 'sometimes|string|unique:users,phone,' .$request->user()->id
        ]);

        if($validator->fails()){
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();
        $user->update($request->only(['name','email','phone']));

        return response()->json([
            'success' => true,
            'user' => $user->fresh()
        ]);
    }

    /**
     * Changer le mot de passe
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Mot de passe actuel incorrect'], 400);
        }

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json(['message' => 'Mot de passe mis à jour avec succès']);
    }

}
