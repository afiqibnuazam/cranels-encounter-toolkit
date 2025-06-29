<?php

namespace App\Http\Controllers\Api;

use App\Models\Encounter;
use App\Models\Combatant;
use Illuminate\Http\Request;
use App\Enums\EncounterStatus;
use App\Enums\UnitType;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EncounterController extends Controller
{
    /**
     * Display a listing of encounters for the authenticated user.
     * Only returns name, folder_name, and status for display (no filtering).
     */
    public function index(Request $request)
    {
        $encounters = Encounter::where('user_id', $request->user()->id)
            ->select([
                'id',
                'name',
                'folder_name',
                'status'
            ])
            ->get()
            ->map(fn ($e) => [
                'id'            => $e->id,
                'name'          => $e->name,
                'folder_name'   => $e->folder_name,
                'status'        => $e->status->value,
            ]);

        return response()->json($encounters);
    }

    /**
     * Get unique folder names for the authenticated user.
     */
    public function folders(Request $request)
    {
        $folders = Encounter::where('user_id', $request->user()->id)
            ->whereNotNull('folder_name')
            ->distinct()
            ->pluck('folder_name')
            ->sort()
            ->values();

        return response()->json($folders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'          => 'required|string',
            'folder_name'   => 'nullable|string',
            'notes'         => 'nullable|string',
            'status'        => ['sometimes', Rule::enum(EncounterStatus::class)],
            'current_round' => 'sometimes|integer|min:0',
            'current_turn_index' => 'sometimes|string|nullable',
            'combatants'    => 'sometimes|array',
            'combatants.*.index' => 'required|string',
            'combatants.*.unit_type' => ['required', Rule::enum(UnitType::class)],
            'combatants.*.initiative' => 'required|integer',
            'combatants.*.name' => 'required|string',
            'combatants.*.current_hit_points' => 'required|integer|min:0',
            'combatants.*.max_hit_points' => 'required|integer|min:1',
            'combatants.*.temporary_hit_points' => 'sometimes|integer|min:0',
            'combatants.*.armor_class' => 'required|integer|min:1',
            'combatants.*.used_spell_slots' => 'sometimes|array',
            'combatants.*.action_used' => 'sometimes|boolean',
            'combatants.*.bonus_action_used' => 'sometimes|boolean',
            'combatants.*.reaction_used' => 'sometimes|boolean',
            'combatants.*.legendary_actions_used' => 'sometimes|integer|min:0',
            'combatants.*.combatantable_type' => 'sometimes|string|nullable',
            'combatants.*.combatantable_id' => 'sometimes|integer|nullable',
        ]);

        DB::beginTransaction();
        try {
            $encounterData = [
                'user_id' => Auth::id(),
                'name' => $data['name'],
                'folder_name' => $data['folder_name'] ?? null,
                'current_round' => $data['current_round'] ?? 1,
                'notes' => $data['notes'] ?? null,
                'status' => $data['status'] ?? EncounterStatus::Draft,
                // current_turn_id will be set after combatants are created
            ];

            $encounter = Encounter::create($encounterData);

            // Create combatants if provided
            if (isset($data['combatants']) && is_array($data['combatants'])) {
                $currentTurnCombatant = null;
                
                foreach ($data['combatants'] as $combatantData) {
                    $combatant = new Combatant([
                        'encounter_id' => $encounter->id,
                        'index' => $combatantData['index'],
                        'unit_type' => $combatantData['unit_type'],
                        'initiative' => $combatantData['initiative'],
                        'name' => $combatantData['name'],
                        'current_hit_points' => $combatantData['current_hit_points'],
                        'max_hit_points' => $combatantData['max_hit_points'],
                        'temporary_hit_points' => $combatantData['temporary_hit_points'] ?? 0,
                        'armor_class' => $combatantData['armor_class'],
                        'used_spell_slots' => $combatantData['used_spell_slots'] ?? [],
                        'action_used' => $combatantData['action_used'] ?? false,
                        'bonus_action_used' => $combatantData['bonus_action_used'] ?? false,
                        'reaction_used' => $combatantData['reaction_used'] ?? false,
                        'legendary_actions_used' => $combatantData['legendary_actions_used'] ?? 0,
                    ]);

                    // Set polymorphic relationship if provided
                    if (isset($combatantData['combatantable_type']) && isset($combatantData['combatantable_id'])) {
                        $combatant->combatantable_type = $combatantData['combatantable_type'];
                        $combatant->combatantable_id = $combatantData['combatantable_id'];
                    }

                    $combatant->save();
                    
                    // Track which combatant should be the current turn
                    if (isset($data['current_turn_index']) && $combatantData['index'] === $data['current_turn_index']) {
                        $currentTurnCombatant = $combatant;
                    }
                }
                
                // Set the current turn if we found the matching combatant
                if ($currentTurnCombatant) {
                    $encounter->current_turn_id = $currentTurnCombatant->id;
                    $encounter->save();
                }
            }

            DB::commit();

            // Load the encounter with combatants for response
            $encounter->load('combatants');

            return response()->json([
                'status' => true,
                'message' => 'Encounter created successfully',
                'data' => $encounter,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Failed to create encounter: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified encounter with all attributes including combatant list.
     */
    public function show(string $id, Request $request)
    {
        $encounter = Encounter::with(['combatants', 'currentTurn'])
            ->where('user_id', $request->user()->id)
            ->where('id', $id)
            ->firstOrFail();

        // Add current turn index for frontend compatibility
        $encounterData = $encounter->toArray();
        $encounterData['current_turn_index'] = $encounter->currentTurn?->index ?? null;

        return response()->json($encounterData);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Encounter $encounter)
    {
        if ($resp = $this->authorizeEncounter($encounter)) {
            return $resp;
        }

        $data = $request->validate([
            'name'          => 'sometimes|string',
            'folder_name'   => 'nullable|string',
            'notes'         => 'nullable|string',
            'status'        => ['sometimes', Rule::enum(EncounterStatus::class)],
            'current_round' => 'sometimes|integer|min:0',
        ]);

        $encounter->update($data);

        return response()->json([
            'status' => true,
            'message' => 'Encounter updated successfully',
            'data' => $encounter,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Encounter $encounter)
    {
        if ($resp = $this->authorizeEncounter($encounter)) {
            return $resp;
        }

        $encounter->delete();

        return response()->json([
            'status' => true,
            'message' => 'Encounter deleted successfully',
        ]);
    }

    private function authorizeEncounter(Encounter $encounter)
    {
        if ($encounter->user_id !== Auth::id()) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
        }

        return null;
    }
}
