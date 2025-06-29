<?php

namespace App\Models;

use App\Enums\UnitType;
use Illuminate\Database\Eloquent\Model;

class Combatant extends Model
{
    protected $fillable = [
        'encounter_id',
        'index',
        'unit_type',
        'initiative',
        'name',
        'current_hit_points',
        'max_hit_points',
        'temporary_hit_points',
        'armor_class',
        'used_spell_slots',
        'action_used',
        'bonus_action_used',
        'reaction_used',
        'legendary_actions_used',
        'combatantable_type',
        'combatantable_id'
    ];

    protected $casts = [
        'unit_type'                 => UnitType::class,
        'used_spell_slots'          => 'array',
        'action_used'               => 'boolean',
        'bonus_action_used'         => 'boolean',
        'reaction_used'             => 'boolean',
        'legendary_actions_used'    => 'integer',
    ];


    // Helper methods for spell slot management
    public function getUsedSpellSlots(): array
    {
        return $this->used_spell_slots ?? [];
    }

    public function useSpellSlot(int $level): void
    {
        $usedSlots = $this->getUsedSpellSlots();
        $levelKey = (string)$level;
        $usedSlots[$levelKey] = ($usedSlots[$levelKey] ?? 0) + 1;
        $this->update(['used_spell_slots' => $usedSlots]);
    }

    public function restoreSpellSlot(int $level): void
    {
        $usedSlots = $this->getUsedSpellSlots();
        $levelKey = (string)$level;
        if (isset($usedSlots[$levelKey]) && $usedSlots[$levelKey] > 0) {
            $usedSlots[$levelKey]--;
            if ($usedSlots[$levelKey] === 0) {
                unset($usedSlots[$levelKey]);
            }
            $this->update(['used_spell_slots' => $usedSlots]);
        }
    }

    public function resetActionEconomy(): void
    {
        $this->update([
            'action_used' => false,
            'bonus_action_used' => false,
            'reaction_used' => false,
            'legendary_actions_used' => 0,
        ]);
    }

    
    // Relationships
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
