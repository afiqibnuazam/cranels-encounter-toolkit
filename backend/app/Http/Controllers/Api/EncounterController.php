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
     * Display a listing of the resource.
     */
    public function index()
    {
        $user_id = Auth::id();

        $encounters = Encounter::where('user_id', $user_id)->get();

        return response()->json([
            'status' => true,
            'encounters' => $encounters,
        ]);
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
     * Display the specified resource.
     */
    public function show(Encounter $encounter)
    {
        if ($resp = $this->authorizeEncounter($encounter)) {
            return $resp;
        }

        return response()->json([
            'status' => true,
            'encounter' => $encounter,
        ]);
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
