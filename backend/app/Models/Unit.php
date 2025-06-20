<?php

namespace App\Models;

use App\Enums\UnitType;
use Spatie\MediaLibrary\HasMedia;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Unit extends Model implements HasMedia
{
    use InteractsWithMedia;
    
    protected $fillable = [
        'user_id',
        'index',
        'name',
        'unit_type',
        'desc',
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
        'proficiency_bonus',
        'special_abilities',
        'actions',
        'legendary_actions',
        'reactions',
        'challenge_rating',
        'xp',
        'class',
        'level',
        'source',
        'cloned_from',
    ];

    protected $casts = [
        'unit_type'                 => UnitType::class,
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

    
    public function isMonster()
    {
        return $this->unit_type === UnitType::MONSTER;
    }

    public function isCharacter(): bool
    {
        return in_array($this->type, [
            UnitType::PLAYER_CHARACTER,
            UnitType::ALLIED_NPC,
            UnitType::ENEMY_NPC,
        ]);
    }

    public function isPlayerCharacter()
    {
        return $this->unit_type === UnitType::PLAYER_CHARACTER;
    }
    public function isAlliedNpc()
    {
        return $this->unit_type === UnitType::ALLIED_NPC;
    }
    public function isEnemyNpc()
    {
        return $this->unit_type === UnitType::ENEMY_NPC;
    }

    protected function scopeOfType($query, $type): Builder
    {
        return $query->where('unit_type', $type);
    }

    protected function scopeOfTypes($query, array $types): Builder
    {
        return $query->whereIn('unit_type', $types);
    }


    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(300)
            ->height(300)
            ->sharpen(10)
            ->performOnCollections('avatar');
    }
    

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

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
