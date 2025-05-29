<?php

namespace App\Models;

use App\Enums\EncounterStatus;
use Illuminate\Database\Eloquent\Model;

class Encounter extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'folder_name',
        'notes',
        'current_turn_id',
        'current_round',
        'status'
    ];

    protected $casts = [
        'status' => EncounterStatus::class,
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function combatants()
    {
        return $this->hasMany(Combatant::class);
    }

    public function currentTurn()
    {
        return $this->belongsTo(Combatant::class, 'current_turn_id');
    }
}
