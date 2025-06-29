<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('combatants', function (Blueprint $table) {
            // Combat state tracking
            $table->string('index')->unique()->after('encounter_id');
            $table->json('used_spell_slots')->nullable()->after('armor_class');
            $table->boolean('action_used')->default(false)->after('used_spell_slots');
            $table->boolean('bonus_action_used')->default(false)->after('action_used');
            $table->boolean('reaction_used')->default(false)->after('bonus_action_used');
            $table->integer('legendary_actions_used')->default(0)->after('reaction_used');
        });
    }

    public function down(): void
    {
        Schema::table('combatants', function (Blueprint $table) {
            $table->dropColumn([
                'used_spell_slots',
                'action_used', 
                'bonus_action_used',
                'reaction_used',
                'legendary_actions_used'
            ]);
        });
    }
}; 