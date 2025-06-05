<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Spell;
use Illuminate\Http\Request;

class SpellController extends Controller
{
    /**
     * Display a listing of custom spells for authenticated user.
     */
    public function index(Request $request)
    {
        // Only return custom spells for the authenticated user
        $spells = Spell::where('user_id', $request->user()->id)
            ->with('tags')
            ->select([
                'id',
                'index',
                'name',
                'level',
                'school', // This serves as 'type' for spells
                'source'
            ])
            ->get()
            ->map(fn ($s) => [
                'id'            => $s->id,
                'index'         => $s->index,
                'name'          => $s->name,
                'level'         => $s->level,
                'school'        => $s->school,
                'source'        => $s->source ?? 'Custom',
                'data_source'   => 'custom', // To distinguish custom spells
                'tags'          => $s->tags->pluck('name')->toArray(),
            ]);

        return response()->json($spells);
    }

    /**
     * Store a newly created custom spell in storage.
     */
    public function store(Request $request)
    {
        // TODO: Implement custom spell creation
        // Create new Spell with user_id = authenticated user
    }

    /**
     * Display the specified custom spell with all attributes.
     */
    public function show(string $id, Request $request)
    {
        $spell = Spell::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->firstOrFail();

        return response()->json($spell);
    }

    /**
     * Update the specified custom spell in storage.
     */
    public function update(Request $request, string $id)
    {
        // TODO: Implement custom spell update
        // Validate ownership
    }

    /**
     * Remove the specified custom spell from storage.
     */
    public function destroy(string $id, Request $request)
    {
        // TODO: Implement custom spell deletion
        // Validate ownership
    }
}
