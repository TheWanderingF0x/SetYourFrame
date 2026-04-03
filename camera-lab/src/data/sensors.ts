import { pixelPitchFromSensor } from '../lib/astro'

export type CameraBrand = 'Nikon' | 'Canon' | 'Sony' | 'Generic'

export interface SensorSpec {
  id: string
  label: string
  brand: CameraBrand
  widthMm: number
  heightMm: number
  /** Typical horizontal pixel count for pixel-pitch / NPF estimates */
  hPixels: number
}

const FF_W = 36
const FF_H = 24
const FF_DIAG = Math.hypot(FF_W, FF_H)

export function sensorDiagonalMm(s: Pick<SensorSpec, 'widthMm' | 'heightMm'>): number {
  return Math.hypot(s.widthMm, s.heightMm)
}

/** CoC for “sharp print” convention: diagonal / 1500 */
export function cocMm(s: Pick<SensorSpec, 'widthMm' | 'heightMm'>): number {
  return sensorDiagonalMm(s) / 1500
}

/** Crop vs 36×24 full frame */
export function cropFactor(s: Pick<SensorSpec, 'widthMm' | 'heightMm'>): number {
  return FF_DIAG / sensorDiagonalMm(s)
}

export function pixelPitchMicrons(s: SensorSpec): number {
  return pixelPitchFromSensor(s.widthMm, s.hPixels)
}

