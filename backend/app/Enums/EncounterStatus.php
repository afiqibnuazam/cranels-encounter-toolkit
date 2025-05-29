<?php

namespace App\Enums;

enum EncounterStatus: string
{
    case Draft = 'draft';
    case Active = 'active';
    case Completed = 'completed';
}
