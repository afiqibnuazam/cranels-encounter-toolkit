<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\ReferencePaneController;
use App\Http\Controllers\Api\UnitController;
use App\Http\Controllers\Api\SpellController;
use App\Http\Controllers\Api\EncounterController;
use App\Http\Controllers\Api\SrdMonsterController;
use App\Http\Controllers\Api\SrdSpellController;


// throttle:attempts,minutes
Route::post('register', [AuthController::class, 'register'])->middleware('throttle:5,1');
Route::post('login', [AuthController::class, 'login'])->middleware('throttle:5,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('profile', [AuthController::class, 'profile']);
    Route::get('logout', [AuthController::class, 'logout']);

    Route::prefix('reference')->group(function () {
        Route::get('monsters', [ReferencePaneController::class, 'monsters']);
        Route::get('characters', [ReferencePaneController::class, 'characters']);
        Route::get('spells', [ReferencePaneController::class, 'spells']);
        Route::get('encounters', [ReferencePaneController::class, 'encounters']);
    });

    Route::apiResource('units', UnitController::class);
    // Route::post('monsters/clone/{index}', MonsterCloneController::class);

    Route::apiResource('spells', SpellController::class);
    // Route::post('spells/clone/{index}', SpellCloneController::class);

    Route::apiResource('encounters', EncounterController::class);
});

Route::apiResource('srd-monsters', SrdMonsterController::class)->only(['index', 'show']);
Route::apiResource('srd-spells', SrdSpellController::class)->only(['index', 'show']);
