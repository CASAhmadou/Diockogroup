<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TransactionController;
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

// Routes API
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/verify-document', [AuthController::class, 'verifyDocument']);
    Route::post('/auth/verify-face', [AuthController::class, 'verifyFace']);
    Route::get('/user/balance', [UserController::class, 'getBalance']);
    Route::post('/transactions/recharge', [TransactionController::class, 'recharge']);
    Route::post('/transactions/transfer', [TransactionController::class, 'transfer']);
    Route::get('/transactions/history', [TransactionController::class, 'getHistory']);
    Route::get('/notifications', [NotificationController::class, 'getAll']);
});


// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
