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
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('index')->unique();
            $table->string('name');
            $table->string('unit_type');
            
            // Shared Attributes
            $table->json('desc')->nullable();               // array of strings
            $table->string('size');
            $table->string('type')->nullable();
            $table->string('subtype')->nullable();
            $table->json('forms')->nullable();              // array of objects
            $table->string('alignment')->nullable();
            $table->json('armor_class')->nullable();        // array of objects
            $table->unsignedSmallInteger('hit_points');
            $table->string('hit_dice')->nullable();
            $table->string('hit_points_roll')->nullable();
            $table->json('speed')->nullable();              // object
            
            $table->tinyInteger('strength');
            $table->tinyInteger('dexterity');
            $table->tinyInteger('constitution');
            $table->tinyInteger('intelligence');
            $table->tinyInteger('wisdom');
            $table->tinyInteger('charisma');
            $table->json('proficiencies')->nullable();          // array of objects

            $table->json('damage_vulnerabilities')->nullable(); // array of strings
            $table->json('damage_resistances')->nullable();     // array of strings
            $table->json('damage_immunities')->nullable();      // array of strings
            $table->json('condition_immunities')->nullable();   // array of objects

            $table->json('senses')->nullable();                 // object
            $table->string('languages')->nullable();
            $table->unsignedTinyInteger('proficiency_bonus')->nullable();

            $table->json('special_abilities')->nullable();      // array of objects (Traits)
            $table->json('actions')->nullable();                // array of objects
            $table->json('legendary_actions')->nullable();      // array of objects
            $table->json('reactions')->nullable();              // array of objects

            // Conditional Fields
            $table->float('challenge_rating')->nullable();
            $table->unsignedInteger('xp')->nullable();
            $table->string('class')->nullable();
            $table->string('level')->nullable();

            // Source tracking
            $table->string('source')->default('custom'); // 'srd' or 'custom'
            $table->string('cloned_from')->nullable();          // SRD index of the original unit if this is a clone

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
