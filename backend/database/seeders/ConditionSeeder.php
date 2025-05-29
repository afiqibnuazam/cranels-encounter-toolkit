<?php

namespace Database\Seeders;

use App\Models\Condition;
use App\Services\Srd\Dnd5eApiService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ConditionSeeder extends Seeder
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
        $conditions = $this->api->getConditionIndex();

        if (empty($conditions)) {
            $this->command->warn('No conditions found to seed.');
        } else {
            foreach ($conditions as $condition) {
                $detail = $this->api->getConditionDetail($condition['index']);

                if (!$detail) {
                    $this->command->warn("Failed to fetch detail for: {$condition['name']}");
                    continue;
                }

                Condition::updateOrCreate(
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
