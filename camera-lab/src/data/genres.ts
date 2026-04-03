export type GenreId =
  | 'portrait'
  | 'landscape'
  | 'street'
  | 'astro'
  | 'macro'
  | 'sports'
  | 'event'
  | 'product'

export interface GenrePreset {
  id: GenreId
  label: string
  blurb: string
  /** Starting hints — user can still tweak */
  distanceM: number
  focalMm: number
  aperture: number
  shutterSec: number
  iso: number
}

export const GENRES: GenrePreset[] = [
  {
    id: 'portrait',
    label: 'Portrait',
    blurb: 'Isolate subject; moderate tele, wide aperture, careful focus.',
    distanceM: 2.5,
    focalMm: 85,
    aperture: 1.8,
    shutterSec: 1 / 250,
    iso: 200,
  },
  {
    id: 'landscape',
    label: 'Landscape',
    blurb: 'Deep focus; stop down, use hyperfocal or focus stacking.',
    distanceM: 15,
    focalMm: 24,
    aperture: 8,
    shutterSec: 1 / 60,
    iso: 100,
  },
  {
    id: 'street',
    label: 'Street',
    blurb: 'Flexible zone focus; 28–50mm, faster shutter for candid motion.',
    distanceM: 5,
    focalMm: 35,
    aperture: 2.8,
    shutterSec: 1 / 250,
    iso: 400,
  },
  {
    id: 'astro',
    label: 'Astrophotography',
    blurb: 'Untracked: short shutter vs star trails; high ISO; wide & fast.',
    distanceM: 1000,
    focalMm: 14,
    aperture: 2.8,
    shutterSec: 15,
    iso: 3200,
  },
  {
    id: 'macro',
    label: 'Macro / product',
    blurb: 'Tiny DoF; tripod, small apertures or focus stack.',
    distanceM: 0.35,
    focalMm: 100,
    aperture: 11,
    shutterSec: 1 / 8,
    iso: 200,
  },
  {
    id: 'sports',
    label: 'Sports / wildlife',
    blurb: 'Freeze motion; long lens, fast shutter, ISO as needed.',
    distanceM: 25,
    focalMm: 400,
    aperture: 4,
    shutterSec: 1 / 2000,
    iso: 800,
  },
  {
    id: 'event',
    label: 'Event / wedding',
    blurb: 'Balance ambient; zoom versatility, moderate ISO.',
    distanceM: 6,
    focalMm: 70,
    aperture: 2.8,
    shutterSec: 1 / 125,
    iso: 1600,
  },
  {
    id: 'product',
    label: 'Studio / product',
    blurb: 'Controlled light; base ISO, aperture for desired DoF.',
    distanceM: 1.2,
    focalMm: 90,
    aperture: 5.6,
    shutterSec: 1 / 125,
    iso: 100,
  },
]
