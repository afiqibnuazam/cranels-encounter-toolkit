<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SrdMonster extends Model
{
    protected $fillable = [
        'index',
        'name',
        'desc',
        'image',
        'size',
        'type',
        'subtype',
        'forms',
        'alignment',
        'armor_class',
        'hit_points',
        'hit_dice',
        'hit_points_roll',
        'speed',
        'strength',
        'dexterity',
        'constitution',
        'intelligence',
        'wisdom',
        'charisma',
        'proficiencies',
        'damage_vulnerabilities',
        'damage_resistances',
        'damage_immunities',
        'condition_immunities',
        'senses',
        'languages',
        'challenge_rating',
        'proficiency_bonus',
        'xp',
        'special_abilities',
        'actions',
        'legendary_actions',
        'reactions',
        'source',
    ];

    protected $casts = [
        'desc'                      => 'array',
        'forms'                     => 'array',
        'armor_class'               => 'array',
        'speed'                     => 'array',
        'proficiencies'             => 'array',
        'damage_vulnerabilities'    => 'array',
        'damage_resistances'        => 'array',
        'damage_immunities'         => 'array',
        'condition_immunities'      => 'array',
        'senses'                    => 'array',
        'special_abilities'         => 'array',
        'actions'                   => 'array',
        'legendary_actions'         => 'array',
        'reactions'                 => 'array',
    ];


    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null; // or return a default placeholder image URL
        }

        // Base URL of the D&D 5e SRD API images
        $baseUrl = 'https://www.dnd5eapi.co';

        // If the stored image path already contains http(s), return as-is (optional)
        if (str_starts_with($this->image, 'http')) {
            return $this->image;
        }

        // Otherwise, prepend the base URL
        return $baseUrl . $this->image;
    }


    // Relationships
    public function spellcastingProfiles()
    {
        return $this->morphMany(
            SpellcastingProfile::class,
            'caster'
        );
    }

    public function combatants()
    {
        return $this->morphMany(
            Combatant::class,
            'combatantable'
        );
    }
}
