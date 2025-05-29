<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpellcastingProfile extends Model
{
    protected $fillable = [
        'ability',
        'level',
        'dc',
        'modifier',
        'components_required',
        'school',
        'slots',
    ];

    protected $casts = [
        'components_required' => 'array',
        'slots'               => 'array',
    ];


    // Relationships
    public function caster()
    {
        return $this->morphTo();
    }

    public function spells()
    {
        return $this->morphedByMany(
            Spell::class,
            'spellable',
            'spellcasting_profile_spells'
        );
    }

    public function srdSpells()
    {
        return $this->morphedByMany(
            SrdSpell::class,
            'spellable',
            'spellcasting_profile_spells'
        );
    }
}
