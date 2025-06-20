<?php

namespace App\Http\Controllers\Api;

use App\Models\Unit;
use App\Enums\UnitType;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Controllers\Controller;
use App\Models\SrdMonster;

class MonsterController extends Controller
{
    /**
     * Display all custom monsters combined with SRD monsters without pagination (for backward compatibility).
     */
    public function all(Request $request)
    {
        // Fetch SRD monsters
        $srdQuery = SrdMonster::select([
            'id',
            'index',
            'name',
            'image',
            'type',
            'challenge_rating',
            'source'
        ]);

        $srdMonsters = $srdQuery->get()->map(function ($m) {
            return [
                'id' => $m->id,
                'index' => $m->index,
                'name' => $m->name,
                'image_url' => $m->image_url,
                'type' => $m->type,
                'challenge_rating' => $m->challenge_rating,
                'source' => $m->source ?? 'SRD',
                'data_source' => 'srd',
            ];
        });

        // Fetch custom monsters for authenticated user
        $customMonsters = collect();
        if ($request->user()) {
            $customQuery = Unit::where('user_id', $request->user()->id)
                ->ofType(UnitType::MONSTER)
                ->select([
                    'id',
                    'index',
                    'name',
                    'type',
                    'challenge_rating',
                    'source'
                ])
                ->get()
                ->map(function ($m) {
                    return [
                        'id' => $m->id,
                        'index' => $m->index,
                        'name' => $m->name,
                        'image_url' => $m->getFirstMediaUrl('avatar') ?: null,
                        'type' => $m->type,
                        'challenge_rating' => $m->challenge_rating,
                        'source' => $m->source ?? 'Custom',
                        'data_source' => 'custom',
                    ];
                });
            $customMonsters = $customQuery;
        }

        // Merge and sort
        $allMonsters = $srdMonsters->merge($customMonsters)->sortBy('name')->values();

        return response()->json($allMonsters);
    }

