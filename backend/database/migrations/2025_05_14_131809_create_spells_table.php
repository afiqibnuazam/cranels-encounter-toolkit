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
        Schema::create('spells', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('index')->unique();          // e.g., 'fireball', 'magic-missile', 'healing-word'
            $table->string('name');                     // e.g., 'Fireball', 'Magic Missile', 'Healing Word'
            $table->unsignedTinyInteger('level');       // 0-9
            $table->string('school');                   // e.g., 'Abjuration', 'Conjuration', 'Divination', 'Enchantment', 'Evocation', 'Illusion', 'Necromancy', 'Transmutation'
            $table->boolean('ritual')
                ->default(false);
            $table->boolean('concentration')
                ->default(false);
            $table->string('casting_time')->nullable(); // e.g., '1 action', '1 bonus action', '1 reaction', '1 minute', '10 minutes', '1 hour', '8 hours'
            $table->string('duration')->nullable();     // e.g., 'instantaneous', '1 minute', '10 minutes', '1 hour', '8 hours', '24 hours', 'until dispelled'
            $table->string('range')->nullable();        // e.g., 'self', 'touch', '30 feet', '60 feet', '120 feet', '10 miles'
            $table->string(column: 'attack_type')->nullable();  // e.g., 'melee', 'ranged'
            
            // JSON fields
            $table->json('desc')->nullable();               // Paragraphs of text
            $table->json('higher_level')->nullable();       // Optional extra effects when cast at higher levels
            $table->json('components')->nullable();         //  ['V', 'S', 'M']
            $table->string('material')->nullable();         // Optional material component
            $table->json('area_of_effect')->nullable();     // type + size (e.g., 'sphere', 'cube', 'line', 'cone', 'cylinder') and radius
            $table->json('damage')->nullable();             // damage scaling
            $table->json('dc')->nullable();                 // Difficulty Class (DC) for saving throws
            $table->json('heal_at_slot_level')->nullable(); // healing scaling
            $table->json('classes')->nullable();            // applicable classes (e.g., 'wizard', 'sorcerer', 'cleric', 'druid', 'bard', 'warlock', 'paladin', 'ranger')
            $table->json('subclasses')->nullable();         // subclass references
            
            // Source tracking
            $table->string('source')->nullable();       // e.g., 'Basic Rules (2014)', 'Player's Handbook (2014)'
            $table->string('cloned_from')->nullable();  // SRD index of the original spell if this is a clone

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spells');
    }
};
