/** Star trail limits: 500 rule (legacy), NPF-style (pixel-aware). */

export interface AstroInputs {
  focalLengthMm: number
  aperture: number
  cropFactor: number
  /** Pixel pitch in micrometres (µm) */
  pixelPitchMicrons: number
}

export interface AstroResult {
  maxSeconds500Rule: number
  maxSecondsNpf: number
  recommended: number
  note: string
}

/**
 * Classic “500 rule”: max t ≈ 500 / (f × crop). Rough, ignores resolution.
 */
export function maxExposure500Rule(focalMm: number, cropFactor: number): number {
  if (focalMm <= 0 || cropFactor <= 0) return Number.NaN
  return 500 / (focalMm * cropFactor)
}

/**
 * Practical NPF-style cap: (35×N + 30×p) / f — p in µm, f in mm, N = f-number.
 * Matches common simplified calculators; stricter than 500 rule on high-res bodies.
 */
export function maxExposureNpfSimplified(
  focalMm: number,
  aperture: number,
  pixelPitchMicrons: number,
): number {
  if (focalMm <= 0 || aperture <= 0 || pixelPitchMicrons <= 0) return Number.NaN
  return (35 * aperture + 30 * pixelPitchMicrons) / focalMm
}

export function computeAstro(inputs: AstroInputs): AstroResult {
  const t500 = maxExposure500Rule(inputs.focalLengthMm, inputs.cropFactor)
  const tNpf = maxExposureNpfSimplified(
    inputs.focalLengthMm,
    inputs.aperture,
    inputs.pixelPitchMicrons,
  )
  const recommended = Math.min(
    Number.isFinite(tNpf) ? tNpf : t500,
    Number.isFinite(t500) ? t500 : tNpf,
  )
  return {
    maxSeconds500Rule: t500,
    maxSecondsNpf: tNpf,
    recommended,
    note:
      'Use a tracker for longer subs; widen aperture or shorter FL for untracked Milky Way. These limits reduce noticeable star streaks, not absolute physics.',
  }
}

export function pixelPitchFromSensor(
  widthMm: number,
  horizontalPixels: number,
): number {
  if (horizontalPixels <= 0) return 5.9
  return (widthMm * 1000) / horizontalPixels
}