    /**
     * Display a listing of custom monsters (units with unit_type = monster) combined with SRD monsters.
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 50);
        $page = $request->get('page', 1);

        // Fetch SRD monsters
        $srdQuery = SrdMonster::select([
            'id',
            'index',
            'name',
            'image',
            'type',
            'challenge_rating',
            'source'
        ]);

        $srdMonsters = $srdQuery->get()->map(function ($m) {
            return [
                'id' => $m->id,
                'index' => $m->index,
                'name' => $m->name,
                'image_url' => $m->image_url,
                'type' => $m->type,
                'challenge_rating' => $m->challenge_rating,
                'source' => $m->source ?? 'SRD',
                'data_source' => 'srd',
            ];
        });

        // Fetch custom monsters for authenticated user
        $customMonsters = collect();
        if ($request->user()) {
            $customQuery = Unit::where('user_id', $request->user()->id)
                ->ofType(UnitType::MONSTER)
                ->select([
                    'id',
                    'index',
                    'name',
                    'type',
                    'challenge_rating',
                    'source'
                ])
                ->get()
                ->map(function ($m) {
                    return [
                        'id' => $m->id,
                        'index' => $m->index,
                        'name' => $m->name,
                        'image_url' => $m->getFirstMediaUrl('avatar') ?: null,
                        'type' => $m->type,
                        'challenge_rating' => $m->challenge_rating,
                        'source' => $m->source ?? 'Custom',
                        'data_source' => 'custom',
                    ];
                });
            $customMonsters = $customQuery;
        }

        // Merge and sort
        $allMonsters = $srdMonsters->merge($customMonsters)->sortBy('name')->values();

        // Paginate manually
        $total = $allMonsters->count();
        $items = $allMonsters->forPage($page, $perPage)->values();

        $lastPage = (int) ceil($total / $perPage);

        return response()->json([
            'data' => $items,
            'current_page' => (int) $page,
            'last_page' => $lastPage,
            'per_page' => (int) $perPage,
            'total' => $total,
            'has_more' => $page < $lastPage,
            'next_page' => $page < $lastPage ? $page + 1 : null,
        ]);
    }

    /**
     * Store a newly created custom monster in storage.
     */
    public function store(Request $request)
    {
        // TODO: test this
        // Create new Unit with unit_type = MONSTER and user_id = authenticated user
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'challenge_rating' => 'required|numeric|min:0|max:30',
            'armor_class' => 'required|integer|min:1|max:30',
            'hit_points' => 'required|integer|min:1|max:999',
            'hit_dice' => 'nullable|string|max:50',
            'speed' => 'nullable|json',
            'strength' => 'required|integer|min:1|max:30',
            'dexterity' => 'required|integer|min:1|max:30',
            'constitution' => 'required|integer|min:1|max:30',
            'intelligence' => 'required|integer|min:1|max:30',
            'wisdom' => 'required|integer|min:1|max:30',
            'charisma' => 'required|integer|min:1|max:30',
            'saving_throws' => 'nullable|json',
            'skills' => 'nullable|json',
            'damage_vulnerabilities' => 'nullable|string',
            'damage_resistances' => 'nullable|string',
            'damage_immunities' => 'nullable|string',
            'condition_immunities' => 'nullable|string',
            'senses' => 'nullable|string',
            'languages' => 'nullable|string',
            'proficiency_bonus' => 'nullable|integer|min:2|max:9',
            'special_abilities' => 'nullable|json',
            'actions' => 'nullable|json',
            'legendary_actions' => 'nullable|json',
            'mythic_actions' => 'nullable|json',
            'reactions' => 'nullable|json',
            'lair_actions' => 'nullable|json',
            'regional_effects' => 'nullable|json',
            'source' => 'nullable|string|max:100',
            'description' => 'nullable|text',
            // Image validation
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
        ]);

        // Generate unique index for the monster
        $baseIndex = Str::slug($validated['name']);
        $index = $baseIndex;
        $counter = 1;

        // Ensure unique index across all units for this user
        while (Unit::where('user_id', $request->user()->id)
            ->where('index', $index)
            ->exists()
        ) {
            $index = $baseIndex . '-' . $counter;
            $counter++;
        }

        // Remove avatar from validated data as we'll handle it separately
        $avatarFile = $validated['avatar'] ?? null;
        unset($validated['avatar']);

        // Create the monster
        $monster = Unit::create([
            'user_id' => $request->user()->id,
            'unit_type' => UnitType::MONSTER,
            'index' => $index,
            ...$validated,
            'source' => $validated['source'] ?? 'Custom'
        ]);

        // Handle single display image upload
        if ($avatarFile) {
            $monster->addMediaFromRequest('avatar')
                ->toMediaCollection('avatar');
        }

        // Return monster with image URL
        $monsterData = $monster->toArray();
        $monsterData['image_url'] = $monster->getFirstMediaUrl('avatar') ?: null;

        return response()->json([
            'message' => 'Monster created successfully',
            'monster' => $monsterData
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified custom monster with all attributes.
     */
    public function show(string $index, Request $request)
    {
        $monster = Unit::where('user_id', $request->user()->id)
            ->ofType(UnitType::MONSTER)
            ->where('index', $index)
            ->firstOrFail();

        // TODO: test this
        // Add display image URL to response
        $monsterData = $monster->toArray();
        $monsterData['image_url'] = $monster->getFirstMediaUrl('avatar') ?: null;

        return response()->json($monsterData);
    }

    /**
     * Update the specified custom monster in storage.
     */
    public function update(Request $request, string $id)
    {
        // TODO: test this
        // Find the monster and validate ownership
        $monster = Unit::where('user_id', $request->user()->id)
            ->ofType(UnitType::MONSTER)
            ->where('id', $id)
            ->firstOrFail();

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|string|max:100',
            'challenge_rating' => 'sometimes|required|numeric|min:0|max:30',
            'armor_class' => 'sometimes|required|integer|min:1|max:30',
            'hit_points' => 'sometimes|required|integer|min:1|max:999',
            'hit_dice' => 'nullable|string|max:50',
            'speed' => 'nullable|json',
            'strength' => 'sometimes|required|integer|min:1|max:30',
            'dexterity' => 'sometimes|required|integer|min:1|max:30',
            'constitution' => 'sometimes|required|integer|min:1|max:30',
            'intelligence' => 'sometimes|required|integer|min:1|max:30',
            'wisdom' => 'sometimes|required|integer|min:1|max:30',
            'charisma' => 'sometimes|required|integer|min:1|max:30',
            'saving_throws' => 'nullable|json',
            'skills' => 'nullable|json',
            'damage_vulnerabilities' => 'nullable|string',
            'damage_resistances' => 'nullable|string',
            'damage_immunities' => 'nullable|string',
            'condition_immunities' => 'nullable|string',
            'senses' => 'nullable|string',
            'languages' => 'nullable|string',
            'proficiency_bonus' => 'nullable|integer|min:2|max:9',
            'special_abilities' => 'nullable|json',
            'actions' => 'nullable|json',
            'legendary_actions' => 'nullable|json',
            'mythic_actions' => 'nullable|json',
            'reactions' => 'nullable|json',
            'lair_actions' => 'nullable|json',
            'regional_effects' => 'nullable|json',
            'source' => 'nullable|string|max:100',
            'description' => 'nullable|text',
            // Single display image
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'remove_avatar' => 'nullable|boolean', // Option to remove display image
        ]);

        // If name is being updated, potentially update index too
        if (isset($validated['name']) && $validated['name'] !== $monster->name) {
            $baseIndex = Str::slug($validated['name']);
            $index = $baseIndex;
            $counter = 1;

            // Ensure unique index (excluding current monster)
            while (Unit::where('user_id', $request->user()->id)
                ->where('index', $index)
                ->where('id', '!=', $monster->id)
                ->exists()
            ) {
                $index = $baseIndex . '-' . $counter;
                $counter++;
            }

            $validated['index'] = $index;
        }

        // Handle avatar removal
        if ($request->boolean('remove_avatar')) {
            $monster->clearMediaCollection('avatar');
        }

        // Handle new avatar upload
        if ($request->hasFile('avatar')) {
            // Remove old avatar first (single image)
            $monster->clearMediaCollection('avatar');

            // Add new avatar
            $monster->addMediaFromRequest('avatar')
                ->toMediaCollection('avatar');
        }

        // Remove avatar-related fields from update data
        unset($validated['avatar'], $validated['remove_avatar']);

        $monster->update($validated);

        // Return updated monster with image URL
        $monsterData = $monster->fresh()->toArray();
        $monsterData['image_url'] = $monster->getFirstMediaUrl('avatar') ?: null;

        return response()->json([
            'message' => 'Monster updated successfully',
            'monster' => $monsterData
        ]);
    }

    /**
     * Remove the specified custom monster from storage.
     */
    public function destroy(string $id, Request $request)
    {
        // TODO: test this
        // Find the monster and validate ownership
        $monster = Unit::where('user_id', $request->user()->id)
            ->ofType(UnitType::MONSTER)
            ->where('id', $id)
            ->firstOrFail();

        // Check if monster is used in any encounters
        $encountersCount = $monster->combatants()->count();

        if ($encountersCount > 0) {
            return response()->json([
                'error' => 'Cannot delete monster that is used in encounters',
                'encounters_count' => $encountersCount
            ], Response::HTTP_CONFLICT);
        }

        $monsterName = $monster->name;

        // Delete associated display image
        $monster->clearMediaCollection('avatar');

        // Delete the monster
        $monster->delete();

        return response()->json([
            'message' => "Monster '{$monsterName}' deleted successfully"
        ]);
    }
}
