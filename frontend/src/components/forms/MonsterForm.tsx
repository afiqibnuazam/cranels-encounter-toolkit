"use client"

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Save } from 'lucide-react';
import { 
    Monster, 
    MonsterSize, 
    MonsterType, 
    MonsterAlignment
} from '@/types/monster';
import MonsterPreview from './MonsterPreview';
import { useMonsters } from '@/hooks/useQueries';

// Common D&D damage types
const DAMAGE_TYPES = [
    'acid', 'bludgeoning', 'cold', 'fire', 'force', 'lightning', 
    'necrotic', 'piercing', 'poison', 'psychic', 'radiant', 'slashing', 
    'thunder'
] as const;

// Common D&D conditions
const CONDITIONS = [
    'blinded', 'charmed', 'deafened', 'exhaustion', 'frightened', 
    'grappled', 'incapacitated', 'invisible', 'paralyzed', 'petrified', 
    'poisoned', 'prone', 'restrained', 'stunned', 'unconscious'
] as const;

// Type helper functions
const isDamageType = (value: string): value is typeof DAMAGE_TYPES[number] => {
    return DAMAGE_TYPES.includes(value as typeof DAMAGE_TYPES[number]);
};

const isCondition = (value: string): value is typeof CONDITIONS[number] => {
    return CONDITIONS.includes(value as typeof CONDITIONS[number]);
};

const monsterSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    size: z.nativeEnum(MonsterSize),
    type: z.nativeEnum(MonsterType).or(z.string().min(1, 'Type is required')),
    subtype: z.string().optional(),
    alignment: z.nativeEnum(MonsterAlignment).or(z.string().min(1, 'Alignment is required')),
    armor_class: z.number().min(1).max(30),
    hit_points: z.number().min(1),
    hit_dice: z.string().optional(),
    speed: z.string().min(1, 'Speed is required'),
    strength: z.number().min(1).max(30),
    dexterity: z.number().min(1).max(30),
    constitution: z.number().min(1).max(30),
    intelligence: z.number().min(1).max(30),
    wisdom: z.number().min(1).max(30),
    charisma: z.number().min(1).max(30),
    challenge_rating: z.number().min(0),
    xp: z.number().min(0).optional(),
    proficiency_bonus: z.number().min(2).max(9).optional(),
    damage_vulnerabilities: z.array(z.string()).optional(),
    damage_resistances: z.array(z.string()).optional(),
    damage_immunities: z.array(z.string()).optional(),
    condition_immunities: z.array(z.string()).optional(),
    senses: z.string().optional(),
    languages: z.string().optional(),
});

type MonsterFormData = z.infer<typeof monsterSchema>;

interface MonsterFormProps {
    initialData?: Monster;
    onSubmit: (data: Partial<Monster>) => void;
    isSubmitting?: boolean;
    showPreview?: boolean;
    isEditing?: boolean;
    isCloning?: boolean;
}

