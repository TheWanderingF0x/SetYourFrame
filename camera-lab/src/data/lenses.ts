/**
 * Starter catalog: Nikon / Canon / Sony mounts + major 3rd-party (Sigma, Tamron, etc.).
 * The market has thousands of SKUs — add rows here or split into JSON imports.
 */

export type LensMount =
  | 'Nikon Z'
  | 'Nikon F'
  | 'Canon RF'
  | 'Canon EF'
  | 'Canon EF-S'
  | 'Sony FE'
  | 'Sony E'

export type LensVendor =
  | 'Nikon'
  | 'Canon'
  | 'Sony'
  | 'Sigma'
  | 'Tamron'
  | 'Samyang'
  | 'Viltrox'
  | 'Tokina'
  | 'Zeiss'
  | 'Laowa'
  | 'Voigtländer'

export interface LensRecord {
  id: string
  vendor: LensVendor
  name: string
  mount: LensMount
  minMm: number
  maxMm: number
  maxApertureWide: number
  /** For zooms: max aperture at long end (if slower). Omit if same as wide. */
  maxApertureTele?: number
}

let _nid = 0
function L(
  vendor: LensVendor,
  name: string,
  mount: LensMount,
  minMm: number,
  maxMm: number,
  maxApertureWide: number,
  maxApertureTele?: number,
): LensRecord {
  return {
    id: `lens-${++_nid}`,
    vendor,
    name,
    mount,
    minMm,
    maxMm,
    maxApertureWide,
    maxApertureTele,
  }
}

