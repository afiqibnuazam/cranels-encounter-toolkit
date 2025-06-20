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
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Minus, Save } from 'lucide-react';
import {
    Spell,
    SpellSchool,
    AttackType,
    SpellComponent,
    DnDClass,
    CreateSpellRequest,
    SPELL_SCHOOLS,
    ATTACK_TYPES,
    SPELL_COMPONENTS
} from '@/types/spell';
import { useSpell, useSpells } from '@/hooks/useQueries';
import { castingTimeOptions, spellLevelOptions } from './options';
import { capitalizeWords } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';


const spellSchema = z.object({
    name: z.string().min(1, 'Spell name is required'),
    level: z.number().min(0).max(9),
    school: z.enum(SPELL_SCHOOLS),
    ritual: z.boolean(),
    concentration: z.boolean(),
    casting_time: z.string().min(1, 'Casting time is required'),
    duration: z.string().min(1, 'Duration is required'),
    range: z.string().min(1, 'Range is required'),
    attack_type: z.enum(ATTACK_TYPES).optional(),
    desc: z.array(z.string()),

    components: z.array(z.enum(SPELL_COMPONENTS)),
    material: z.string().optional(),
    source: z.string().optional(),
});

type SpellFormData = z.infer<typeof spellSchema>;

interface SpellFormProps {
    initialData?: Spell;
    onSubmit: (data: Partial<CreateSpellRequest>) => void;
    isSubmitting?: boolean;
    showPreview?: boolean;
    isEditing?: boolean;
    isCloning?: boolean;
}

