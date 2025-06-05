<?php

namespace App\Http\Controllers\Api;

use App\Models\SrdMonster;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SrdMonsterController extends Controller
{
    public function index()
    {
        // Optimized for table view: only essential fields for display and filtering
        $srdMonsters = SrdMonster::select([
            'id',
            'index', 
            'name',
            'image',
            'type',
            'challenge_rating',
            'source'
        ])->get()->map(fn ($m) => [
            'id'                => $m->id,
            'index'             => $m->index,
            'name'              => $m->name,
            'image_url'         => $m->image_url,
            'type'              => $m->type,
            'challenge_rating'  => $m->challenge_rating,
            'source'            => $m->source ?? 'SRD', // Default to SRD if no source
            'data_source'       => 'srd', // To distinguish between SRD and custom
        ]);

        return response()->json($srdMonsters);
    }

    public function show(string $index)
    {
        $monster = SrdMonster::where('index', $index)->firstOrFail();

        return response()->json($monster);
    }
}
