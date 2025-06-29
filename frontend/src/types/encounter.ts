// Encounter type definitions for the D&D 5e Encounter Toolkit

export type EncounterStatus = 'draft' | 'active' | 'completed';

export interface EncounterSummary {
  id: number;
  name: string;
  folder_name?: string;
  notes?: string;
  current_turn_id?: number;
  current_round: number;
  status: EncounterStatus;
  created_at?: string;
  updated_at?: string;
}

export interface Encounter extends EncounterSummary {
  combatants?: unknown[]; // Will be defined when combatant types are created
  // Additional detailed encounter properties can be added here
}
