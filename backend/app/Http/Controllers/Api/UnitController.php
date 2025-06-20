<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use App\Enums\UnitType;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    /**
     * Display a listing of characters (units with unit_type = player_character).
     */
    public function index(Request $request)
    {
        // Only return characters for the authenticated user
        $characters = Unit::where('user_id', $request->user()->id)
            ->where('unit_type', UnitType::PLAYER_CHARACTER)
            ->select([
                'id',
                'index',
                'name',
                'challenge_rating',
                'type',
                'level', // Character level
                'source'
            ])
            ->get()
            ->map(fn ($c) => [
                'id'                => $c->id,
                'index'             => $c->index,
                'name'              => $c->name,
                'challenge_rating'  => $c->challenge_rating,
                'type'              => $c->type,
                'level'             => $c->level ?? 1, // Default to level 1
                'source'            => $c->source ?? 'Custom',
            ]);

        return response()->json($characters);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id, Request $request)
    {
        $character = Unit::where('user_id', $request->user()->id)
            ->where('unit_type', UnitType::PLAYER_CHARACTER)
            ->where('id', $id)
            ->firstOrFail();

        return response()->json($character);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
