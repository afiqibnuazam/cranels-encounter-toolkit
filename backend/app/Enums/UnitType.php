<?php

namespace App\Enums;

enum UnitType: string
{
    case MONSTER = 'monster';
    case PLAYER_CHARACTER = 'player_character';
    case ALLIED_NPC = 'allied_npc';
    case ENEMY_NPC = 'enemy_npc';
}
