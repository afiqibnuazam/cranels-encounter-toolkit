import React from "react";
import { Group, Ungroup, Hash, Shield, Layers, GraduationCap, Tag } from "lucide-react";
import { ButtonConfig } from "../types";


export const BUTTON_CONFIGS: Record<string, Record<string, ButtonConfig>> = {
    MONSTERS: {
        none: { 
            icon: <Ungroup />, 
            tooltip: "Ungrouped - Click to group by type", 
            variant: "outline"
        },
        type: { 
            icon: <Group />, 
            tooltip: "Grouped by Type - Click to group by challenge rating", 
            variant: "default" 
        },
        challenge_rating: { 
            icon: <Hash />, 
            tooltip: "Grouped by Challenge Rating - Click to group by source", 
            variant: "default" 
        },
        source: { 
            icon: <Shield />, 
            tooltip: "Grouped by Source - Click to ungroup", 
            variant: "default" 
        },
    },
    CHARACTERS: {
        none: { 
            icon: <Ungroup />, 
            tooltip: "Ungrouped - Click to group by unit type", 
            variant: "outline"
        },
        unit_type: { 
            icon: <Group />, 
            tooltip: "Grouped by Unit Type - Click to group by type", 
            variant: "default" 
        },
        type: { 
            icon: <Group />, 
            tooltip: "Grouped by Type - Click to group by challenge rating", 
            variant: "default" 
        },
        challenge_rating: { 
            icon: <Hash />, 
            tooltip: "Grouped by Challenge Rating - Click to group by level", 
            variant: "default" 
        },
        level: { 
            icon: <Layers />, 
            tooltip: "Grouped by Level - Click to group by source", 
            variant: "default" 
        },
        source: { 
            icon: <Shield />, 
            tooltip: "Grouped by Source - Click to ungroup", 
            variant: "default" 
        },
    },
    SPELLS: {
        none: { 
            icon: <Ungroup />, 
            tooltip: "Ungrouped - Click to group by level", 
            variant: "outline" 
        },
        level: { 
            icon: <Layers />, 
            tooltip: "Grouped by Level - Click to group by school", 
            variant: "default" 
        },
        school: { 
            icon: <GraduationCap />, 
            tooltip: "Grouped by School - Click to group by tags", 
            variant: "default" 
        },
        tags: { 
            icon: <Tag />, 
            tooltip: "Grouped by Tags - Click to group by source", 
            variant: "default" 
        },
        source: { 
            icon: <Shield />, 
            tooltip: "Grouped by Source - Click to ungroup", 
            variant: "default" 
        },
    }
} as const;

export const GROUP_CYCLES = {
    MONSTERS: ["none", "type", "challenge_rating", "source"] as const,
    CHARACTERS: ["none", "unit_type", "type", "challenge_rating", "level", "source"] as const,
    SPELLS: ["none", "level", "school", "tags", "source"] as const,
} as const;