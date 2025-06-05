// Encounter type definitions for the D&D 5e Encounter Toolkit

export interface EncounterSummary {
  id: number;
  index: string;
  name: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'deadly';
  status?: 'draft' | 'active' | 'completed';
  created_at?: string;
  updated_at?: string;
}

export interface Encounter extends EncounterSummary {
  combatants?: unknown[]; // Will be defined when combatant types are created
  // Additional detailed encounter properties can be added here
}
