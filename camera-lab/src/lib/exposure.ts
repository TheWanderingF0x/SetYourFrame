/** Exposure triangle: EV, reciprocity between t, N, ISO. */

const LN2 = Math.LN2

/** EV at ISO 100: EV = log2(N²/t), t in seconds */
export function evAtIso100(aperture: number, shutterSeconds: number): number {
  if (shutterSeconds <= 0 || aperture <= 0) return Number.NaN
  return Math.log((aperture * aperture) / shutterSeconds) / LN2
}

/** Adjust EV for ISO: EV_scene = EV_ISO100 - log2(ISO/100) */
export function evScene(aperture: number, shutterSeconds: number, iso: number): number {
  if (iso <= 0) return Number.NaN
  return evAtIso100(aperture, shutterSeconds) - Math.log(iso / 100) / LN2
}

/** Given two of three, solve for shutter (seconds) to match target EV at ISO 100 */
export function shutterForEv(aperture: number, evAt100: number): number {
  return (aperture * aperture) / Math.pow(2, evAt100)
}

export function apertureForEv(shutterSeconds: number, evAt100: number): number {
  return Math.sqrt(shutterSeconds * Math.pow(2, evAt100))
}

export function isoForEv(aperture: number, shutterSeconds: number, evSceneValue: number): number {
  const ev100 = evAtIso100(aperture, shutterSeconds)
  return 100 * Math.pow(2, ev100 - evSceneValue)
}

export function describeMotionBlur(shutterSeconds: number): string {
  if (shutterSeconds >= 2) return 'Strong blur — water, clouds, night traffic'
  if (shutterSeconds >= 0.5) return 'Visible motion — creative panning / low light'
  if (shutterSeconds >= 1 / 15) return 'Handheld risk; moving subjects blur easily'
  if (shutterSeconds >= 1 / 125) return 'Everyday handheld; moderate sport'
  if (shutterSeconds >= 1 / 500) return 'Fast action, sharp motion freeze'
  if (shutterSeconds >= 1 / 2000) return 'Very fast subjects; minimal blur'
  return 'Extreme freeze — splash, wildlife, sports'
}

export function describeNoiseRisk(iso: number): string {
  if (iso <= 400) return 'Clean on most modern bodies'
  if (iso <= 1600) return 'Light noise; fine for web and mid prints'
  if (iso <= 6400) return 'Visible noise; use NR for large prints'
  if (iso <= 25600) return 'Heavy noise; documentary / rescue shots'
  return 'Extreme ISO — last resort, monochrome can help'
}
