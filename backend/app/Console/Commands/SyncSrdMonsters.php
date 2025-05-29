<?php

namespace App\Console\Commands;

use App\Models\SrdMonster;
use App\Services\Srd\Dnd5eApiService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class SyncSrdMonsters extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-srd-monsters';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch and cache all D&D 5e SRD monsters into the local database';

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
        $this->info('Fetching SRD monster list...');
        $list = $this->api->getMonsterIndex();

        foreach ($list as $item) {
            $data = $this->api->getMonsterDetail($item['index']);

            if (!$data) {
                $this->warn("Failed to fetch: {$item['index']}");
                continue;
            }

            SrdMonster::updateOrCreate(
                [
                    'index' => $data['index'],
                ],
                [
                    'name'  => $data['name'] ?? '',
                    'desc'  => $data['desc'] ?? [],
                    'image' => $data['image'] ?? '',

                    'size'              => $data['size'] ?? '',
                    'type'              => $data['type'] ?? '',
                    'subtype'           => $data['subtype'] ?? null,
                    'forms'             => $data['forms'] ?? null,
                    'alignment'         => $data['alignment'] ?? '',
                    'armor_class'       => $data['armor_class'] ?? [],
                    'hit_points'        => $data['hit_points'] ?? 0,
                    'hit_dice'          => $data['hit_dice'] ?? '',
                    'hit_points_roll'   => $data['hit_points_roll'] ?? '',
                    'speed'             => $data['speed'] ?? null,

                    'strength'      => $data['strength'] ?? 0,
                    'dexterity'     => $data['dexterity'] ?? 0,
                    'constitution'  => $data['constitution'] ?? 0,
                    'intelligence'  => $data['intelligence'] ?? 0,
                    'wisdom'        => $data['wisdom'] ?? 0,
                    'charisma'      => $data['charisma'] ?? 0,
                    'proficiencies' => $data['proficiencies'] ?? [],

                    'damage_vulnerabilities'    => $data['damage_vulnerabilities'] ?? [],
                    'damage_resistances'        => $data['damage_resistances'] ?? [],
                    'damage_immunities'         => $data['damage_immunities'] ?? [],
                    'condition_immunities'      => $data['condition_immunities'] ?? [],

                    'senses'            => $data['senses'] ?? null,
                    'languages'         => $data['languages'] ?? '',
                    'challenge_rating'  => $data['challenge_rating'] ?? 0,
                    'proficiency_bonus' => $data['proficiency_bonus'] ?? 0,
                    'xp'                => $data['xp'] ?? 0,

                    'special_abilities' => $data['special_abilities'] ?? [],
                    'actions'           => $data['actions'] ?? [],
                    'legendary_actions' => $data['legendary_actions'] ?? [],
                    'reactions'         => $data['reactions'] ?? [],

                    'source' => 'Basic Rules (2014)',
                ]
            );

            $this->info("Synced: {$data['name']}");
        }

        $this->info('✅ SRD Monsters synced successfully!');
    }
}
