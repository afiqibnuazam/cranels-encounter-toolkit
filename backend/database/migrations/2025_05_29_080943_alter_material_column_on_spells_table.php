<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Schema::table('spells', function (Blueprint $table) {
        //     $table->text('material')->nullable()->change();
        // });

        // Schema::table('srd_spells', function (Blueprint $table) {
        //     $table->text('material')->nullable()->change();
        // });

        DB::statement('ALTER TABLE spells ALTER COLUMN material TYPE text;');
        DB::statement('ALTER TABLE spells ALTER COLUMN material DROP NOT NULL;');
        DB::statement('ALTER TABLE srd_spells ALTER COLUMN material TYPE text;');
        DB::statement('ALTER TABLE srd_spells ALTER COLUMN material DROP NOT NULL;');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::table('spells', function (Blueprint $table) {
        //     $table->string('material')->nullable()->change();
        // });

        // Schema::table('srd_spells', function (Blueprint $table) {
        //     $table->string('material')->nullable()->change();
        // });

        DB::statement('ALTER TABLE spells ALTER COLUMN material TYPE varchar(255);');
        DB::statement('ALTER TABLE srd_spells ALTER COLUMN material TYPE varchar(255);');
    }
};
