<?php

namespace App\Http\Controllers\Api;

use App\Enums\UnitType;
use App\Models\Unit;
use App\Models\SrdMonster;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class MonsterController extends Controller
{
    public function index()
    {
        $srd = SrdMonster::all()->map(function ($s) {
            return [
                'id' => $s->id,
                'index' => $s->index,
                'name' => $s->name,
                'level' => $s->level,
                'school' => $s->school,
                'source' => 'srd',
            ];
        });

        $custom = Unit::ofType(UnitType::MONSTER)->get()->map(function ($s) {
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
        
    }
}
