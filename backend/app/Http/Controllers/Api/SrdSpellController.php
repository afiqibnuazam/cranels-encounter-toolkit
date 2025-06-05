<?php

namespace App\Http\Controllers\Api;

use App\Models\SrdSpell;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SrdSpellController extends Controller
{
    public function index()
    {
        // Optimized for table view: only essential fields for display and filtering
        $srdSpells = SrdSpell::with('tags')->select([
            'id',
            'index',
            'name', 
            'level',
            'school',
            'source'
        ])->get()->map(fn ($s) => [
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

    public function show(string $index)
    {
        $spell = SrdSpell::where('index', $index)->firstOrFail();

        return response()->json($spell);
    }
}
