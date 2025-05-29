<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('spellcasting_profiles', function (Blueprint $table) {
            $table->id();
            $table->morphs('caster');
            $table->string('ability');                          // e.g. "wis"
            $table->integer('level')->nullable();               // caster level
            $table->integer('dc');                              // spell save DC
            $table->integer('modifier')->nullable();            // spell attack bonus
            $table->json('components_required')->nullable();    // ["V", "S", "M"]
            $table->string('school')->nullable();               // e.g. cleric
            $table->json('slots')->nullable();                  // e.g. {"1":3}
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spellcasting_profiles');
    }
};
