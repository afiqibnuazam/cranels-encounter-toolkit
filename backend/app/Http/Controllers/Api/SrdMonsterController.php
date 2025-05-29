<?php

namespace App\Http\Controllers\Api;

use App\Models\SrdMonster;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SrdMonsterController extends Controller
{
    public function index()
    {
        $srdMonsters = SrdMonster::all()->map(fn ($m) => [
            'id'        => $m->id,
            'index'     => $m->index,
            'name'      => $m->name,
            'image_url' => $m->image_url,
            // Add other summary fields if needed
        ]);

        return response()->json($srdMonsters);
    }

    public function show(string $index)
    {
        $monster = SrdMonster::where('index', $index)->firstOrFail();

        return response()->json($monster);
    }
}
