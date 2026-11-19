/**
 * Read the slider position saved in sessionStorage. Only a whole number that
 * indexes a real pitch is accepted: a value like "1.5" used to pass the range
 * check, PITCHES[1.5] was undefined, and the page crashed to a blank screen.
 */
export function parseSavedPitch(saved: string | null, count: number): number | null {
  if (saved == null || saved.trim() === '') return null
  const n = Number(saved)
  if (!Number.isInteger(n) || n < 0 || n >= count) return null
  return n
}
