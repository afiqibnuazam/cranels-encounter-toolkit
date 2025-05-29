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
        Schema::create('spellcasting_profile_spells', function (Blueprint $table) {
            $table->id();
            $table->foreignId('spellcasting_profile_id')->constrained('spellcasting_profiles')->onDelete('cascade');
            $table->morphs('spellable');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spellcasting_profile_spells');
    }
};
