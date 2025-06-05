<?php

namespace App\Http\Controllers\Api;

use App\Models\Encounter;
use Illuminate\Http\Request;
use App\Enums\EncounterStatus;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

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
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'          => 'required|string',
            'folder_name'   => 'nullable|string',
            'notes'         => 'nullable|string',
        ]);

        $data['user_id']    = Auth::id();
        $data['status']     = EncounterStatus::Draft;

        Encounter::create($data);

        return response()->json([
            'status' => true,
            'message' => 'Encounter created successfully',
        ]);
    }

    /**
     * Display the specified encounter with all attributes including combatant list.
     */
    public function show(string $id, Request $request)
    {
        $encounter = Encounter::with('combatants')
            ->where('user_id', $request->user()->id)
            ->where('id', $id)
            ->firstOrFail();

        return response()->json($encounter);
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
        ]);

        $encounter->update($data);

        return response()->json([
            'status' => true,
            'message' => 'Encounter updated successfully',
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
