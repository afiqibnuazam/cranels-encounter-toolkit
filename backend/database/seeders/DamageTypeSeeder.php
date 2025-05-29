<?php

namespace Database\Seeders;

use App\Models\DamageType;
use Illuminate\Database\Seeder;
use App\Services\Srd\Dnd5eApiService;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DamageTypeSeeder extends Seeder
{
    protected Dnd5eApiService $api;

    public function __construct()
    {
        $this->api = app(Dnd5eApiService::class);
    }
    
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $damageTypes = $this->api->getDamageTypeIndex();

        if (empty($damageTypes)) {
            $this->command->warn('No damage types found to seed.');
        } else {
            foreach ($damageTypes as $damageType) {
                $detail = $this->api->getDamageTypeDetail($damageType['index']);

                if (!$detail) {
                    $this->command->warn("Failed to fetch detail for: {$damageType['name']}");
                    continue;
                }

                DamageType::updateOrCreate(
                    [
                        'index' => $detail['index'],
                    ],
                    [
                        'name'  => $detail['name'],
                        'desc'  => $detail['desc'] ?? [],
                    ]
                );

                $this->command->info("Seeded: {$detail['name']}");
            }
        }
    }
}
