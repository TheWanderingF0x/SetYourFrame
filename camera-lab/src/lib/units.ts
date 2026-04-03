export type UnitSystem = 'metric' | 'imperial'

/** At most 2 fractional digits (locale-aware grouping). */
export function formatMax2Decimals(n: number): string {
  if (!Number.isFinite(n)) return '—'
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(n)
}

export function inchesToMm(inches: number): number {
  return inches * 25.4
}

export function mmToInches(mm: number): number {
  return mm / 25.4
}

/** Display length from inches (internal distance storage); max 2 decimals where numeric. */
export function formatDistance(inches: number, system: UnitSystem): string {
  if (system === 'metric') {
    const m = inches * 0.0254
    if (m >= 1) return `${formatMax2Decimals(m)} m`
    return `${formatMax2Decimals(m * 100)} cm`
  }
  const ft = inches / 12
  if (ft >= 100) return `${formatMax2Decimals(ft)} ft`
  const wholeFt = Math.floor(ft)
  const inchRem = Math.round(inches - wholeFt * 12)
  if (wholeFt === 0) return `${inchRem}"`
  return `${wholeFt}' ${inchRem}"`
}

export function parseDistanceToInches(value: number, system: UnitSystem): number {
  return system === 'metric' ? value / 0.0254 : value * 12
}

/** value in inches */
export function distanceInputToInches(raw: number, system: UnitSystem): number {
  if (system === 'metric') return raw / 0.0254
  return raw * 12
}
