<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Spell;
use App\Models\SrdSpell;
use Illuminate\Http\Request;

class SpellController extends Controller
{
    /**
     * Display a listing of custom spells for authenticated user.
     */
    public function all(Request $request)
    {
        // Fetch SRD spells
        $srdQuery = SrdSpell::select([
            'id',
            'index',
            'name',
            'level',
            'school',
            'source'
        ]);

        $srdSpells = $srdQuery->get()->map(function ($s) {
            return [
                'id' => $s->id,
                'index' => $s->index,
                'name' => $s->name,
                'level' => $s->level,
                'school' => $s->school,
                'source' => $s->source ?? 'SRD',
                'data_source' => 'srd',
            ];
        });

        // Fetch custom spells for the authenticated user
        $customSpells = collect();
        if ($request->user()) {
            $customQuery = Spell::where('user_id', $request->user()->id)
            ->with('tags')
            ->select([
                'id',
                'index',
                'name',
                'level',
                'school',
                'source'
            ])
            ->get()
            ->map(fn($s) => [
                'id'            => $s->id,
                'index'         => $s->index,
                'name'          => $s->name,
                'level'         => $s->level,
                'school'        => $s->school,
                'source'        => $s->source ?? 'Custom',
                'data_source'   => 'custom', // To distinguish custom spells
                'tags'          => $s->tags->pluck('name')->toArray(),
            ]);
            $customSpells = $customQuery;
        }

        // Merge and sort
        $allSpells = $srdSpells->merge($customSpells)->sortBy('name')->values();

        return response()->json($allSpells);
    }

    /**
     * Display a listing of custom spells combined with SRD spells.
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 50); // Default 50 items per page
        $page = $request->get('page', 1);

        // Fetch SRD spells
        $srdQuery = SrdSpell::select([
            'id',
            'index',
            'name',
            'level',
            'school',
            'source'
        ]);

        $srdSpells = $srdQuery->get()->map(function ($s) {
            return [
                'id' => $s->id,
                'index' => $s->index,
                'name' => $s->name,
                'level' => $s->level,
                'school' => $s->school,
                'source' => $s->source ?? 'SRD',
                'data_source' => 'srd',
            ];
        });

        // Fetch custom spells for the authenticated user
        $customSpells = collect();
        if ($request->user()) {
            $customQuery = Spell::where('user_id', $request->user()->id)
            ->with('tags')
            ->select([
                'id',
                'index',
                'name',
                'level',
                'school',
                'source'
            ])
            ->get()
            ->map(fn($s) => [
                'id'            => $s->id,
                'index'         => $s->index,
                'name'          => $s->name,
                'level'         => $s->level,
                'school'        => $s->school,
                'source'        => $s->source ?? 'Custom',
                'data_source'   => 'custom', // To distinguish custom spells
                'tags'          => $s->tags->pluck('name')->toArray(),
            ]);
            $customSpells = $customQuery;
        }

        // Merge and sort
        $allSpells = $srdSpells->merge($customSpells)->sortBy('name')->values();

        // Paginate manually
        $total = $allSpells->count();
        $items = $allSpells->forPage($page, $perPage)->values();

        $lastPage = (int) ceil($total / $perPage);

        return response()->json([
            'data' => $items,
            'current_page' => (int) $page,
            'last_page' => $lastPage,
            'per_page' => (int) $perPage,
            'total' => $total,
            'has_more' => $page < $lastPage,
            'next_page' => $page < $lastPage ? $page + 1 : null,
        ]);
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
