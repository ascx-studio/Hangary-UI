/** Keep a finite value within an inclusive range. */
export function clamp(value: number, min: number, max: number): number {
  if (![value, min, max].every(Number.isFinite)) {
    throw new RangeError('clamp expects finite numbers.')
  }
  if (min > max) {
    throw new RangeError('clamp expects min to be less than or equal to max.')
  }
  return Math.min(max, Math.max(min, value))
}
