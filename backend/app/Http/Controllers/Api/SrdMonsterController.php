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
        $monster = SrdMonster::with([
            'spellcastingProfiles.srdSpells',
            'spellcastingProfiles.spells'
        ])->where('index', $index)->firstOrFail();
        
        // Ensure image_url accessor is included in the response
        $monster->append('image_url');

        // Enhance spellcasting profiles with usage information from special_abilities
        if ($monster->spellcastingProfiles && $monster->special_abilities) {
            foreach ($monster->spellcastingProfiles as $profile) {
                // Find the corresponding spellcasting ability in special_abilities
                $spellcastingAbility = collect($monster->special_abilities)->first(function ($ability) {
                    return isset($ability['name']) && 
                           str_contains(strtolower($ability['name']), 'spellcasting') &&
                           isset($ability['spellcasting']);
                });

                if ($spellcastingAbility && isset($spellcastingAbility['spellcasting']['spells'])) {
                    // Create a map of spell names to their usage and notes information
                    $spellInfoMap = [];
                    foreach ($spellcastingAbility['spellcasting']['spells'] as $spellInfo) {
                        $spellKey = strtolower($spellInfo['name']);
                        $spellInfoMap[$spellKey] = [];
                        
                        if (isset($spellInfo['usage'])) {
                            $spellInfoMap[$spellKey]['usage'] = $spellInfo['usage'];
                        }
                        
                        if (isset($spellInfo['notes'])) {
                            $spellInfoMap[$spellKey]['notes'] = $spellInfo['notes'];
                        }
                    }

                    // Add usage and notes information to SRD spells
                    foreach ($profile->srdSpells as $spell) {
                        $spellKey = strtolower($spell->name);
                        if (isset($spellInfoMap[$spellKey])) {
                            if (isset($spellInfoMap[$spellKey]['usage'])) {
                                $spell->creature_usage = $spellInfoMap[$spellKey]['usage'];
                            }
                            if (isset($spellInfoMap[$spellKey]['notes'])) {
                                $spell->notes = $spellInfoMap[$spellKey]['notes'];
                            }
                        }
                    }

                    // Add usage and notes information to custom spells
                    foreach ($profile->spells as $spell) {
                        $spellKey = strtolower($spell->name);
                        if (isset($spellInfoMap[$spellKey])) {
                            if (isset($spellInfoMap[$spellKey]['usage'])) {
                                $spell->creature_usage = $spellInfoMap[$spellKey]['usage'];
                            }
                            if (isset($spellInfoMap[$spellKey]['notes'])) {
                                $spell->notes = $spellInfoMap[$spellKey]['notes'];
                            }
                        }
                    }
                }
            }
        }

        return response()->json($monster);
    }
}
