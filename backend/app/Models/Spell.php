<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Spell extends Model
{
    protected $fillable = [
        'user_id',
        'index',
        'name',
        'level',
        'school',
        'ritual',
        'concentration',
        'casting_time',
        'duration',
        'range',
        'attack_type',
        'desc',
        'higher_level',
        'components',
        'material',
        'area_of_effect',
        'damage',
        'dc',
        'heal_at_slot_level',
        'classes',
        'subclasses',
        'source',
        'cloned_from',
    ];

    protected $casts = [
        'ritual'                => 'boolean',
        'concentration'         => 'boolean',
        'desc'                  => 'array',
        'higher_level'          => 'array',
        'components'            => 'array',
        'area_of_effect'        => 'array',
        'damage'                => 'array',
        'dc'                    => 'array',
        'heal_at_slot_level'    => 'array',
        'classes'               => 'array',
        'subclasses'            => 'array',
    ];


    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function spellcastingProfiles()
    {
        return $this->morphToMany(
            SpellcastingProfile::class,
            'spellable',
            'spellcasting_profile_spells',
        );
    }

    public function tags()
    {
        return $this->morphToMany(
            Tag::class,
            'taggable',
        );
    }
}