const MonsterForm = ({ initialData, onSubmit, isSubmitting, showPreview, isEditing, isCloning }: MonsterFormProps) => {
    const [specialAbilities, setSpecialAbilities] = useState<Array<{ name: string; desc: string[] }>>([]);
    const [actions, setActions] = useState<Array<{ name: string; desc: string[] }>>([]);
    const [legendaryActions, setLegendaryActions] = useState<Array<{ name: string; desc: string[] }>>([]);
    const [damageVulnerabilities, setDamageVulnerabilities] = useState<string[]>([]);
    const [damageResistances, setDamageResistances] = useState<string[]>([]);
    const [damageImmunities, setDamageImmunities] = useState<string[]>([]);
    const [conditionImmunities, setConditionImmunities] = useState<string[]>([]);

    // Use TanStack Query to fetch monsters
    const { data: allMonsters, isLoading: isLoadingPresets } = useMonsters();

    // Filter only SRD monsters for presets
    const srdMonsters = allMonsters?.filter(monster => monster.data_source === 'srd') || [];

    const form = useForm<MonsterFormData>({
        resolver: zodResolver(monsterSchema),
        defaultValues: {
            name: '',
            size: MonsterSize.Medium,
            type: '',
            subtype: '',
            alignment: '',
            armor_class: 10,
            hit_points: 1,
            hit_dice: '',
            speed: '30 ft.',
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10,
            challenge_rating: 0,
            xp: 0,
            proficiency_bonus: 2,
            senses: '',
            languages: '',
        },
    });

    // Helper function to convert size string to MonsterSize enum
    const convertToMonsterSize = (size: string | MonsterSize): MonsterSize => {
        if (Object.values(MonsterSize).includes(size as MonsterSize)) {
            return size as MonsterSize;
        }
        // Convert string to enum by matching the capitalized form
        const sizeMap: Record<string, MonsterSize> = {
            'tiny': MonsterSize.Tiny,
            'small': MonsterSize.Small,
            'medium': MonsterSize.Medium,
            'large': MonsterSize.Large,
            'huge': MonsterSize.Huge,
            'gargantuan': MonsterSize.Gargantuan,
            'Tiny': MonsterSize.Tiny,
            'Small': MonsterSize.Small,
            'Medium': MonsterSize.Medium,
            'Large': MonsterSize.Large,
            'Huge': MonsterSize.Huge,
            'Gargantuan': MonsterSize.Gargantuan,
        };
        return sizeMap[size] || MonsterSize.Medium;
    };

    // Initialize form with existing data if editing
    useEffect(() => {
        if (initialData) {
            const armorClassValue = Array.isArray(initialData.armor_class) 
                ? initialData.armor_class[0]?.value || 10 
                : initialData.armor_class || 10;

            form.reset({
                name: initialData.name || '',
                size: convertToMonsterSize(initialData.size),
                type: initialData.type || '',
                subtype: initialData.subtype || '',
                alignment: initialData.alignment || '',
                armor_class: armorClassValue,
                hit_points: initialData.hit_points || 1,
                hit_dice: initialData.hit_dice || '',
                speed: typeof initialData.speed === 'object' && initialData.speed?.walk 
                    ? `${initialData.speed.walk} ft.` 
                    : initialData.speed as string || '30 ft.',
                strength: initialData.strength || 10,
                dexterity: initialData.dexterity || 10,
                constitution: initialData.constitution || 10,
                intelligence: initialData.intelligence || 10,
                wisdom: initialData.wisdom || 10,
                charisma: initialData.charisma || 10,
                challenge_rating: initialData.challenge_rating || 0,
                xp: initialData.xp || 0,
                proficiency_bonus: initialData.proficiency_bonus || 2,
                senses: typeof initialData.senses === 'object' 
                    ? Object.entries(initialData.senses).map(([key, value]) => `${key} ${value}`).join(', ')
                    : initialData.senses || '',
                languages: initialData.languages || '',
            });

            setSpecialAbilities(initialData.special_abilities || []);
            setActions(initialData.actions || []);
            setLegendaryActions(initialData.legendary_actions || []);
            setDamageVulnerabilities(initialData.damage_vulnerabilities || []);
            setDamageResistances(initialData.damage_resistances || []);
            setDamageImmunities(initialData.damage_immunities || []);
            setConditionImmunities(initialData.condition_immunities?.map(c => typeof c === 'string' ? c : c.name) || []);
        }
    }, [initialData, form]);

    const handleFormSubmit = (data: MonsterFormData) => {
        const monsterData: Partial<Monster> = {
            ...data,
            armor_class: [{ type: 'natural', value: data.armor_class }],
            speed: { walk: parseInt(data.speed.replace(/\D/g, '')) || 30 },
            senses: data.senses ? { 'passive perception': 10 } : undefined,
            special_abilities: specialAbilities.length > 0 ? specialAbilities : undefined,
            actions: actions.length > 0 ? actions : undefined,
            legendary_actions: legendaryActions.length > 0 ? legendaryActions : undefined,
            damage_vulnerabilities: damageVulnerabilities.length > 0 ? damageVulnerabilities : undefined,
            damage_resistances: damageResistances.length > 0 ? damageResistances : undefined,
            damage_immunities: damageImmunities.length > 0 ? damageImmunities : undefined,
            condition_immunities: conditionImmunities.length > 0 
                ? conditionImmunities.map(name => ({ index: name.toLowerCase().replace(/\s+/g, '-'), name, url: '' }))
                : undefined,
        };

        onSubmit(monsterData);
    };

    const addStringToArray = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
        setter(prev => [...prev, value]);
    };

    const removeStringFromArray = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
        setter(prev => prev.filter((_, i) => i !== index));
    };

    const updateStringInArray = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
        setter(prev => prev.map((item, i) => i === index ? value : item));
    };

    const addAbilityToArray = (setter: React.Dispatch<React.SetStateAction<Array<{ name: string; desc: string[] }>>>, value: { name: string; desc: string[] }) => {
        setter(prev => [...prev, value]);
    };

    const removeAbilityFromArray = (setter: React.Dispatch<React.SetStateAction<Array<{ name: string; desc: string[] }>>>, index: number) => {
        setter(prev => prev.filter((_, i) => i !== index));
    };

    const updateAbilityInArray = (setter: React.Dispatch<React.SetStateAction<Array<{ name: string; desc: string[] }>>>, index: number, value: { name: string; desc: string[] }) => {
        setter(prev => prev.map((item, i) => i === index ? value : item));
    };

    const loadPreset = async (monsterIndex: string) => {
        if (!monsterIndex) return;
        
        try {
            // Find the monster in our loaded data first
            const selectedMonster = srdMonsters.find(m => m.index === monsterIndex);
            if (!selectedMonster) return;

            // Use the API to get full monster details
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/srd-monsters/${monsterIndex}`);
            const presetMonster = await response.json();
            
            // Load preset data into form
            const armorClassValue = Array.isArray(presetMonster.armor_class) 
                ? presetMonster.armor_class[0]?.value || 10 
                : presetMonster.armor_class || 10;

            form.reset({
                name: presetMonster.name,
                size: convertToMonsterSize(presetMonster.size),
                type: presetMonster.type || '',
                subtype: presetMonster.subtype || '',
                alignment: presetMonster.alignment || '',
                armor_class: armorClassValue,
                hit_points: presetMonster.hit_points || 1,
                hit_dice: presetMonster.hit_dice || '',
                speed: typeof presetMonster.speed === 'object' && presetMonster.speed?.walk 
                    ? `${presetMonster.speed.walk} ft.` 
                    : presetMonster.speed as string || '30 ft.',
                strength: presetMonster.strength || 10,
                dexterity: presetMonster.dexterity || 10,
                constitution: presetMonster.constitution || 10,
                intelligence: presetMonster.intelligence || 10,
                wisdom: presetMonster.wisdom || 10,
                charisma: presetMonster.charisma || 10,
                challenge_rating: presetMonster.challenge_rating || 0,
                xp: presetMonster.xp || 0,
                proficiency_bonus: presetMonster.proficiency_bonus || 2,
                senses: typeof presetMonster.senses === 'object' 
                    ? Object.entries(presetMonster.senses).map(([key, value]) => `${key} ${value}`).join(', ')
                    : presetMonster.senses || '',
                languages: presetMonster.languages || '',
            });

            setSpecialAbilities(presetMonster.special_abilities || []);
            setActions(presetMonster.actions || []);
            setLegendaryActions(presetMonster.legendary_actions || []);
            setDamageVulnerabilities(presetMonster.damage_vulnerabilities || []);
            setDamageResistances(presetMonster.damage_resistances || []);
            setDamageImmunities(presetMonster.damage_immunities || []);
            setConditionImmunities(presetMonster.condition_immunities?.map((c: string | { name: string }) => typeof c === 'string' ? c : c.name) || []);
        } catch (error) {
            console.error('Error loading preset:', error);
        }
    };

    if (showPreview) {
        const currentFormData = form.getValues();
        const previewMonster: Monster = {
            id: initialData?.id || 0,
            index: initialData?.index || currentFormData.name.toLowerCase().replace(/\s+/g, '-'),
            ...currentFormData,
            armor_class: [{ type: 'natural', value: currentFormData.armor_class }],
            speed: { walk: parseInt(currentFormData.speed.replace(/\D/g, '')) || 30 },
            special_abilities: specialAbilities,
            actions: actions,
            legendary_actions: legendaryActions,
            damage_vulnerabilities: damageVulnerabilities,
            damage_resistances: damageResistances,
            damage_immunities: damageImmunities,
            condition_immunities: conditionImmunities.map(name => ({ index: name.toLowerCase().replace(/\s+/g, '-'), name, url: '' })),
        } as Monster;

        return <MonsterPreview monster={previewMonster} />;
    }

    return (
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                    <TabsTrigger value="defenses">Defenses</TabsTrigger>
                    <TabsTrigger value="abilities">Abilities</TabsTrigger>
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                    {/* Preset Selector (only for new monsters, not editing or cloning) */}
                    {!isEditing && !isCloning && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Load Preset (Optional)</CardTitle>
                                <CardDescription>
                                    Start with a preset from SRD monsters
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <Label htmlFor="preset">Select SRD Monster Preset</Label>
                                    <Select onValueChange={loadPreset} disabled={isLoadingPresets}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={isLoadingPresets ? "Loading presets..." : "Choose a preset monster..."} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {srdMonsters.map((monster) => (
                                                <SelectItem key={monster.index} value={monster.index}>
                                                    {monster.name} (CR {monster.challenge_rating || 0})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        {...form.register('name')}
                                        placeholder="Monster name"
                                    />
                                    {form.formState.errors.name && (
                                        <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="size">Size</Label>
                                    <Select 
                                        onValueChange={(value: string) => form.setValue('size', convertToMonsterSize(value))}
                                        defaultValue={form.getValues('size')}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={MonsterSize.Tiny}>Tiny</SelectItem>
                                            <SelectItem value={MonsterSize.Small}>Small</SelectItem>
                                            <SelectItem value={MonsterSize.Medium}>Medium</SelectItem>
                                            <SelectItem value={MonsterSize.Large}>Large</SelectItem>
                                            <SelectItem value={MonsterSize.Huge}>Huge</SelectItem>
                                            <SelectItem value={MonsterSize.Gargantuan}>Gargantuan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="type">Type</Label>
                                    <Select
                                        onValueChange={(value: string) => form.setValue('type', value)}
                                        defaultValue={form.getValues('type')}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select creature type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(MonsterType).map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                </SelectItem>
                                            ))}
                                            <SelectItem value="custom">Custom Type...</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {form.getValues('type') === 'custom' && (
                                        <Input
                                            className="mt-2"
                                            {...form.register('type')}
                                            placeholder="Enter custom type"
                                        />
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="subtype">Subtype (Optional)</Label>
                                    <Input
                                        id="subtype"
                                        {...form.register('subtype')}
                                        placeholder="e.g., elf, orc"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="alignment">Alignment</Label>
                                <Select
                                    onValueChange={(value: string) => form.setValue('alignment', value)}
                                    defaultValue={form.getValues('alignment')}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select alignment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(MonsterAlignment).map((alignment) => (
                                            <SelectItem key={alignment} value={alignment}>
                                                {alignment.charAt(0).toUpperCase() + alignment.slice(1)}
                                            </SelectItem>
                                        ))}
                                        <SelectItem value="custom">Custom Alignment...</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.getValues('alignment') === 'custom' && (
                                    <Input
                                        className="mt-2"
                                        {...form.register('alignment')}
                                        placeholder="Enter custom alignment"
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="stats" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Combat Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="armor_class">Armor Class</Label>
                                    <Input
                                        id="armor_class"
                                        type="number"
                                        {...form.register('armor_class', { valueAsNumber: true })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="hit_points">Hit Points</Label>
                                    <Input
                                        id="hit_points"
                                        type="number"
                                        {...form.register('hit_points', { valueAsNumber: true })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="hit_dice">Hit Dice (Optional)</Label>
                                    <Input
                                        id="hit_dice"
                                        {...form.register('hit_dice')}
                                        placeholder="e.g., 8d8 + 16"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="speed">Speed</Label>
                                <Input
                                    id="speed"
                                    {...form.register('speed')}
                                    placeholder="e.g., 30 ft., fly 60 ft."
                                />
                            </div>

                            <Separator />

                            <div>
                                <Label>Ability Scores</Label>
                                <div className="grid grid-cols-6 gap-4 mt-2">
                                    <div>
                                        <Label htmlFor="strength" className="text-sm">STR</Label>
                                        <Input
                                            id="strength"
                                            type="number"
                                            min="1"
                                            max="30"
                                            {...form.register('strength', { valueAsNumber: true })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="dexterity" className="text-sm">DEX</Label>
                                        <Input
                                            id="dexterity"
                                            type="number"
                                            min="1"
                                            max="30"
                                            {...form.register('dexterity', { valueAsNumber: true })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="constitution" className="text-sm">CON</Label>
                                        <Input
                                            id="constitution"
                                            type="number"
                                            min="1"
                                            max="30"
                                            {...form.register('constitution', { valueAsNumber: true })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="intelligence" className="text-sm">INT</Label>
                                        <Input
                                            id="intelligence"
                                            type="number"
                                            min="1"
                                            max="30"
                                            {...form.register('intelligence', { valueAsNumber: true })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="wisdom" className="text-sm">WIS</Label>
                                        <Input
                                            id="wisdom"
                                            type="number"
                                            min="1"
                                            max="30"
                                            {...form.register('wisdom', { valueAsNumber: true })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="charisma" className="text-sm">CHA</Label>
                                        <Input
                                            id="charisma"
                                            type="number"
                                            min="1"
                                            max="30"
                                            {...form.register('charisma', { valueAsNumber: true })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="challenge_rating">Challenge Rating</Label>
                                    <Input
                                        id="challenge_rating"
                                        type="number"
                                        step="0.125"
                                        min="0"
                                        {...form.register('challenge_rating', { valueAsNumber: true })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="xp">Experience Points</Label>
                                    <Input
                                        id="xp"
                                        type="number"
                                        {...form.register('xp', { valueAsNumber: true })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="defenses" className="space-y-4">
                    {/* Damage Vulnerabilities */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Damage Vulnerabilities</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {damageVulnerabilities.map((vuln, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Select
                                            onValueChange={(value) => {
                                                if (value === 'custom') {
                                                    // Keep the current input for custom entry
                                                    return;
                                                }
                                                updateStringInArray(setDamageVulnerabilities, index, value);
                                            }}
                                            value={isDamageType(vuln) ? vuln : 'custom'}
                                        >
                                            <SelectTrigger className="flex-1">
                                                <SelectValue placeholder="Select damage type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DAMAGE_TYPES.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </SelectItem>
                                                ))}
                                                <SelectItem value="custom">Custom...</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {!isDamageType(vuln) && (
                                            <Input
                                                className="flex-1"
                                                value={vuln}
                                                onChange={(e) => updateStringInArray(setDamageVulnerabilities, index, e.target.value)}
                                                placeholder="Custom damage type"
                                            />
                                        )}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeStringFromArray(setDamageVulnerabilities, index)}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => addStringToArray(setDamageVulnerabilities, '')}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Vulnerability
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Similar cards for Resistances, Immunities, and Condition Immunities */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Damage Resistances</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {damageResistances.map((resist, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Select
                                            onValueChange={(value) => {
                                                if (value === 'custom') {
                                                    return;
                                                }
                                                updateStringInArray(setDamageResistances, index, value);
                                            }}
                                            value={isDamageType(resist) ? resist : 'custom'}
                                        >
                                            <SelectTrigger className="flex-1">
                                                <SelectValue placeholder="Select damage type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DAMAGE_TYPES.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </SelectItem>
                                                ))}
                                                <SelectItem value="custom">Custom...</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {!isDamageType(resist) && (
                                            <Input
                                                className="flex-1"
                                                value={resist}
                                                onChange={(e) => updateStringInArray(setDamageResistances, index, e.target.value)}
                                                placeholder="Custom damage type"
                                            />
                                        )}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeStringFromArray(setDamageResistances, index)}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => addStringToArray(setDamageResistances, '')}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Resistance
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Damage Immunities</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {damageImmunities.map((immunity, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Select
                                            onValueChange={(value) => {
                                                if (value === 'custom') {
                                                    return;
                                                }
                                                updateStringInArray(setDamageImmunities, index, value);
                                            }}
                                            value={isDamageType(immunity) ? immunity : 'custom'}
                                        >
                                            <SelectTrigger className="flex-1">
                                                <SelectValue placeholder="Select damage type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DAMAGE_TYPES.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </SelectItem>
                                                ))}
                                                <SelectItem value="custom">Custom...</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {!isDamageType(immunity) && (
                                            <Input
                                                className="flex-1"
                                                value={immunity}
                                                onChange={(e) => updateStringInArray(setDamageImmunities, index, e.target.value)}
                                                placeholder="Custom damage type"
                                            />
                                        )}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeStringFromArray(setDamageImmunities, index)}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => addStringToArray(setDamageImmunities, '')}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Immunity
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Condition Immunities</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {conditionImmunities.map((condition, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Select
                                            onValueChange={(value) => {
                                                if (value === 'custom') {
                                                    return;
                                                }
                                                updateStringInArray(setConditionImmunities, index, value);
                                            }}
                                            value={isCondition(condition) ? condition : 'custom'}
                                        >
                                            <SelectTrigger className="flex-1">
                                                <SelectValue placeholder="Select condition" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CONDITIONS.map((cond) => (
                                                    <SelectItem key={cond} value={cond}>
                                                        {cond.charAt(0).toUpperCase() + cond.slice(1)}
                                                    </SelectItem>
                                                ))}
                                                <SelectItem value="custom">Custom...</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {!isCondition(condition) && (
                                            <Input
                                                className="flex-1"
                                                value={condition}
                                                onChange={(e) => updateStringInArray(setConditionImmunities, index, e.target.value)}
                                                placeholder="Custom condition"
                                            />
                                        )}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeStringFromArray(setConditionImmunities, index)}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => addStringToArray(setConditionImmunities, '')}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Condition Immunity
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Senses & Languages</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="senses">Senses</Label>
                                <Input
                                    id="senses"
                                    {...form.register('senses')}
                                    placeholder="e.g., darkvision 60 ft., passive Perception 14"
                                />
                            </div>
                            <div>
                                <Label htmlFor="languages">Languages</Label>
                                <Input
                                    id="languages"
                                    {...form.register('languages')}
                                    placeholder="e.g., Common, Draconic"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="abilities" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Special Abilities</CardTitle>
                            <CardDescription>
                                Passive abilities that the monster has
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {specialAbilities.map((ability, index) => (
                                    <div key={index} className="space-y-2 p-4 border rounded">
                                        <div className="flex gap-2">
                                            <Input
                                                value={ability.name}
                                                onChange={(e) => updateAbilityInArray(setSpecialAbilities, index, { ...ability, name: e.target.value })}
                                                placeholder="Ability name"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => removeAbilityFromArray(setSpecialAbilities, index)}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Textarea
                                            value={Array.isArray(ability.desc) ? ability.desc.join(' ') : ability.desc}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateAbilityInArray(setSpecialAbilities, index, { ...ability, desc: [e.target.value] })}
                                            placeholder="Ability description"
                                            rows={3}
                                        />
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => addAbilityToArray(setSpecialAbilities, { name: '', desc: [''] })}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Special Ability
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="actions" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                            <CardDescription>
                                Actions the monster can take during combat
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {actions.map((action, index) => (
                                    <div key={index} className="space-y-2 p-4 border rounded">
                                        <div className="flex gap-2">
                                            <Input
                                                value={action.name}
                                                onChange={(e) => updateAbilityInArray(setActions, index, { ...action, name: e.target.value })}
                                                placeholder="Action name"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => removeAbilityFromArray(setActions, index)}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Textarea
                                            value={Array.isArray(action.desc) ? action.desc.join(' ') : action.desc}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateAbilityInArray(setActions, index, { ...action, desc: [e.target.value] })}
                                            placeholder="Action description"
                                            rows={3}
                                        />
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => addAbilityToArray(setActions, { name: '', desc: [''] })}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Action
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Legendary Actions</CardTitle>
                            <CardDescription>
                                Legendary actions the monster can take at the end of other creatures&apos; turns
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {legendaryActions.map((action, index) => (
                                    <div key={index} className="space-y-2 p-4 border rounded">
                                        <div className="flex gap-2">
                                            <Input
                                                value={action.name}
                                                onChange={(e) => updateAbilityInArray(setLegendaryActions, index, { ...action, name: e.target.value })}
                                                placeholder="Legendary action name"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => removeAbilityFromArray(setLegendaryActions, index)}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Textarea
                                            value={Array.isArray(action.desc) ? action.desc.join(' ') : action.desc}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateAbilityInArray(setLegendaryActions, index, { ...action, desc: [e.target.value] })}
                                            placeholder="Legendary action description"
                                            rows={3}
                                        />
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => addAbilityToArray(setLegendaryActions, { name: '', desc: [''] })}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Legendary Action
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Saving...' : isEditing ? 'Update Monster' : 'Create Monster'}
                </Button>
            </div>
        </form>
    );
};

export default MonsterForm;
