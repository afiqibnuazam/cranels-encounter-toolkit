<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use App\Enums\UnitType;
use App\Models\SrdMonster;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class MonsterCloneController extends Controller
{
    // TODO: add route and check back attributes
     public function __invoke(string $index) 
    {
        $srd = SrdMonster::where('index', $index)->firstOrFail();

        $custom = Unit::create([
            'index' => 'custom-' . Str::uuid(),
            'name' => $srd->name . ' (Copy)',
            'unit_type' => UnitType::MONSTER,
            'size' => $srd->size,
            'type' => $srd->type,
            'subtype' => $srd->subtype,
            'alignment' => $srd->alignment,
            'armor_class' => $srd->armor_class,
            'hit_points' => $srd->hit_points,
            'hit_dice' => $srd->hit_dice,
            'speed' => $srd->speed,
            'stats' => $srd->stats,
            'damage_vulnerabilities' => $srd->damage_vulnerabilities,
            'damage_resistances' => $srd->damage_resistances,
            'damage_immunities' => $srd->damage_immunities,
            'condition_immunities' => $srd->condition_immunities,
            'senses' => $srd->senses,
            'languages' => $srd->languages,
            'challenge_rating' => $srd->challenge_rating,
            'xp' => $srd->xp,
            'traits' => $srd->traits,
            'actions' => $srd->actions,
            'reactions' => $srd->reactions,
            'legendary_actions' => $srd->legendary_actions,
        ]);

        return response()->json($custom);
    }
}
