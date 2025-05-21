<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\Dnd5eController;
use App\Http\Controllers\EncounterController;


// throttle:attempts,minutes
Route::post('register', [AuthController::class, 'register'])->middleware('throttle:5,1');
Route::post('login', [AuthController::class, 'login'])->middleware('throttle:5,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('profile', [AuthController::class, 'profile']);
    Route::get('logout', [AuthController::class, 'logout']);

    Route::apiResource('encounters', EncounterController::class);
});

// DnD 5e API routes
Route::controller(Dnd5eController::class)->group(function () {
    Route::get('monsters', 'getMonsters');
    Route::get('monsters/{monster}', 'getMonster');
    Route::get('spells', 'getSpells');
    Route::get('spells/{spell}', 'getSpell');
});
// Route::get('monsters', [Dnd5eController::class, 'getMonsters']);

