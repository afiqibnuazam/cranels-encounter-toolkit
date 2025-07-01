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
        Schema::table('combatants', function (Blueprint $table) {
            $table->json('used_spell_casts')->nullable()->after('used_spell_slots');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('combatants', function (Blueprint $table) {
            $table->dropColumn('used_spell_casts');
        });
    }
};
