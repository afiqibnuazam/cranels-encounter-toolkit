<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Condition extends Model
{
    protected $fillable = [
        'index',
        'name',
        'desc',
    ];

    protected $casts = [
        'desc' => 'array',
    ];


public function effects()
    {
        return $this->hasMany(Effect::class);
    }
}
