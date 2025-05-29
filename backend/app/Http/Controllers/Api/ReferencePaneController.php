<?php

namespace App\Http\Controllers\Api;

use App\Models\Unit;
use App\Models\Spell;
use App\Enums\UnitType;
use App\Models\SrdSpell;
use App\Models\Encounter;
use App\Models\SrdMonster;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ReferencePaneController extends Controller
{
    public function monsters()
    {
       $srdMonsters = SrdMonster::all()->map(fn ($m) => [
            'id'        => 'srd-' . $m->id,
            'name'      => $m->name,
            'source'    => 'SRD',
            'image_url' => $m->image_url,
            // Add other summary fields if needed
        ]);

        $customMonsters = Unit::ofType(UnitType::MONSTER)->get()->map(fn ($m) => [
            'id'        => 'custom-' . $m->id,
            'name'      => $m->name,
            'source'    => 'Custom',
            // Add other summary fields if needed
        ]);

        $combined = $srdMonsters->merge($customMonsters)->sortBy('name')->values();

        return response()->json($combined);
    }

    public function characters()
    {
        $types = [UnitType::PLAYER_CHARACTER, UnitType::ALLIED_NPC, UnitType::ENEMY_NPC];

        $characters = Unit::ofTypes($types)->get()->map(fn ($c) => [
            'id'        => 'custom-' . $c->id,
            'name'      => $c->name,
            'source'    => 'Custom',
            // Add other summary fields if needed
        ]);

        return response()->json($characters);
    }

    public function spells()
    {
        $srdSpells = SrdSpell::all()->map(fn ($s) => [
            'id' => 'srd-' . $s->id,
            'name' => $s->name,
            'level' => $s->level,
            'source' => 'SRD',
            // Add other summary fields if needed
        ]);

        $customSpells = Spell::all()->map(fn ($s) => [
            'id' => 'custom-' . $s->id,
            'name' => $s->name,
            'level' => $s->level,
            'source' => 'Custom',
            // Add other summary fields if needed
        ]);

        $combined = $srdSpells->merge($customSpells)->sortBy('name')->values();

        return response()->json($combined);
    }

    public function encounters()
    {
        $encounters = Encounter::all()->map(fn ($e) => [
            'id' => $e->id,
            'name' => $e->name,
            'status' => $e->status,
            // Add other summary fields if needed
        ]);

        return response()->json($encounters);
    }
}
