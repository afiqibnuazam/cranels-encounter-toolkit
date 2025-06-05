<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use App\Enums\UnitType;
use Illuminate\Http\Request;

class MonsterController extends Controller
{
    /**
     * Display a listing of custom monsters (units with unit_type = monster).
     */
    public function index(Request $request)
    {
        // Only return custom monsters for the authenticated user
        $monsters = Unit::where('user_id', $request->user()->id)
            ->ofType(UnitType::MONSTER)
            ->select([
                'id',
                'index',
                'name',
                'type',
                'challenge_rating',
                'source'
            ])
            ->get()
            ->map(fn ($m) => [
                'id'                => $m->id,
                'index'             => $m->index,
                'name'              => $m->name,
                'type'              => $m->type,
                'challenge_rating'  => $m->challenge_rating,
                'source'            => $m->source ?? 'Custom',
                'data_source'       => 'custom', // To distinguish custom monsters
            ]);

        return response()->json($monsters);
    }

    /**
     * Store a newly created custom monster in storage.
     */
    public function store(Request $request)
    {
        // TODO: Implement custom monster creation
        // Create new Unit with unit_type = MONSTER and user_id = authenticated user
    }

    /**
     * Display the specified custom monster with all attributes.
     */
    public function show(string $index, Request $request)
    {
        $monster = Unit::where('user_id', $request->user()->id)
            ->ofType(UnitType::MONSTER)
            ->where('index', $index)
            ->firstOrFail();

        return response()->json($monster);
    }

    /**
     * Update the specified custom monster in storage.
     */
    public function update(Request $request, string $id)
    {
        // TODO: Implement custom monster update
        // Validate ownership
    }

    /**
     * Remove the specified custom monster from storage.
     */
    public function destroy(string $id, Request $request)
    {
        // TODO: Implement custom monster deletion
        // Validate ownership
    }
}
