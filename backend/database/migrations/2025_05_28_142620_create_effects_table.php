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
        Schema::create('effects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('combatant_id')->constrained('combatants')->onDelete('cascade');
            $table->foreignId('condition_id')->nullable()->constrained('conditions')->nullOnDelete(); // Nullable for non-condition effects
            $table->morphs('source_spellable');
            $table->foreignId('caster_combatant_id')->nullable()->constrained('combatants')->nullOnDelete();
            $table->string('name');
            $table->text('desc')->nullable(); // Description of the effect
            
            $table->unsignedTinyInteger('duration')->nullable();                    // Duration in rounds, null for permanent effects
            $table->unsignedBigInteger('turn_reference_combatant_id')->nullable();  // Combatant ID for turn reference, null if not applicable
            $table->enum('turn_timing', ['start', 'end'])->nullable();      // whether check is at start/end of that combatant's turn
            
            $table->string('save_type')->nullable(); // Type of save required to resist the effect (e.g., "CON", "WIS")
            $table->unsignedTinyInteger('save_dc')->nullable(); // Save DC if applicable
            $table->boolean('concentration')->default(false); // If true, ends if caster loses concentration

            $table->timestamp('applied_at')->nullable(); // When the effect was applied
            $table->timestamp('expires_at')->nullable(); // Optional, when the effect expires
            $table->string('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('effects');
    }
};
