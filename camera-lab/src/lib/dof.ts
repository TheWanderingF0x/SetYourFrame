/** Depth of field & hyperfocal (thin-lens model, aligned with common calculators). */

export interface DofInputs {
  focalLengthMm: number
  aperture: number
  cocMm: number
  /** Distance from lens to subject (mm), along optical axis */
  subjectDistanceMm: number
}

export interface DofResult {
  hyperfocalMm: number
  nearLimitMm: number
  farLimitMm: number
  /** Vertical FOV in degrees (sensor height / focal length) */
  verticalFovDeg: number
  /** 35mm-equivalent focal length for crop sensors */
  equivalentFocalMm: number
  diffractionLimitedAperture: number
  totalDofMm: number
  farIsInfinity: boolean
}

export function computeDof(
  input: DofInputs,
  sensorHeightMm: number,
  cropFactorVsFullFrame: number,
): DofResult {
  const { focalLengthMm: f, aperture: N, cocMm: c, subjectDistanceMm: s } = input

  const hyperfocalMm = f + (f * f) / (N * c)

  const denomNear = hyperfocalMm + (s - f)
  const denomFar = hyperfocalMm - (s - f)

  const nearLimitMm =
    denomNear > 0 ? (hyperfocalMm * s) / denomNear : Number.POSITIVE_INFINITY
  let farLimitMm =
    denomFar > 0 ? (hyperfocalMm * s) / denomFar : Number.POSITIVE_INFINITY

  const farIsInfinity = !Number.isFinite(farLimitMm) || farLimitMm <= 0

  if (farIsInfinity) {
    farLimitMm = Number.POSITIVE_INFINITY
  }

  const totalDofMm =
    Number.isFinite(farLimitMm) && Number.isFinite(nearLimitMm)
      ? farLimitMm - nearLimitMm
      : Number.POSITIVE_INFINITY

  const verticalFovDeg =
    (2 * Math.atan(sensorHeightMm / 2 / f) * 180) / Math.PI

  const equivalentFocalMm = f * cropFactorVsFullFrame

  const diffractionLimitedAperture = c / 0.001342

  return {
    hyperfocalMm,
    nearLimitMm: Number.isFinite(nearLimitMm) ? nearLimitMm : 0,
    farLimitMm,
    verticalFovDeg,
    equivalentFocalMm,
    diffractionLimitedAperture,
    totalDofMm,
    farIsInfinity,
  }
}