const SpellForm = ({ initialData, onSubmit, isSubmitting, showPreview, isEditing, isCloning }: SpellFormProps) => {
    const [descParagraphs, setDescParagraphs] = useState<string[]>(['']);
    const [higherLevelParagraphs, setHigherLevelParagraphs] = useState<string[]>([]);
    const [selectedComponents, setSelectedComponents] = useState<SpellComponent[]>([]);
    const [selectedClasses, setSelectedClasses] = useState<DnDClass[]>([]);

    // Use TanStack Query to fetch spells for presets
    const { data: allSpells, isLoading: isLoadingPresets } = useSpells();

    // Filter only SRD spells for presets
    const srdSpells = allSpells?.filter(spell => spell.source?.includes('SRD') || spell.source?.includes('Basic Rules')) || [];

    const form = useForm<SpellFormData>({
        resolver: zodResolver(spellSchema),
        // defaultValues: {
        //     name: '',
        //     level: 0,
        //     school: SPELL_SCHOOLS[0],
        //     ritual: false,
        //     concentration: false,
        //     casting_time: '1 action',
        //     duration: 'Instantaneous',
        //     range: '60 feet',
        //     components: [],
        //     material: '',
        //     source: '',
        // },
    });

    // Initialize form with existing data if editing
    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name || '',
                level: initialData.level || 0,
                school: initialData.school || 'Evocation',
                ritual: initialData.ritual || false,
                concentration: initialData.concentration || false,
                casting_time: initialData.casting_time || '1 action',
                duration: initialData.duration || 'Instantaneous',
                range: initialData.range || '60 feet',
                attack_type: initialData.attack_type,
                components: initialData.components || [],
                material: initialData.material || '',
                source: initialData.source || '',
            });

            setDescParagraphs(initialData.desc || ['']);
            setHigherLevelParagraphs(initialData.higher_level || []);
            setSelectedComponents(initialData.components || []);
            // Handle classes array initialization
            if (initialData.classes) {
                const classNames = initialData.classes.map(c => c.name as DnDClass);
                setSelectedClasses(classNames);
            }
        }
    }, [initialData, form]);

    const handleFormSubmit = (data: SpellFormData) => {
        const spellData: Partial<CreateSpellRequest> = {
            index: data.name.toLowerCase().replace(/\s+/g, '-'),
            name: data.name,
            level: data.level,
            school: data.school,
            ritual: data.ritual,
            concentration: data.concentration,
            casting_time: data.casting_time,
            duration: data.duration,
            range: data.range,
            attack_type: data.attack_type,
            desc: descParagraphs.filter(p => p.trim() !== ''),
            higher_level: higherLevelParagraphs.filter(p => p.trim() !== ''),
            components: selectedComponents,
            material: data.material,
            classes: selectedClasses.map(className => ({
                index: className,
                name: className.charAt(0).toUpperCase() + className.slice(1),
                url: ''
            })),
            source: data.source,
        };

        onSubmit(spellData);
    };

    // Helper functions for arrays
    const addParagraph = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter(prev => [...prev, '']);
    };

    const removeParagraph = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
        setter(prev => prev.filter((_, i) => i !== index));
    };

    const updateParagraph = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
        setter(prev => prev.map((item, i) => i === index ? value : item));
    };

    // Component helpers
    const toggleComponent = (component: SpellComponent) => {
        const currentComponents = selectedComponents;
        const newComponents = currentComponents.includes(component)
            ? currentComponents.filter(c => c !== component)
            : [...currentComponents, component];

        form.setValue('components', newComponents);
        setSelectedComponents(newComponents);
    };

    // Class helpers
    const toggleClass = (className: DnDClass) => {
        setSelectedClasses(prev =>
            prev.includes(className)
                ? prev.filter(c => c !== className)
                : [...prev, className]
        );
    };

    // Load preset spell
    const loadPreset = async (spellIndex: string) => {
        if (!spellIndex) return;

        try {
            const selectedSpell = srdSpells.find(s => s.index === spellIndex);
            if (!selectedSpell) return;

            // const presetSpell = useSpell(spellIndex);

            form.reset({
                name: selectedSpell.name,
                level: selectedSpell.level || 0,
                school: selectedSpell.school || 'Evocation',
                ritual: false, // SpellSummary doesn't have this
                concentration: false, // SpellSummary doesn't have this
                casting_time: '1 action', // Default since SpellSummary doesn't have this
                duration: 'Instantaneous', // Default since SpellSummary doesn't have this
                range: '60 feet', // Default since SpellSummary doesn't have this
                attack_type: undefined, // SpellSummary doesn't have this
                components: [], // Default since SpellSummary doesn't have this
                material: '', // Default since SpellSummary doesn't have this
                source: selectedSpell.source || '',
            });

            // Reset to defaults since SpellSummary doesn't have detailed info
            setDescParagraphs(['']);
            setHigherLevelParagraphs([]);
            setSelectedComponents([]);
        } catch (error) {
            console.error('Error loading preset:', error);
        }
    };

    if (showPreview) {
        const currentFormData = form.getValues();
        const previewSpell: Spell = {
            id: initialData?.id || 0,
            user_id: initialData?.user_id || 0,
            index: initialData?.index || currentFormData.name.toLowerCase().replace(/\s+/g, '-'),
            name: currentFormData.name,
            level: currentFormData.level,
            school: currentFormData.school,
            ritual: currentFormData.ritual,
            concentration: currentFormData.concentration,
            casting_time: currentFormData.casting_time,
            duration: currentFormData.duration,
            range: currentFormData.range,
            attack_type: currentFormData.attack_type,
            desc: descParagraphs,
            higher_level: higherLevelParagraphs,
            components: selectedComponents,
            material: currentFormData.material,
            classes: selectedClasses.map(c => ({ index: c, name: c, url: '' })),
            source: currentFormData.source,
            created_at: initialData?.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        return (
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>{previewSpell.name}</CardTitle>
                        <CardDescription>
                            Level {previewSpell.level} {previewSpell.school} spell
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <strong>Casting Time:</strong> {capitalizeWords(previewSpell.casting_time as string)}
                            </div>
                            <div>
                                <strong>Range:</strong> {previewSpell.range}
                            </div>
                            <div>
                                <strong>Duration:</strong> {previewSpell.duration}
                            </div>
                        </div>

                        <div className="text-sm">
                            <strong>Components:</strong> {previewSpell.components?.join(', ')}
                            {previewSpell.material && ` (${previewSpell.material})`}
                        </div>

                        {previewSpell.desc && previewSpell.desc.length > 0 && (
                            <div className="space-y-2">
                                {previewSpell.desc.map((paragraph, index) => (
                                    <p key={index} className="text-sm">{paragraph}</p>
                                ))}
                            </div>
                        )}

                        {previewSpell.higher_level && previewSpell.higher_level.length > 0 && (
                            <div className="space-y-2">
                                <strong className="text-sm">At Higher Levels:</strong>
                                {previewSpell.higher_level.map((paragraph, index) => (
                                    <p key={index} className="text-sm">{paragraph}</p>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }

    const oldForm = () => {
        return (
            <>
                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                        <TabsTrigger value="mechanics">Mechanics</TabsTrigger>
                        <TabsTrigger value="description">Description</TabsTrigger>
                        <TabsTrigger value="classes">Classes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                        {/* Preset Selector */}
                        {!isEditing && !isCloning && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Load Preset (Optional)</CardTitle>
                                    <CardDescription>
                                        Start with a preset from SRD spells
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <Label htmlFor="preset">Select SRD Spell Preset</Label>
                                        <Select onValueChange={loadPreset} disabled={isLoadingPresets}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={isLoadingPresets ? "Loading presets..." : "Choose a preset spell..."} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {srdSpells.map((spell) => (
                                                    <SelectItem key={spell.index} value={spell.index}>
                                                        {spell.name} (Level {spell.level})
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
                                        <Label htmlFor="name">Spell Name</Label>
                                        <Input
                                            id="name"
                                            {...form.register('name')}
                                            placeholder="Spell name"
                                        />
                                        {form.formState.errors.name && (
                                            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="level">Level</Label>
                                        <Select
                                            onValueChange={(value: string) => form.setValue('level', parseInt(value))}
                                            defaultValue={form.getValues('level')?.toString()}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {spellLevelOptions.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value.toString()}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="school">School of Magic</Label>
                                    <Select
                                        onValueChange={(value: string) => form.setValue('school', value as SpellSchool)}
                                        defaultValue={form.getValues('school')}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select school" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SPELL_SCHOOLS.map((school) => (
                                                <SelectItem key={school} value={school}>
                                                    {school}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="ritual"
                                            checked={form.watch('ritual')}
                                            onCheckedChange={(checked: boolean) => form.setValue('ritual', Boolean(checked))}
                                        />
                                        <Label htmlFor="ritual">Ritual</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="concentration"
                                            checked={form.watch('concentration')}
                                            onCheckedChange={(checked: boolean) => form.setValue('concentration', Boolean(checked))}
                                        />
                                        <Label htmlFor="concentration">Concentration</Label>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="source">Source (Optional)</Label>
                                    <Input
                                        id="source"
                                        {...form.register('source')}
                                        placeholder="e.g., Player's Handbook, Homebrew"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="mechanics" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Casting Mechanics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="casting_time">Casting Time</Label>
                                        <Select
                                            onValueChange={(value: string) => form.setValue('casting_time', value)}
                                            defaultValue={form.getValues('casting_time')}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select casting time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {castingTimeOptions.map(opt => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {form.getValues('casting_time') === 'custom' && (
                                            <Input
                                                className="mt-2"
                                                {...form.register('casting_time')}
                                                placeholder="Enter custom casting time"
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="duration">Duration</Label>
                                        <Select
                                            onValueChange={(value: string) => form.setValue('duration', value)}
                                            defaultValue={form.getValues('duration')}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select duration" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {/* {DURATIONS.map((duration) => (
                                                <SelectItem key={duration} value={duration}>
                                                    {duration}
                                                </SelectItem>
                                            ))} */}
                                                <SelectItem value="custom">Custom...</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {form.getValues('duration') === 'custom' && (
                                            <Input
                                                className="mt-2"
                                                {...form.register('duration')}
                                                placeholder="Enter custom duration"
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="range">Range</Label>
                                        <Select
                                            onValueChange={(value: string) => form.setValue('range', value)}
                                            defaultValue={form.getValues('range')}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select range" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {/* {RANGES.map((range) => (
                                                <SelectItem key={range} value={range}>
                                                    {range}
                                                </SelectItem>
                                            ))} */}
                                                <SelectItem value="custom">Custom...</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {form.getValues('range') === 'custom' && (
                                            <Input
                                                className="mt-2"
                                                {...form.register('range')}
                                                placeholder="Enter custom range"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="attack_type">Attack Type (Optional)</Label>
                                    <Select
                                        onValueChange={(value: string) => form.setValue('attack_type', value as AttackType)}
                                        defaultValue={form.getValues('attack_type') || 'none'}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select attack type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None</SelectItem>
                                            {ATTACK_TYPES.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Components</Label>
                                    <div className="flex space-x-4 mt-2">
                                        {SPELL_COMPONENTS.map((component) => (
                                            <div key={component} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={component}
                                                    checked={selectedComponents.includes(component)}
                                                    onCheckedChange={() => toggleComponent(component)}
                                                />
                                                <Label htmlFor={component}>
                                                    {component === 'V' ? 'Verbal' :
                                                        component === 'S' ? 'Somatic' : 'Material'}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {selectedComponents.includes('M') && (
                                    <div>
                                        <Label htmlFor="material">Material Components</Label>
                                        <Input
                                            id="material"
                                            {...form.register('material')}
                                            placeholder="Describe material components"
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="description" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Spell Description</CardTitle>
                                <CardDescription>
                                    Add paragraphs describing the spell&apos;s effects
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {descParagraphs.map((paragraph, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <Label>Paragraph {index + 1}</Label>
                                                {descParagraphs.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeParagraph(setDescParagraphs, index)}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                            <Textarea
                                                value={paragraph}
                                                onChange={(e) => updateParagraph(setDescParagraphs, index, e.target.value)}
                                                placeholder="Describe the spell's effects..."
                                                rows={3}
                                            />
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => addParagraph(setDescParagraphs)}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Paragraph
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>At Higher Levels (Optional)</CardTitle>
                                <CardDescription>
                                    Describe additional effects when cast at higher spell levels
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {higherLevelParagraphs.map((paragraph, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <Label>Higher Level Paragraph {index + 1}</Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeParagraph(setHigherLevelParagraphs, index)}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <Textarea
                                                value={paragraph}
                                                onChange={(e) => updateParagraph(setHigherLevelParagraphs, index, e.target.value)}
                                                placeholder="Describe additional effects at higher levels..."
                                                rows={2}
                                            />
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => addParagraph(setHigherLevelParagraphs)}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Higher Level Effect
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="classes" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Available Classes</CardTitle>
                                <CardDescription>
                                    Select which classes can cast this spell
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-4">
                                    {/* {DND_CLASSES.map((className) => (
                                    <div key={className} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={className}
                                            checked={selectedClasses.includes(className)}
                                            onCheckedChange={() => toggleClass(className)}
                                        />
                                        <Label htmlFor={className}>
                                            {className.charAt(0).toUpperCase() + className.slice(1)}
                                        </Label>
                                    </div>
                                ))} */}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="submit" disabled={isSubmitting}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'Saving...' : isEditing ? 'Update Spell' : 'Create Spell'}
                    </Button>
                </div>
            </>
        )
    }

    const newForm = () => {
        return (
            <div className="flex flex-col gap-6">
                <div className="flex flex-row gap-4">
                    <div className="w-1/2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase">Spell Name<span className="text-red-700">*</span></FormLabel>
                                    <FormControl>
                                        <Input className="h-12 rounded-none" placeholder="Enter spell name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="w-1/4">
                        <FormField
                            control={form.control}
                            name="source"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase">Source (Optional)</FormLabel>
                                    <FormControl>
                                        <Input className="h-12 rounded-none" placeholder="e.g., Player's Handbook, Homebrew" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="w-1/8">
                        <FormField
                            control={form.control}
                            name="level"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="uppercase">Spell Level<span className="text-red-700">*</span></FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                                        <FormControl >
                                            <SelectTrigger className="w-full !h-12 rounded-none">
                                                <SelectValue placeholder="-" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {spellLevelOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value.toString()}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="w-1/8">
                        <FormField
                            control={form.control}
                            name="school"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase">Spell School<span className="text-red-700">*</span></FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full !h-12 rounded-none">
                                                <SelectValue placeholder="-" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {SPELL_SCHOOLS.map((school) => (
                                                <SelectItem key={school} value={school}>
                                                    {school}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex flex-row gap-4">
                    <div className="w-1/8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase">Casting Time<span className="text-red-700">*</span></FormLabel>
                                    <FormControl>
                                        <Input className="h-12 rounded-none" placeholder="#" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="w-1/4">
                        <FormField
                            control={form.control}
                            name="school"
                            render={({ field }) => (
                                <FormItem className="h-full">
                                    <FormLabel className="uppercase sr-only">Casting Time Option</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full !h-12 rounded-none mt-auto">
                                                <SelectValue placeholder="-" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {castingTimeOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="w-5/8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase">Reaction Casting Time Description<span className="text-red-700">*</span></FormLabel>
                                    <FormControl>
                                        <Input className="h-12 rounded-none" placeholder="Enter the reaction condition description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="flex flex-row gap-4">
                    <div className="w-1/8">
                        <FormField
                            control={form.control}
                            name="components"
                            render={() => (
                                <FormItem className="h-full">
                                    <FormLabel className="uppercase">Components</FormLabel>
                                    <FormControl>
                                        <ToggleGroup variant="outline" size="lg" type="multiple" className="mt-auto w-full">
                                            <div className="grid grid-cols-3 gap-1 w-full">
                                                {SPELL_COMPONENTS.map((component) => (
                                                    <ToggleGroupItem
                                                        key={component}
                                                        value={component}
                                                        aria-label={`Toggle ${component}`}
                                                        className="h-12 !rounded-none cursor-pointer !border-1"
                                                    >
                                                        <span className="text-lg font-semibold">{component}</span>
                                                    </ToggleGroupItem>
                                                ))}
                                            </div>
                                        </ToggleGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="w-7/8">
                        <FormField
                            control={form.control}
                            name="material"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase">Material Components Description<span className="text-red-700">*</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            className="h-12 rounded-none"
                                            placeholder="Enter the material components description"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="w-full">
                    <FormField
                        control={form.control}
                        name="desc"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase">Description<span className="text-red-700">*</span></FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="min-h-48 rounded-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                {newForm()}
            </form>
        </Form>
    );
};

export default SpellForm;
