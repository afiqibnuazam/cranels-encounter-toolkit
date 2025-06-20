<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\CharacterController;
use App\Http\Controllers\Api\EncounterController;
use App\Http\Controllers\Api\MonsterController;
use App\Http\Controllers\Api\SpellController;
use App\Http\Controllers\Api\SrdMonsterController;
use App\Http\Controllers\Api\SrdSpellController;


// throttle:attempts,minutes
Route::post('register', [AuthController::class, 'register'])->middleware('throttle:5,1');
Route::post('login', [AuthController::class, 'login'])->middleware('throttle:5,1');

// Non-paginated endpoint (backward compatibility)
Route::get('/monsters/all', [MonsterController::class, 'all']);
Route::get('/spells/all', [SpellController::class, 'all']);

// Public paginated monsters and spells endpoint (combined SRD + custom for authenticated users)
Route::get('/monsters', [MonsterController::class, 'index']);
Route::get('/spells', [SpellController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('profile', [AuthController::class, 'profile']);
    Route::post('logout', [AuthController::class, 'logout']);

    // Custom user content routes (authenticated only)
    Route::apiResource('monsters', MonsterController::class)->except(['index']);
    Route::apiResource('characters', CharacterController::class);
    Route::apiResource('spells', SpellController::class)->except(['index']);
    Route::apiResource('encounters', EncounterController::class);
});

Route::get('srd-monsters/all', [SrdMonsterController::class, 'all']);
Route::apiResource('srd-monsters', SrdMonsterController::class)->only(['index', 'show']);
Route::get('srd-spells/all', [SrdSpellController::class, 'all']);
Route::apiResource('srd-spells', SrdSpellController::class)->only(['index', 'show']);
