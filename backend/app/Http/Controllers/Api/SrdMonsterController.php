<?php

namespace App\Http\Controllers\Api;

use App\Models\SrdMonster;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SrdMonsterController extends Controller
{
    public function all()
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
        ])
        ->orderBy('name')
        ->get()
        ->map(fn($m) => [
            'id'                => $m->id,
            'index'             => $m->index,
            'name'              => $m->name,
            'image_url'         => $m->image_url,
            'type'              => $m->type,
            'challenge_rating'  => $m->challenge_rating,
            'source'            => $m->source ?? 'SRD',
            'data_source'       => 'srd',
        ]);

        return response()->json($srdMonsters);
    }

    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 50); // Default 50 items per page
        $page = $request->get('page', 1);

        // Optimized for table view: only essential fields for display and filtering
        $srdMonsters = SrdMonster::select([
            'id',
            'index',
            'name',
            'image',
            'type',
            'challenge_rating',
            'source'
        ])
        ->orderBy('name')
        ->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data' => collect($srdMonsters->items())->map(fn($m) => [
                'id'                => $m->id,
                'index'             => $m->index,
                'name'              => $m->name,
                'image_url'         => $m->image_url,
                'type'              => $m->type,
                'challenge_rating'  => $m->challenge_rating,
                'source'            => $m->source ?? 'SRD',
                'data_source'       => 'srd',
            ]),
            'current_page' => $srdMonsters->currentPage(),
            'last_page' => $srdMonsters->lastPage(),
            'per_page' => $srdMonsters->perPage(),
            'total' => $srdMonsters->total(),
            'has_more' => $srdMonsters->hasMorePages(),
            'next_page' => $srdMonsters->hasMorePages() ? $srdMonsters->currentPage() + 1 : null,
        ]);
    }

    public function show(string $index)
    {
        $monster = SrdMonster::where('index', $index)->firstOrFail();

        return response()->json($monster);
    }
}
