import { SpellRangeInput } from "@/types";

export function serializeSpellRange(input: SpellRangeInput): string {
  if (input.base === "Ranged" && input.distance && input.unit) {
    const isPlural = input.unit === "mile" && Number(input.distance) !== 1;
    const unitLabel =
      input.unit === "mile"
        ? isPlural
          ? "miles"
          : "mile"
        : "feet";
    return `${input.distance} ${unitLabel}`;
  }
  return input.base;
}
