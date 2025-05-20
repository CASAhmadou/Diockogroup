<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\NotificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Routes d'authentification
Route::prefix('auth')->group(function () {
    Route::post('/verify-document', [AuthController::class, 'verifyDocument']);
    Route::post('/verify-face', [AuthController::class, 'verifyFace']);
});


// Routes API
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/balance', [UserController::class, 'getBalance']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Utilisateur
    Route::get('/user/profile', [UserController::class, 'getProfile']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::put('/user/password', [UserController::class, 'changePassword']);

    Route::get('/user/balance', [TransactionController::class, 'getBalance']);
    Route::post('/transactions/recharge', [TransactionController::class, 'recharge']);
    Route::post('/transactions/transfer', [TransactionController::class, 'transfer']);
    Route::get('/transactions/history', [TransactionController::class, 'getHistory']);


    Route::get('/notifications', [NotificationController::class, 'getAll']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

});


// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
