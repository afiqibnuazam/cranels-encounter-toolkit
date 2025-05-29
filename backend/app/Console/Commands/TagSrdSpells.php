<?php

namespace App\Console\Commands;

use App\Models\Tag;
use App\Models\SrdSpell;
use Illuminate\Console\Command;

class TagSrdSpells extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:tag-srd-spells';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Assign tags to SRD spells';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $buffs = [
            'aid',
            'barkskin',
            'beacon-of-hope',
            'bless',
            'darkvision',
            'death-ward',
            'enhance-ability',
            'enlarge-reduce',
            'etherealness',
            'false-life',
            'fire-shield',
            'foresight',
            'freedom-of-movement',
            'gaseous-form',
            'greater-invisibility',
            'guidance',
            'guiding-bolt',
            'hallow',
            'haste',
            'heroes-feast',
            'heroism',
            'holy-aura',
            'invisibility',
            'longstrider',
            'mage-armor',
            'magic-weapon',
            'mind-blank',
            'pass-without-trace',
            'protection-from-energy',
            'protection-from-evil-and-good',
            'protection-from-poison',
            'remove-curse',
            'resistance',
            'sanctuary',
            'shield-of-faith',
            'shillelagh',
            'spider-climb',
            'stoneskin',
            'true-polymorph',
            'warding-bond',
            'water-breathing',
            'wind-walk',
            'wish',
        ];

        $debuffs = [
            'bane',
            'bestow-curse',
            'blindness/deafness',
            'contagion',
            'dispel-evil-and-good',
            'divine-word',
            'eyebite',
            'faerie-fire',
            'fear',
            'feeblemind',
            'flesh-to-stone',
            'foresight',
            'hallow',
            'harm',
            'heat-metal',
            'hideous-laughter',
            'holy-aura',
            'hunters-mark',
            'magic-circle',
            'irresistible-dance',
            'protection-from-evil-and-good',
            'ray-of-enfeeblement',
            'slow',
            'storm-of-vengeance',
            'sunbeam',
            'sunburst',
            'symbol',
            'vicious-mockery',
        ];

        $healing = [
            'cure-wounds',
            'goodberry',
            'greater-restoration',
            'heal',
            'healing-word',
            'lesser-restoration',
            'mass-cure-wounds',
            'mass-heal',
            'mass-healing-word',
            'prayer-of-healing',
            'raise-dead',
            'regenerate',
            'reincarnate',
            'resurrection',
            'revivify',
            'spare-the-dying',
            'true-resurrection',
            'vampiric-touch',
            'wish',
        ];

        $damage = [
            'acid-arrow',
            'acid-splash',
            'animate-objects',
            'arcane-hand',
            'black-tentacles',
            'blade-barrier',
            'blight',
            'branding-smite',
            'burning-hands',
            'call-lightning',
            'chain-lightning',
            'chill-touch',
            'circle-of-death',
            'cloudkill',
            'cone-of-cold',
            'delayed-blast-fireball',
            'disintegrate',
            'divine-favor',
            'dream',
            'earthquake',
            'eldritch-blast',
            'faithful-hound',
            'finger-of-death',
            'fire-bolt',
            'fire-shield',
            'fire-storm',
            'fireball',
            'flame-blade',
            'flame-strike',
            'flaming-sphere',
            'freezing-sphere',
            'glyph-of-warding',
            'guiding-bolt',
            'harm',
            'heat-metal',
            'hellish-rebuke',
            'hunters-mark',
            'ice-storm',
            'incendiary-cloud',
            'inflict-wounds',
            'insect-plague',
            'lightning-bolt',
            'magic-missile',
            'meteor-swarm',
            'moonbeam',
            'phantasmal-killer',
            'poison-spray',
            'power-word-kill',
            'prismatic-spray',
            'prismatic-wall',
            'produce-flame',
            'ray-of-frost',
            'sacred-flame',
            'scorching-ray',
            'shatter',
            'shillelagh',
            'shocking-grasp',
            'spike-growth',
            'spirit-guardians',
            'spiritual-weapon',
            'storm-of-vengeance',
            'sunbeam',
            'sunburst',
            'symbol',
            'thunderwave',
            'vampiric-touch',
            'vicious-mockery',
            'wall-of-fire',
            'wall-of-ice',
            'wall-of-thorns',
            'weird',
            'wind-wall',
        ];

        $buffTag = Tag::where('name', 'buff')->first();
        $debuffTag = Tag::where('name', 'debuff')->first();
        $healingTag = Tag::where('name', 'healing')->first();
        $damageTag = Tag::where('name', 'damage')->first();

        if (!$buffTag || !$debuffTag || !$healingTag || !$damageTag) {
            $this->error('One or more tags (buff, debuff, healing, damage) are missing in the tags table.');
            return;
        } else {
            foreach ($buffs as $index) {
                $spell = SrdSpell::where('index', $index)->first();
                if ($spell) {
                    $spell->tags()->syncWithoutDetaching([$buffTag->id]);
                    $this->info("Tagged: $index with buff");
                }
            }

            foreach ($debuffs as $index) {
                $spell = SrdSpell::where('index', $index)->first();
                if ($spell) {
                    $spell->tags()->syncWithoutDetaching([$debuffTag->id]);
                    $this->info("Tagged: $index with debuff");
                }
            }

            foreach ($healing as $index) {
                $spell = SrdSpell::where('index', $index)->first();
                if ($spell) {
                    $spell->tags()->syncWithoutDetaching([$healingTag->id]);
                    $this->info("Tagged: $index with healing");
                }
            }

            foreach ($damage as $index) {
                $spell = SrdSpell::where('index', $index)->first();
                if ($spell) {
                    $spell->tags()->syncWithoutDetaching([$damageTag->id]);
                    $this->info("Tagged: $index with damage");
                }
            }

            $this->info('✅ Tagging complete!');
        }
    }
}