export const LENSES: LensRecord[] = [
  // Nikon Z — OEM
  L('Nikon', 'NIKKOR Z 14-24mm f/2.8 S', 'Nikon Z', 14, 24, 2.8),
  L('Nikon', 'NIKKOR Z 14-30mm f/4 S', 'Nikon Z', 14, 30, 4),
  L('Nikon', 'NIKKOR Z 17-28mm f/2.8', 'Nikon Z', 17, 28, 2.8),
  L('Nikon', 'NIKKOR Z 24-70mm f/2.8 S', 'Nikon Z', 24, 70, 2.8),
  L('Nikon', 'NIKKOR Z 24-70mm f/4 S', 'Nikon Z', 24, 70, 4),
  L('Nikon', 'NIKKOR Z 24-120mm f/4 S', 'Nikon Z', 24, 120, 4),
  L('Nikon', 'NIKKOR Z 28-75mm f/2.8', 'Nikon Z', 28, 75, 2.8),
  L('Nikon', 'NIKKOR Z 70-180mm f/2.8', 'Nikon Z', 70, 180, 2.8),
  L('Nikon', 'NIKKOR Z 70-200mm f/2.8 VR S', 'Nikon Z', 70, 200, 2.8),
  L('Nikon', 'NIKKOR Z 100-400mm f/4.5-5.6 VR S', 'Nikon Z', 100, 400, 4.5, 5.6),
  L('Nikon', 'NIKKOR Z 180-600mm f/5.6-6.3 VR', 'Nikon Z', 180, 600, 5.6, 6.3),
  L('Nikon', 'NIKKOR Z 400mm f/2.8 TC VR S', 'Nikon Z', 400, 400, 2.8),
  L('Nikon', 'NIKKOR Z 600mm f/4 TC VR S', 'Nikon Z', 600, 600, 4),
  L('Nikon', 'NIKKOR Z 20mm f/1.8 S', 'Nikon Z', 20, 20, 1.8),
  L('Nikon', 'NIKKOR Z 24mm f/1.8 S', 'Nikon Z', 24, 24, 1.8),
  L('Nikon', 'NIKKOR Z 28mm f/2.8', 'Nikon Z', 28, 28, 2.8),
  L('Nikon', 'NIKKOR Z 35mm f/1.8 S', 'Nikon Z', 35, 35, 1.8),
  L('Nikon', 'NIKKOR Z 40mm f/2', 'Nikon Z', 40, 40, 2),
  L('Nikon', 'NIKKOR Z 50mm f/1.2 S', 'Nikon Z', 50, 50, 1.2),
  L('Nikon', 'NIKKOR Z 50mm f/1.8 S', 'Nikon Z', 50, 50, 1.8),
  L('Nikon', 'NIKKOR Z 58mm f/0.95 S Noct', 'Nikon Z', 58, 58, 0.95),
  L('Nikon', 'NIKKOR Z 85mm f/1.2 S', 'Nikon Z', 85, 85, 1.2),
  L('Nikon', 'NIKKOR Z 85mm f/1.8 S', 'Nikon Z', 85, 85, 1.8),
  L('Nikon', 'NIKKOR Z 105mm f/2.8 MC VR S', 'Nikon Z', 105, 105, 2.8),
  L('Nikon', 'NIKKOR Z 135mm f/1.8 S Plena', 'Nikon Z', 135, 135, 1.8),
  L('Nikon', 'NIKKOR Z DX 12-28mm f/3.5-5.6 PZ VR', 'Nikon Z', 12, 28, 3.5, 5.6),
  L('Nikon', 'NIKKOR Z DX 16-50mm f/3.5-6.3 VR', 'Nikon Z', 16, 50, 3.5, 6.3),
  L('Nikon', 'NIKKOR Z DX 18-140mm f/3.5-6.3 VR', 'Nikon Z', 18, 140, 3.5, 6.3),
  L('Nikon', 'NIKKOR Z DX 24mm f/1.7', 'Nikon Z', 24, 24, 1.7),
  L('Nikon', 'NIKKOR Z DX 50-250mm f/4.5-6.3 VR', 'Nikon Z', 50, 250, 4.5, 6.3),
  // Nikon F
  L('Nikon', 'AF-S 14-24mm f/2.8G ED', 'Nikon F', 14, 24, 2.8),
  L('Nikon', 'AF-S 24-70mm f/2.8E ED VR', 'Nikon F', 24, 70, 2.8),
  L('Nikon', 'AF-S 70-200mm f/2.8E FL ED VR', 'Nikon F', 70, 200, 2.8),
  L('Nikon', 'AF-S 200-500mm f/5.6E ED VR', 'Nikon F', 200, 500, 5.6),
  L('Nikon', 'AF-S 50mm f/1.8G', 'Nikon F', 50, 50, 1.8),
  L('Nikon', 'AF-S 85mm f/1.8G', 'Nikon F', 85, 85, 1.8),
  L('Nikon', 'AF-S 105mm f/2.8G IF-ED VR Micro', 'Nikon F', 105, 105, 2.8),
  // Canon RF
  L('Canon', 'RF 10-20mm f/4 L IS STM', 'Canon RF', 10, 20, 4),
  L('Canon', 'RF 14-35mm f/4 L IS USM', 'Canon RF', 14, 35, 4),
  L('Canon', 'RF 15-35mm f/2.8 L IS USM', 'Canon RF', 15, 35, 2.8),
  L('Canon', 'RF 24-70mm f/2.8 L IS USM', 'Canon RF', 24, 70, 2.8),
  L('Canon', 'RF 24-105mm f/4 L IS USM', 'Canon RF', 24, 105, 4),
  L('Canon', 'RF 24-240mm f/4-6.3 IS USM', 'Canon RF', 24, 240, 4, 6.3),
  L('Canon', 'RF 28-70mm f/2 L USM', 'Canon RF', 28, 70, 2),
  L('Canon', 'RF 70-200mm f/2.8 L IS USM', 'Canon RF', 70, 200, 2.8),
  L('Canon', 'RF 70-200mm f/4 L IS USM', 'Canon RF', 70, 200, 4),
  L('Canon', 'RF 100-500mm f/4.5-7.1 L IS USM', 'Canon RF', 100, 500, 4.5, 7.1),
  L('Canon', 'RF 100mm f/2.8 L Macro IS USM', 'Canon RF', 100, 100, 2.8),
  L('Canon', 'RF 135mm f/1.8 L IS USM', 'Canon RF', 135, 135, 1.8),
  L('Canon', 'RF 16mm f/2.8 STM', 'Canon RF', 16, 16, 2.8),
  L('Canon', 'RF 24mm f/1.8 MACRO IS STM', 'Canon RF', 24, 24, 1.8),
  L('Canon', 'RF 35mm f/1.8 MACRO IS STM', 'Canon RF', 35, 35, 1.8),
  L('Canon', 'RF 50mm f/1.2 L USM', 'Canon RF', 50, 50, 1.2),
  L('Canon', 'RF 50mm f/1.8 STM', 'Canon RF', 50, 50, 1.8),
  L('Canon', 'RF 85mm f/1.2 L USM', 'Canon RF', 85, 85, 1.2),
  L('Canon', 'RF 85mm f/2 MACRO IS STM', 'Canon RF', 85, 85, 2),
  L('Canon', 'RF-S 10-18mm f/4.5-6.3 IS STM', 'Canon RF', 10, 18, 4.5, 6.3),
  L('Canon', 'RF-S 18-45mm f/4.5-6.3 IS STM', 'Canon RF', 18, 45, 4.5, 6.3),
  L('Canon', 'RF-S 18-150mm f/3.5-6.3 IS STM', 'Canon RF', 18, 150, 3.5, 6.3),
  // Canon EF / EF-S
  L('Canon', 'EF 16-35mm f/2.8L III USM', 'Canon EF', 16, 35, 2.8),
  L('Canon', 'EF 24-70mm f/2.8L II USM', 'Canon EF', 24, 70, 2.8),
  L('Canon', 'EF 70-200mm f/2.8L IS III USM', 'Canon EF', 70, 200, 2.8),
  L('Canon', 'EF 100-400mm f/4.5-5.6L IS II USM', 'Canon EF', 100, 400, 4.5, 5.6),
  L('Canon', 'EF 50mm f/1.8 STM', 'Canon EF', 50, 50, 1.8),
  L('Canon', 'EF 85mm f/1.4L IS USM', 'Canon EF', 85, 85, 1.4),
  L('Canon', 'EF-S 10-18mm f/4.5-5.6 IS STM', 'Canon EF-S', 10, 18, 4.5, 5.6),
  L('Canon', 'EF-S 18-55mm f/3.5-5.6 IS STM', 'Canon EF-S', 18, 55, 3.5, 5.6),
  L('Canon', 'EF-S 55-250mm f/4-5.6 IS STM', 'Canon EF-S', 55, 250, 4, 5.6),
  // Sony FE
  L('Sony', 'FE 12-24mm f/2.8 GM', 'Sony FE', 12, 24, 2.8),
  L('Sony', 'FE 16-35mm f/2.8 GM II', 'Sony FE', 16, 35, 2.8),
  L('Sony', 'FE 20-70mm f/4 G', 'Sony FE', 20, 70, 4),
  L('Sony', 'FE 24-70mm f/2.8 GM II', 'Sony FE', 24, 70, 2.8),
  L('Sony', 'FE 24-105mm f/4 G OSS', 'Sony FE', 24, 105, 4),
  L('Sony', 'FE 28-60mm f/4-5.6', 'Sony FE', 28, 60, 4, 5.6),
  L('Sony', 'FE 70-200mm f/2.8 GM OSS II', 'Sony FE', 70, 200, 2.8),
  L('Sony', 'FE 70-200mm f/4 G OSS II', 'Sony FE', 70, 200, 4),
  L('Sony', 'FE 100-400mm f/4.5-5.6 GM OSS', 'Sony FE', 100, 400, 4.5, 5.6),
  L('Sony', 'FE 200-600mm f/5.6-6.3 G OSS', 'Sony FE', 200, 600, 5.6, 6.3),
  L('Sony', 'FE 14mm f/1.8 GM', 'Sony FE', 14, 14, 1.8),
  L('Sony', 'FE 20mm f/1.8 G', 'Sony FE', 20, 20, 1.8),
  L('Sony', 'FE 24mm f/1.4 GM', 'Sony FE', 24, 24, 1.4),
  L('Sony', 'FE 35mm f/1.4 GM', 'Sony FE', 35, 35, 1.4),
  L('Sony', 'FE 40mm f/2.5 G', 'Sony FE', 40, 40, 2.5),
  L('Sony', 'FE 50mm f/1.2 GM', 'Sony FE', 50, 50, 1.2),
  L('Sony', 'FE 50mm f/1.4 GM', 'Sony FE', 50, 50, 1.4),
  L('Sony', 'FE 85mm f/1.4 GM', 'Sony FE', 85, 85, 1.4),
  L('Sony', 'FE 135mm f/1.8 GM', 'Sony FE', 135, 135, 1.8),
  L('Sony', 'FE 90mm f/2.8 Macro G OSS', 'Sony FE', 90, 90, 2.8),
  // Sony E (APS-C)
  L('Sony', 'E 10-20mm f/4 PZ G', 'Sony E', 10, 20, 4),
  L('Sony', 'E 16-50mm f/3.5-5.6 OSS PZ', 'Sony E', 16, 50, 3.5, 5.6),
  L('Sony', 'E 18-135mm f/3.5-5.6 OSS', 'Sony E', 18, 135, 3.5, 5.6),
  L('Sony', 'E 70-350mm f/4.5-6.3 G OSS', 'Sony E', 70, 350, 4.5, 6.3),
  L('Sony', 'E 15mm f/1.4 G', 'Sony E', 15, 15, 1.4),
  L('Sony', 'E 24mm f/1.8 G', 'Sony E', 24, 24, 1.8),
  L('Sony', 'E 35mm f/1.8 OSS', 'Sony E', 35, 35, 1.8),
  // Sigma — multi-mount entries (same optical formula, different SKU)
  L('Sigma', '14mm f/1.4 DG DN | Art', 'Sony FE', 14, 14, 1.4),
  L('Sigma', '14mm f/1.4 DG DN | Art', 'Nikon Z', 14, 14, 1.4),
  L('Sigma', '14mm f/1.4 DG DN | Art', 'Canon RF', 14, 14, 1.4),
  L('Sigma', '20mm f/1.4 DG DN | Art', 'Sony FE', 20, 20, 1.4),
  L('Sigma', '20mm f/1.4 DG DN | Art', 'Nikon Z', 20, 20, 1.4),
  L('Sigma', '24mm f/1.4 DG DN | Art', 'Sony FE', 24, 24, 1.4),
  L('Sigma', '24mm f/1.4 DG DN | Art', 'Nikon Z', 24, 24, 1.4),
  L('Sigma', '24mm f/1.4 DG DN | Art', 'Canon RF', 24, 24, 1.4),
  L('Sigma', '35mm f/1.2 DG DN | Art', 'Sony FE', 35, 35, 1.2),
  L('Sigma', '35mm f/1.2 DG DN | Art', 'Nikon Z', 35, 35, 1.2),
  L('Sigma', '35mm f/1.4 DG DN | Art', 'Sony FE', 35, 35, 1.4),
  L('Sigma', '50mm f/1.2 DG DN | Art', 'Sony FE', 50, 50, 1.2),
  L('Sigma', '50mm f/1.2 DG DN | Art', 'Nikon Z', 50, 50, 1.2),
  L('Sigma', '50mm f/1.4 DG DN | Art', 'Sony FE', 50, 50, 1.4),
  L('Sigma', '50mm f/1.4 DG DN | Art', 'Nikon Z', 50, 50, 1.4),
  L('Sigma', '50mm f/1.4 DG DN | Art', 'Canon RF', 50, 50, 1.4),
  L('Sigma', '85mm f/1.4 DG DN | Art', 'Sony FE', 85, 85, 1.4),
  L('Sigma', '85mm f/1.4 DG DN | Art', 'Nikon Z', 85, 85, 1.4),
  L('Sigma', '85mm f/1.4 DG DN | Art', 'Canon RF', 85, 85, 1.4),
  L('Sigma', '105mm f/2.8 DG DN MACRO | Art', 'Sony FE', 105, 105, 2.8),
  L('Sigma', '105mm f/2.8 DG DN MACRO | Art', 'Nikon Z', 105, 105, 2.8),
  L('Sigma', '105mm f/2.8 DG DN MACRO | Art', 'Canon RF', 105, 105, 2.8),
  L('Sigma', '100-400mm f/5-6.3 DG DN OS | Contemporary', 'Sony FE', 100, 400, 5, 6.3),
  L('Sigma', '100-400mm f/5-6.3 DG DN OS | Contemporary', 'Nikon Z', 100, 400, 5, 6.3),
  L('Sigma', '60-600mm f/4.5-6.3 DG DN OS | Sports', 'Sony FE', 60, 600, 4.5, 6.3),
  L('Sigma', '60-600mm f/4.5-6.3 DG DN OS | Sports', 'Nikon Z', 60, 600, 4.5, 6.3),
  L('Sigma', '150-600mm f/5-6.3 DG DN OS | Sports', 'Sony FE', 150, 600, 5, 6.3),
  L('Sigma', '18-50mm f/2.8 DC DN | Contemporary', 'Sony E', 18, 50, 2.8),
  L('Sigma', '10-18mm f/2.8 DC DN | Contemporary', 'Sony E', 10, 18, 2.8),
  // Tamron
  L('Tamron', '17-28mm f/2.8 Di III RXD', 'Sony FE', 17, 28, 2.8),
  L('Tamron', '17-28mm f/2.8 Di III RXD', 'Nikon Z', 17, 28, 2.8),
  L('Tamron', '20-40mm f/2.8 Di III VXD', 'Sony FE', 20, 40, 2.8),
  L('Tamron', '28-75mm f/2.8 G2 Di III VXD', 'Sony FE', 28, 75, 2.8),
  L('Tamron', '28-75mm f/2.8 G2 Di III VXD', 'Nikon Z', 28, 75, 2.8),
  L('Tamron', '35-150mm f/2-2.8 Di III VXD', 'Sony FE', 35, 150, 2, 2.8),
  L('Tamron', '35-150mm f/2-2.8 Di III VXD', 'Nikon Z', 35, 150, 2, 2.8),
  L('Tamron', '70-180mm f/2.8 Di III VC VXD G2', 'Sony FE', 70, 180, 2.8),
  L('Tamron', '70-180mm f/2.8 Di III VC VXD G2', 'Nikon Z', 70, 180, 2.8),
  L('Tamron', '70-300mm f/4.5-6.3 Di III RXD', 'Sony FE', 70, 300, 4.5, 6.3),
  L('Tamron', '50-400mm f/4.5-6.3 Di III VC VXD', 'Sony FE', 50, 400, 4.5, 6.3),
  L('Tamron', '50-400mm f/4.5-6.3 Di III VC VXD', 'Nikon Z', 50, 400, 4.5, 6.3),
  L('Tamron', '150-500mm f/5-6.7 Di III VC VXD', 'Sony FE', 150, 500, 5, 6.7),
  L('Tamron', '150-500mm f/5-6.7 Di III VC VXD', 'Nikon Z', 150, 500, 5, 6.7),
  L('Tamron', '18-300mm f/3.5-6.3 Di III-A VC VXD', 'Sony E', 18, 300, 3.5, 6.3),
  L('Tamron', '11-20mm f/2.8 Di III-A RXD', 'Sony E', 11, 20, 2.8),
  // Samyang / Rokinon
  L('Samyang', 'AF 12mm f/2.0', 'Sony E', 12, 12, 2),
  L('Samyang', 'AF 12mm f/2.0', 'Nikon Z', 12, 12, 2),
  L('Samyang', 'AF 14mm f/2.8', 'Sony FE', 14, 14, 2.8),
  L('Samyang', 'AF 14mm f/2.8', 'Nikon Z', 14, 14, 2.8),
  L('Samyang', 'AF 24mm f/1.8', 'Sony FE', 24, 24, 1.8),
  L('Samyang', 'AF 35mm f/1.4', 'Sony FE', 35, 35, 1.4),
  L('Samyang', 'AF 45mm f/1.8', 'Sony FE', 45, 45, 1.8),
  L('Samyang', 'AF 75mm f/1.8', 'Sony FE', 75, 75, 1.8),
  L('Samyang', 'AF 135mm f/1.8', 'Sony FE', 135, 135, 1.8),
  // Viltrox
  L('Viltrox', 'AF 13mm f/1.4', 'Sony E', 13, 13, 1.4),
  L('Viltrox', 'AF 13mm f/1.4', 'Nikon Z', 13, 13, 1.4),
  L('Viltrox', 'AF 27mm f/1.2 Pro', 'Nikon Z', 27, 27, 1.2),
  L('Viltrox', 'AF 75mm f/1.2 Pro', 'Sony FE', 75, 75, 1.2),
  L('Viltrox', 'AF 75mm f/1.2 Pro', 'Nikon Z', 75, 75, 1.2),
  // Tokina
  L('Tokina', 'atx-m 33mm f/1.4', 'Sony E', 33, 33, 1.4),
  L('Tokina', 'atx-m 56mm f/1.4', 'Sony E', 56, 56, 1.4),
  L('Tokina', 'FiRIN 20mm f/2 FE AF', 'Sony FE', 20, 20, 2),
  // Zeiss
  L('Zeiss', 'Batis 18mm f/2.8', 'Sony FE', 18, 18, 2.8),
  L('Zeiss', 'Batis 25mm f/2', 'Sony FE', 25, 25, 2),
  L('Zeiss', 'Batis 40mm f/2 CF', 'Sony FE', 40, 40, 2),
  L('Zeiss', 'Batis 85mm f/1.8', 'Sony FE', 85, 85, 1.8),
  L('Zeiss', 'Loxia 21mm f/2.8', 'Sony FE', 21, 21, 2.8),
  L('Zeiss', 'Loxia 35mm f/2', 'Sony FE', 35, 35, 2),
  // Laowa
  L('Laowa', '10-18mm f/4.5-5.6 C-Dreamer', 'Sony FE', 10, 18, 4.5, 5.6),
  L('Laowa', '12mm f/2.8 Zero-D', 'Sony FE', 12, 12, 2.8),
  L('Laowa', '15mm f/2 Zero-D', 'Sony FE', 15, 15, 2),
  L('Laowa', '100mm f/2.8 2:1 Ultra Macro', 'Sony FE', 100, 100, 2.8),
  // Voigtländer
  L('Voigtländer', 'Nokton 35mm f/1.2', 'Sony FE', 35, 35, 1.2),
  L('Voigtländer', 'Nokton 50mm f/1.0', 'Sony FE', 50, 50, 1),
]