/** Curated bodies + generic formats. Extend this list as needed. */
export const SENSORS: SensorSpec[] = [
  // --- Generic formats ---
  {
    id: 'ff-36x24',
    label: 'Full frame (36 × 24 mm)',
    brand: 'Generic',
    widthMm: FF_W,
    heightMm: FF_H,
    hPixels: 6000,
  },
  {
    id: 'apsc-nikon',
    label: 'APS-C Nikon / Sony (23.5 × 15.6 mm)',
    brand: 'Generic',
    widthMm: 23.5,
    heightMm: 15.6,
    hPixels: 6000,
  },
  {
    id: 'apsc-canon',
    label: 'APS-C Canon (22.3 × 14.9 mm)',
    brand: 'Generic',
    widthMm: 22.3,
    heightMm: 14.9,
    hPixels: 6000,
  },
  {
    id: 'm43',
    label: 'Micro Four Thirds (17.3 × 13 mm)',
    brand: 'Generic',
    widthMm: 17.3,
    heightMm: 13,
    hPixels: 5184,
  },
  {
    id: 'mf-4433',
    label: 'Medium format ≈44 × 33 mm',
    brand: 'Generic',
    widthMm: 43.8,
    heightMm: 32.9,
    hPixels: 8256,
  },
  {
    id: '1inch',
    label: '1" type (13.2 × 8.8 mm)',
    brand: 'Generic',
    widthMm: 13.2,
    heightMm: 8.8,
    hPixels: 5472,
  },
  // --- Nikon Z ---
  {
    id: 'nikon-z9',
    label: 'Nikon Z9',
    brand: 'Nikon',
    widthMm: 35.9,
    heightMm: 23.9,
    hPixels: 8256,
  },
  {
    id: 'nikon-z8',
    label: 'Nikon Z8',
    brand: 'Nikon',
    widthMm: 35.9,
    heightMm: 23.9,
    hPixels: 8256,
  },
  {
    id: 'nikon-z7iii',
    label: 'Nikon Z7 III',
    brand: 'Nikon',
    widthMm: 35.9,
    heightMm: 23.9,
    hPixels: 6048,
  },
  {
    id: 'nikon-z6iii',
    label: 'Nikon Z6 III',
    brand: 'Nikon',
    widthMm: 35.9,
    heightMm: 23.9,
    hPixels: 6048,
  },
  {
    id: 'nikon-z5ii',
    label: 'Nikon Z5 II',
    brand: 'Nikon',
    widthMm: 35.9,
    heightMm: 23.9,
    hPixels: 6016,
  },
  {
    id: 'nikon-zfc',
    label: 'Nikon Z fc / Z50 / Z30 (DX)',
    brand: 'Nikon',
    widthMm: 23.5,
    heightMm: 15.7,
    hPixels: 5568,
  },
  {
    id: 'nikon-zf',
    label: 'Nikon Z f',
    brand: 'Nikon',
    widthMm: 35.9,
    heightMm: 23.9,
    hPixels: 6048,
  },
  // --- Nikon F DSLR (representative) ---
  {
    id: 'nikon-d850',
    label: 'Nikon D850',
    brand: 'Nikon',
    widthMm: 35.9,
    heightMm: 24,
    hPixels: 8288,
  },
  {
    id: 'nikon-d780',
    label: 'Nikon D780',
    brand: 'Nikon',
    widthMm: 35.9,
    heightMm: 24,
    hPixels: 6048,
  },
  {
    id: 'nikon-d500',
    label: 'Nikon D500 (DX)',
    brand: 'Nikon',
    widthMm: 23.5,
    heightMm: 15.7,
    hPixels: 5568,
  },
  // --- Canon RF / R ---
  {
    id: 'canon-r5ii',
    label: 'Canon EOS R5 II',
    brand: 'Canon',
    widthMm: 36,
    heightMm: 24,
    hPixels: 8192,
  },
  {
    id: 'canon-r6iii',
    label: 'Canon EOS R6 Mark III',
    brand: 'Canon',
    widthMm: 36,
    heightMm: 24,
    hPixels: 6000,
  },
  {
    id: 'canon-r8',
    label: 'Canon EOS R8',
    brand: 'Canon',
    widthMm: 36,
    heightMm: 24,
    hPixels: 6000,
  },
  {
    id: 'canon-rp',
    label: 'Canon EOS RP',
    brand: 'Canon',
    widthMm: 35.9,
    heightMm: 24,
    hPixels: 6240,
  },
  {
    id: 'canon-r7',
    label: 'Canon EOS R7 (APS-C)',
    brand: 'Canon',
    widthMm: 22.3,
    heightMm: 14.8,
    hPixels: 6960,
  },
  {
    id: 'canon-r10',
    label: 'Canon EOS R10 (APS-C)',
    brand: 'Canon',
    widthMm: 22.3,
    heightMm: 14.8,
    hPixels: 6000,
  },
  {
    id: 'canon-r50',
    label: 'Canon EOS R50 (APS-C)',
    brand: 'Canon',
    widthMm: 22.3,
    heightMm: 14.8,
    hPixels: 6000,
  },
  // --- Canon EF (representative) ---
  {
    id: 'canon-5div',
    label: 'Canon EOS 5D Mark IV',
    brand: 'Canon',
    widthMm: 36,
    heightMm: 24,
    hPixels: 6720,
  },
  {
    id: 'canon-90d',
    label: 'Canon EOS 90D (APS-C)',
    brand: 'Canon',
    widthMm: 22.3,
    heightMm: 14.8,
    hPixels: 6960,
  },
  // --- Sony Alpha / FX ---
  {
    id: 'sony-a1ii',
    label: 'Sony A1 II',
    brand: 'Sony',
    widthMm: 35.7,
    heightMm: 23.8,
    hPixels: 8640,
  },
  {
    id: 'sony-a7rv',
    label: 'Sony A7R V',
    brand: 'Sony',
    widthMm: 35.7,
    heightMm: 23.8,
    hPixels: 9504,
  },
  {
    id: 'sony-a7iv',
    label: 'Sony A7 IV',
    brand: 'Sony',
    widthMm: 35.7,
    heightMm: 23.8,
    hPixels: 7008,
  },
  {
    id: 'sony-a7cii',
    label: 'Sony A7C II',
    brand: 'Sony',
    widthMm: 35.7,
    heightMm: 23.8,
    hPixels: 6000,
  },
  {
    id: 'sony-fx3',
    label: 'Sony FX3',
    brand: 'Sony',
    widthMm: 35.7,
    heightMm: 23.8,
    hPixels: 4240,
  },
  {
    id: 'sony-a6700',
    label: 'Sony A6700 (APS-C)',
    brand: 'Sony',
    widthMm: 23.3,
    heightMm: 15.5,
    hPixels: 6192,
  },
  {
    id: 'sony-a6400',
    label: 'Sony A6400 (APS-C)',
    brand: 'Sony',
    widthMm: 23.5,
    heightMm: 15.6,
    hPixels: 6000,
  },
]

export function getSensor(id: string): SensorSpec | undefined {
  return SENSORS.find((s) => s.id === id)
}
