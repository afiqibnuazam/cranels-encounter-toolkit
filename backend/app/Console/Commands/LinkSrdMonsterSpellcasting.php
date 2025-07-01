<?php

namespace App\Console\Commands;

use App\Models\SrdSpell;
use App\Models\SrdMonster;
use Illuminate\Console\Command;

class LinkSrdMonsterSpellcasting extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:link-srd-monster-spellcasting';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Link SRD monsters to their spellcasting profiles';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $monsters = SrdMonster::all();
        $count = 0;

        foreach ($monsters as $monster) {
            // Skip if monster already has spellcasting profiles
            if ($monster->spellcastingProfiles()->count() > 0) {
                $this->info("Skipping {$monster->name} - already has spellcasting profiles");
                continue;
            }

            $abilities = $monster->special_abilities ?? [];

            foreach ($abilities as $ability) {
                if (
                    isset($ability['name']) &&
                    (str_contains(strtolower($ability['name']), 'spellcasting'))
                ) {
                    $profileData = $ability['spellcasting'] ?? null;
                    
                    if (!$profileData) {
                        $this->warn("No structured spellcasting data for: {$monster->name}");
                        continue;
                    }

                    // Create the spellcasting profile
                    $profile = $monster->spellcastingProfiles()->create([
                        'ability'               => $profileData['ability']['index'] ?? null,
                        'level'                 => $profileData['level'] ?? null,
                        'dc'                    => $profileData['dc'] ?? null,
                        'modifier'              => $profileData['modifier'] ?? null,
                        'components_required'   => $profileData['components_required'] ?? [],
                        'school'                => $profileData['school'] ?? null,
                        'slots'                 => $profileData['slots'] ?? [],
                    ]);

                    // Link spells (assume $profile->srdSpells() is a morphToMany relation)
                    if (isset($profileData['spells']) && is_array($profileData['spells'])) {
                        foreach ($profileData['spells'] as $spellInfo) {
                            // Lookup SRD spell by name (case-insensitive)
                            $srdSpell = SrdSpell::whereRaw('LOWER(name) = ?', [strtolower($spellInfo['name'])])->first();
                            if ($srdSpell) {
                                $profile->srdSpells()->syncWithoutDetaching([$srdSpell->id]);
                                $this->info("Linked spell '{$srdSpell->name}' to '{$monster->name}'");
                            } else {
                                $this->warn("Could not find spell '{$spellInfo['name']}' for monster '{$monster->name}'");
                            }
                        }
                    }

                    $count++;
                }
            }
        }

        $this->info("Linked spellcasting profiles to {$count} monsters.");
    }
}
