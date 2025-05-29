<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            ['name' => 'buff', 'description' => 'Enhances a target’s attributes or defenses.'],
            ['name' => 'debuff', 'description' => 'Applies negative effects to enemies.'],
            ['name' => 'healing', 'description' => 'Restores hit points.'],
            ['name' => 'damage', 'description' => 'Inflicts damage to targets.'],
        ];

        foreach ($tags as $tag) {
            Tag::firstOrCreate(['name' => $tag['name']], $tag);
        }
    }
}
