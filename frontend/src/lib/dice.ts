/**
 * Dice rolling utilities for tabletop RPGs
 */

/**
 * Rolls a d20 (1-20)
 * @returns A random number between 1 and 20
 */
export const rollD20 = (): number => Math.floor(Math.random() * 20) + 1

/**
 * Rolls a d4 (1-4)
 * @returns A random number between 1 and 4
 */
export const rollD4 = (): number => Math.floor(Math.random() * 4) + 1

/**
 * Rolls a d6 (1-6)
 * @returns A random number between 1 and 6
 */
export const rollD6 = (): number => Math.floor(Math.random() * 6) + 1

/**
 * Rolls a d8 (1-8)
 * @returns A random number between 1 and 8
 */
export const rollD8 = (): number => Math.floor(Math.random() * 8) + 1

/**
 * Rolls a d10 (1-10)
 * @returns A random number between 1 and 10
 */
export const rollD10 = (): number => Math.floor(Math.random() * 10) + 1

/**
 * Rolls a d12 (1-12)
 * @returns A random number between 1 and 12
 */
export const rollD12 = (): number => Math.floor(Math.random() * 12) + 1

/**
 * Rolls a d100 (1-100)
 * @returns A random number between 1 and 100
 */
export const rollD100 = (): number => Math.floor(Math.random() * 100) + 1

/**
 * Rolls multiple dice of the same type
 * @param sides Number of sides on the die
 * @param count Number of dice to roll
 * @returns Array of dice results
 */
export const rollMultiple = (sides: number, count: number): number[] => {
  return Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1)
}

/**
 * Rolls dice with advantage (roll 2d20, take highest)
 * @returns The higher of two d20 rolls
 */
export const rollWithAdvantage = (): number => {
  const roll1 = rollD20()
  const roll2 = rollD20()
  return Math.max(roll1, roll2)
}

/**
 * Rolls dice with disadvantage (roll 2d20, take lowest)
 * @returns The lower of two d20 rolls
 */
export const rollWithDisadvantage = (): number => {
  const roll1 = rollD20()
  const roll2 = rollD20()
  return Math.min(roll1, roll2)
} 