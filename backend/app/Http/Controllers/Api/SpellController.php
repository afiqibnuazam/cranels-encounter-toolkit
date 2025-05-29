<?php

namespace App\Http\Controllers\Api;

use App\Models\Spell;
use App\Models\SrdSpell;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SpellController extends Controller
{
    public function index()
    {
        $srd = SrdSpell::all()->map(function ($s) {
            return [
                'id' => $s->id,
                'index' => $s->index,
                'name' => $s->name,
                'level' => $s->level,
                'school' => $s->school,
                'source' => 'srd',
            ];
        });

        $custom = Spell::all()->map(function ($s) {
            return [
                'id' => $s->id,
                'index' => $s->index,
                'name' => $s->name,
                'level' => $s->level,
                'school' => $s->school,
                'source' => 'custom',
            ];
        });

        return response()->json($srd->merge($custom)->sortBy('name')->values());
    }

    public function show($index)
    {
        $spell = Spell::where('index', $index)->first() ?? SrdSpell::where('index', $index)->first();

        if (!$spell) {
            return response()->json(['error' => 'Spell not found'], 404);
        }

        return response()->json($spell);
    }
}
