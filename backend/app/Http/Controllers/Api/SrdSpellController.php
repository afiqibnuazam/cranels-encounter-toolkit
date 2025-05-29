<?php

namespace App\Http\Controllers\Api;

use App\Models\SrdSpell;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SrdSpellController extends Controller
{
    public function index()
    {
        $srdSpells = SrdSpell::all()->map(fn ($m) => [
            'id'        => $m->id,
            'index'     => $m->index,
            'name'      => $m->name,
            // Add other summary fields if needed
        ]);

        return response()->json($srdSpells);
    }

    public function show(string $index)
    {
        $spell = SrdSpell::where('index', $index)->firstOrFail();

        return response()->json($spell);
    }
}
