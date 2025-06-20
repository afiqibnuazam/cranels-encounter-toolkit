import { SPELL_LEVEL_LABELS, STANDARD_CASTING_TIMES } from "@/types";
import { capitalizeWords } from "@/lib/utils";


export const spellLevelOptions = Object.entries(SPELL_LEVEL_LABELS).map(([value, label]) => ({
    value: Number(value),
    label,
}));

export const castingTimeOptions = [
    ...STANDARD_CASTING_TIMES.map(ct => ({
        value: ct,                  // stored as lowercase string
        label: capitalizeWords(ct), // displayed as capitalized string
    })),
    { value: "custom", label: "Custom" },
];


