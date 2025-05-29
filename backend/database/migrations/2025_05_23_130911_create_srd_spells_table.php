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
        Schema::create('srd_spells', function (Blueprint $table) {
            $table->id();
            $table->string('index')->unique();
            $table->string('name');
            $table->unsignedTinyInteger('level');
            $table->string('school');
            $table->boolean('ritual')->default(false);
            $table->boolean('concentration')->default(false);
            $table->string('casting_time')->nullable();
            $table->string('duration')->nullable();
            $table->string('range')->nullable();
            $table->string('attack_type')->nullable();
            
            $table->json('desc')->nullable();
            $table->json('higher_level')->nullable();
            $table->json('components')->nullable();
            $table->string('material')->nullable();
            $table->json('area_of_effect')->nullable();
            $table->json('damage')->nullable();
            $table->json('dc')->nullable();
            $table->json('heal_at_slot_level')->nullable();
            $table->json('classes')->nullable();
            $table->json('subclasses')->nullable();

            $table->string('source')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('srd_spells');
    }
};
