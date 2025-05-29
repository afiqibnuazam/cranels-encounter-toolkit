<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DamageType extends Model
{
    protected $fillable = [
        'index',
        'name',
        'desc',
    ];

    protected $casts = [
        'desc' => 'array',
    ];
}
