<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $fillable = [
        'name',
        'description'
    ];


    public function spells()
    {
        return $this->morphedByMany(
            Spell::class,
            'taggable',
        );
    }

    public function srdSpells()
    {
        return $this->morphedByMany(
            SrdSpell::class,
            'taggable',
        );
    }
}