/** Widest available f-number (minimum N) at this focal length on a zoom; primes return fixed wide open. */
export function widestApertureAtFocal(l: LensRecord, focalMm: number): number {
  if (l.minMm === l.maxMm) return l.maxApertureWide
  const clamped = Math.min(Math.max(focalMm, l.minMm), l.maxMm)
  const t = (clamped - l.minMm) / (l.maxMm - l.minMm)
  const aw = l.maxApertureWide
  const at = l.maxApertureTele ?? l.maxApertureWide
  return aw + t * (at - aw)
}

export function filterLenses(opts: {
  mount?: LensMount | 'all'
  vendor?: LensVendor | 'all'
  search: string
}): LensRecord[] {
  const q = opts.search.trim().toLowerCase()
  return LENSES.filter((l) => {
    if (opts.mount && opts.mount !== 'all' && l.mount !== opts.mount) return false
    if (opts.vendor && opts.vendor !== 'all' && l.vendor !== opts.vendor) return false
    if (!q) return true
    const hay = `${l.vendor} ${l.name} ${l.mount}`.toLowerCase()
    return hay.includes(q)
  })
}

export const MOUNTS: LensMount[] = [
  'Nikon Z',
  'Nikon F',
  'Canon RF',
  'Canon EF',
  'Canon EF-S',
  'Sony FE',
  'Sony E',
]

export const VENDORS: LensVendor[] = [
  'Nikon',
  'Canon',
  'Sony',
  'Sigma',
  'Tamron',
  'Samyang',
  'Viltrox',
  'Tokina',
  'Zeiss',
  'Laowa',
  'Voigtländer',
]
