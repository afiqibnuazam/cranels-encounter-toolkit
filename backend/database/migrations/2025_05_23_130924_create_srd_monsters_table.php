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
        Schema::create('srd_monsters', function (Blueprint $table) {
            $table->id();
            $table->string('index')->unique();
            $table->string('name');
            $table->json('desc')->nullable();
            $table->string('image')->nullable();
            
            $table->string('size');
            $table->string('type')->nullable();
            $table->string('subtype')->nullable();
            $table->json('forms')->nullable();
            $table->string('alignment')->nullable();
            $table->json('armor_class')->nullable();
            $table->unsignedSmallInteger('hit_points');
            $table->string('hit_dice')->nullable();
            $table->string('hit_points_roll')->nullable();
            $table->json('speed')->nullable();
            
            $table->tinyInteger('strength');
            $table->tinyInteger('dexterity');
            $table->tinyInteger('constitution');
            $table->tinyInteger('intelligence');
            $table->tinyInteger('wisdom');
            $table->tinyInteger('charisma');
            $table->json('proficiencies')->nullable();
            
            $table->json('damage_vulnerabilities')->nullable();
            $table->json('damage_resistances')->nullable();
            $table->json('damage_immunities')->nullable();
            $table->json('condition_immunities')->nullable();

            $table->json('senses')->nullable();
            $table->string('languages')->nullable();
            $table->float('challenge_rating')->nullable();
            $table->unsignedTinyInteger('proficiency_bonus')->nullable();
            $table->unsignedInteger('xp')->nullable();

            $table->json('special_abilities')->nullable();
            $table->json('actions')->nullable();
            $table->json('legendary_actions')->nullable();
            $table->json('reactions')->nullable();

            $table->string('source')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('srd_monsters');
    }
};
