<?php

namespace App\Console\Commands;

use App\Models\SrdSpell;
use App\Services\Srd\Dnd5eApiService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class SyncSrdSpells extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-srd-spells';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch and cache all D&D 5e SRD spells into the local database';

    protected Dnd5eApiService $api;

    public function __construct()
    {
        parent::__construct();

        $this->api = app(Dnd5eApiService::class);
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Fetching SRD spell list...');
        $list = $this->api->getSpellIndex();

        foreach ($list as $item) {
            $data = $this->api->getSpellDetail($item['index']);

            if (!$data) {
                $this->warn("Failed to fetch: {$item['index']}");
                continue;
            }

            SrdSpell::updateOrCreate(
                [
                    'index' => $data['index']
                ],
                [
                    'name'          => $data['name'] ?? '',
                    'level'         => $data['level'] ?? 0,
                    'school'        => $data['school']['name'] ?? '',
                    'ritual'        => $data['ritual'] ?? false,
                    'concentration' => $data['concentration'] ?? false,
                    'casting_time'  => $data['casting_time'] ?? '',
                    'duration'      => $data['duration'] ?? '',
                    'range'         => $data['range'] ?? '',
                    'material'      => $data['material'] ?? null,
                    'attack_type'   => $data['attack_type'] ?? null,

                    'desc'                  => $data['desc'] ?? [],
                    'higher_level'          => $data['higher_level'] ?? [],
                    'components'            => $data['components'] ?? [],
                    'area_of_effect'        => $data['area_of_effect'] ?? null,
                    'damage'                => $data['damage'] ?? null,
                    'dc'                    => $data['dc'] ?? null,
                    'heal_at_slot_level'    => $data['heal_at_slot_level'] ?? null,
                    'classes'               => $data['classes'] ?? [],
                    'subclasses'            => $data['subclasses'] ?? [],

                    'source'                => 'Basic Rules (2014)',
                ]
            );

            $this->info("Synced: {$data['name']}");
        }

        $this->info('✅ SRD Spells synced successfully!');
    }
}
