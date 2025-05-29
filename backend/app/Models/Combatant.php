<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Combatant extends Model
{
    protected $fillable = [
        'encounter_id',
        'initiative',
        'name',
        'current_hit_points',
        'max_hit_points',
        'temporary_hit_points',
        'armor_class',
    ];


    public function encounter()
    {
        return $this->belongsTo(Encounter::class);
    }

    public function combatantable()
    {
        return $this->morphTo();
    }

    public function effects()
    {
        return $this->hasMany(Effect::class);
    }

    public function concentrationEffects()
    {
        return $this->hasMany(Effect::class, 'caster_combatant_id')
            ->where('concentration', true);
    }
}
