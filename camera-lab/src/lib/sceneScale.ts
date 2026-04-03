/** Logarithmic 0…1 strip position for scene visualization (min…max metres). */

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(Math.max(n, lo), hi)
}

export function stripTFromMeters(distanceM: number, minM: number, maxM: number): number {
  if (minM <= 0 || maxM <= minM) return 0
  const d = clamp(distanceM, minM, maxM)
  const lo = Math.log10(minM)
  const hi = Math.log10(maxM)
  return clamp((Math.log10(d) - lo) / (hi - lo), 0, 1)
}

export function metersFromStripT(t: number, minM: number, maxM: number): number {
  if (minM <= 0 || maxM <= minM) return minM
  const u = clamp(t, 0, 1)
  const lo = Math.log10(minM)
  const hi = Math.log10(maxM)
  return Math.pow(10, lo + u * (hi - lo))
}

/** Strip always spans the same real-world span: min distance ↔ 10 km. */
export function stripMinMaxMeters(units: 'metric' | 'imperial'): { minM: number; maxM: number } {
  return units === 'metric'
    ? { minM: 0.2, maxM: 10_000 }
    : { minM: 0.3048, maxM: 10_000 }
}
