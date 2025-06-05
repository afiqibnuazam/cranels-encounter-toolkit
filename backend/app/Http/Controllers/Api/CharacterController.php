<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use App\Enums\UnitType;
use Illuminate\Http\Request;

class CharacterController extends Controller
{
    /**
     * Display a listing of characters (units with unit_type = player_character, allied_npc, enemy_npc).
     */
    public function index(Request $request)
    {
        // Only return characters for the authenticated user
        $characters = Unit::where('user_id', $request->user()->id)
            ->ofTypes([
                UnitType::PLAYER_CHARACTER,
                UnitType::ALLIED_NPC,
                UnitType::ENEMY_NPC
            ])
            ->select([
                'id',
                'index',
                'name',
                'challenge_rating',
                'type',
                'level', // Character level
                'source',
                'unit_type'
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
                'unit_type'         => $c->unit_type->value,
            ]);

        return response()->json($characters);
    }

    /**
     * Store a newly created character in storage.
     */
    public function store(Request $request)
    {
        // TODO: Implement character creation
        // Validate that unit_type is one of the character types
        // Create new Unit with user_id = authenticated user
    }

    /**
     * Display the specified character with all attributes.
     */
    public function show(string $id, Request $request)
    {
        $character = Unit::where('user_id', $request->user()->id)
            ->ofTypes([
                UnitType::PLAYER_CHARACTER,
                UnitType::ALLIED_NPC,
                UnitType::ENEMY_NPC
            ])
            ->where('id', $id)
            ->firstOrFail();

        return response()->json($character);
    }

    /**
     * Update the specified character in storage.
     */
    public function update(Request $request, string $id)
    {
        // TODO: Implement character update
        // Validate ownership and character type
    }

    /**
     * Remove the specified character from storage.
     */
    public function destroy(string $id, Request $request)
    {
        // TODO: Implement character deletion
        // Validate ownership and character type
    }
}
