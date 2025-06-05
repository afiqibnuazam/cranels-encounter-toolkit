/**
 * Capitalize group names for display
 */
export const capitalizeGroupName = (groupName: string): string => {
    return groupName.replace(/\b\w/g, (char) => char.toUpperCase());
};


/**
 * Convert decimal challenge rating to fraction format
 */
export const formatChallengeRating = (cr: number | undefined): string => {
    if (cr === undefined) return "Unknown CR";

    // Use Math.abs for floating-point comparison with small epsilon
    const epsilon = 0.0001;

    // Convert common decimal CRs to fractions
    if (Math.abs(cr - 0.125) < epsilon) {
        return "CR 1/8";
    } else if (Math.abs(cr - 0.25) < epsilon) {
        return "CR 1/4";
    } else if (Math.abs(cr - 0.5) < epsilon) {
        return "CR 1/2";
    } else {
        return `CR ${cr}`;
    }
};


/**
 * Get numeric value from challenge rating string for sorting
 */
export const getCRValue = (crString: string): number => {
    if (crString === "Unknown CR") return -1;
    if (crString === "CR 1/8") return 0.125;
    if (crString === "CR 1/4") return 0.25;
    if (crString === "CR 1/2") return 0.5;
    // Extract number from "CR X" format
    const match = crString.match(/CR (\d+)/);
    return match ? parseInt(match[1], 10) : -1;
};


/**
 * Get numeric value from spell level string for sorting
 */
export const getLevelValue = (levelString: string): number => {
    if (levelString === "Cantrips") return 0;
    const match = levelString.match(/Level (\d+)/);
    return match ? parseInt(match[1], 10) : -1;
};