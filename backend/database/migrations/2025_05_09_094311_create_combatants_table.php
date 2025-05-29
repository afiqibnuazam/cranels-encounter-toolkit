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
        Schema::create('combatants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('encounter_id')->constrained('encounters')->onDelete('cascade');
            $table->morphs('combatantable');
            $table->unsignedTinyInteger('initiative')->default(0);
            $table->string('name')->unique();
            $table->unsignedTinyInteger('current_hit_points');
            $table->unsignedTinyInteger('max_hit_points');
            $table->unsignedTinyInteger('temporary_hit_points')->default(0);
            $table->tinyInteger('armor_class')->default(10);
            $table->timestamps();
        });
    }

    /** 
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('combatants');
    }
};
