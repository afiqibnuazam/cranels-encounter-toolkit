<?php

namespace App\Enums;

enum AbilityScore: string
{
    case STRENGTH = 'str';
    case DEXTERITY = 'dex';
    case CONSTITUTION = 'con';
    case INTELLIGENCE = 'int';
    case WISDOM = 'wis';
    case CHARISMA = 'cha';

    public function getFullName(): string
    {
        return match($this) {
            self::STRENGTH => 'Strength',
            self::DEXTERITY => 'Dexterity',
            self::CONSTITUTION => 'Constitution',
            self::INTELLIGENCE => 'Intelligence',
            self::WISDOM => 'Wisdom',
            self::CHARISMA => 'Charisma',
        };
    }

    public static function fromString(string $value): ?self
    {
        return self::tryFrom(strtolower($value));
    }

    public static function getValidValues(): array
    {
        return array_column(self::cases(), 'value');
    }
} 