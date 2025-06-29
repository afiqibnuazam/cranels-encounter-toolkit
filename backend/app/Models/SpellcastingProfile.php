<?php

namespace App\Models;

use App\Enums\AbilityScore;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

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

    // Accessor for ability to ensure it's a valid ability score
    protected function ability(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => $value,
            set: function (string $value) {
                $abilityScore = AbilityScore::fromString($value);
                if (!$abilityScore) {
                    throw new \InvalidArgumentException("Invalid ability score: {$value}");
                }
                return $abilityScore->value;
            }
        );
    }

    // Helper method to get the full ability name
    public function getAbilityNameAttribute(): string
    {
        $abilityScore = AbilityScore::fromString($this->ability);
        return $abilityScore?->getFullName() ?? $this->ability;
    }

    // Validation helper
    public static function getValidAbilities(): array
    {
        return AbilityScore::getValidValues();
    }

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
