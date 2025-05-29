<?php

namespace App\Http\Controllers\Api;

use App\Models\Spell;
use App\Models\SrdSpell;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SpellCloneController extends Controller
{
    // TODO: add route and check back attributes
    public function __invoke(string $index)
    {
        $srd = SrdSpell::where('index', $index)->firstOrFail();

        $custom = Spell::create([
            'index' => 'custom-' . Str::uuid(),
            'name' => $srd->name . ' (Copy)',
            'level' => $srd->level,
            'school' => $srd->school,
            'ritual' => $srd->ritual,
            'concentration' => $srd->concentration,
            'casting_time' => $srd->casting_time,
            'duration' => $srd->duration,
            'range' => $srd->range,
            'attack_type' => $srd->attack_type,
            'material' => $srd->material,
            'desc' => $srd->desc,
            'higher_level' => $srd->higher_level,
            'components' => $srd->components,
            'area_of_effect' => $srd->area_of_effect,
            'damage' => $srd->damage,
            'dc' => $srd->dc,
            'heal_at_slot_level' => $srd->heal_at_slot_level,
            'classes' => $srd->classes,
            'subclasses' => $srd->subclasses,
        ]);

        return response()->json($custom);
    }
}
