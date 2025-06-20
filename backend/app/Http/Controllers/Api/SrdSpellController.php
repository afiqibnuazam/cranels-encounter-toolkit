<?php

namespace App\Http\Controllers\Api;

use App\Models\SrdSpell;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SrdSpellController extends Controller
{
    public function all()
    {
        // Optimized for table view: only essential fields for display and filtering
        $srdSpells = SrdSpell::with('tags')->select([
            'id',
            'index',
            'name',
            'level',
            'school',
            'source'
        ])
        ->orderBy('name')
        ->get()
        ->map(fn($s) => [
            'id'            => $s->id,
            'index'         => $s->index,
            'name'          => $s->name,
            'level'         => $s->level,
            'school'        => $s->school,
            'source'        => $s->source ?? 'SRD',
            'data_source'   => 'srd', // To distinguish between SRD and custom
            'tags'          => $s->tags->pluck('name')->toArray(),
        ]);

        return response()->json($srdSpells);
    }

    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 50); // Default 50 items per page
        $page = $request->get('page', 1);

        // Optimized for table view: only essential fields for display and filtering
        $srdSpells = SrdSpell::with('tags')->select([
            'id',
            'index',
            'name',
            'level',
            'school',
            'source'
        ])
        ->orderBy('name')
        ->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data' => collect($srdSpells->items())->map(fn($s) => [
                'id'            => $s->id,
                'index'         => $s->index,
                'name'          => $s->name,
                'level'         => $s->level,
                'school'        => $s->school,
                'source'        => $s->source ?? 'SRD',
                'data_source'   => 'srd',
                'tags'          => $s->tags->pluck('name')->toArray(),
            ]),
            'current_page' => $srdSpells->currentPage(),
            'last_page' => $srdSpells->lastPage(),
            'per_page' => $srdSpells->perPage(),
            'total' => $srdSpells->total(),
            'has_more' => $srdSpells->hasMorePages(),
            'next_page' => $srdSpells->hasMorePages() ? $srdSpells->currentPage() + 1 : null,
        ]);
    }

    public function show(string $index)
    {
        $spell = SrdSpell::where('index', $index)->firstOrFail();

        return response()->json($spell);
    }
}
