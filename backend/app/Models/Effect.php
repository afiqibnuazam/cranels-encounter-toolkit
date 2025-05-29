<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Effect extends Model
{
    protected $fillable = [
        'combatant_id',
        'condition_id',
        'caster_combatant_id',
        'name',
        'desc',
        'duration',
        'turn_reference_combatant_id',
        'turn_timing',
        'save_type',
        'save_dc',
        'concentration',
        'applied_at',
        'expires_at',
        'notes'
    ];

    protected $casts = [
        'duration'                      => 'integer',
        'turn_reference_combatant_id'   => 'integer',
        'save_dc'                       => 'integer',
        'concentration'                 => 'boolean',
        'applied_at'                    => 'datetime',
        'expires_at'                    => 'datetime',
    ];


    public function combatant()
    {
        return $this->belongsTo(Combatant::class);
    }

    public function condition()
    {
        return $this->belongsTo(Condition::class);
    }

    public function sourceSpellable()
    {
        return $this->morphTo();
    }

    public function sourceCaster()
    {
        return $this->belongsTo(Combatant::class, 'caster_combatant_id');
    }

    public function turnReferenceCombatant()
    {
        return $this->belongsTo(Combatant::class, 'turn_reference_combatant_id');
    }
}
