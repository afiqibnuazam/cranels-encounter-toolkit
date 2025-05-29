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
        Schema::create('encounters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->string('folder_name')->nullable(); // Optional folder name for organizing encounters
            $table->text('notes')->nullable(); // Additional notes for the encounter
            $table->foreignId('current_turn_id')->nullable(); // link to Combatant
            $table->unsignedTinyInteger('current_round')->default(1);
            $table->enum('status', ['draft', 'active', 'completed'])->default('draft'); // Status of the encounter (draft, active, completed)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('encounters');
    }
};
