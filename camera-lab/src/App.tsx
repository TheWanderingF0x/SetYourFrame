import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { SENSORS, cocMm, cropFactor, pixelPitchMicrons, type SensorSpec } from './data/sensors'
import {
  LENSES,
  MOUNTS,
  VENDORS,
  filterLenses,
  widestApertureAtFocal,
  type LensMount,
  type LensRecord,
  type LensVendor,
} from './data/lenses'
import { GENRES, type GenreId } from './data/genres'
import { computeDof } from './lib/dof'
import { metersFromStripT, stripMinMaxMeters, stripTFromMeters } from './lib/sceneScale'
import {
  describeMotionBlur,
  describeNoiseRisk,
  evAtIso100,
  evScene,
} from './lib/exposure'
import { computeAstro } from './lib/astro'
import { formatDistance, formatMax2Decimals, type UnitSystem } from './lib/units'

const MAX_SUBJECT_M = 10_000
const MAX_SUBJECT_FT = MAX_SUBJECT_M * 3.280839895013123

const SHUTTER_PRESETS = [
  { label: '1/8000', s: 1 / 8000 },
  { label: '1/4000', s: 1 / 4000 },
  { label: '1/2000', s: 1 / 2000 },
  { label: '1/1000', s: 1 / 1000 },
  { label: '1/500', s: 1 / 500 },
  { label: '1/250', s: 1 / 250 },
  { label: '1/125', s: 1 / 125 },
  { label: '1/60', s: 1 / 60 },
  { label: '1/30', s: 1 / 30 },
  { label: '1/15', s: 1 / 15 },
  { label: '1s', s: 1 },
  { label: '15s', s: 15 },
  { label: '30s', s: 30 },
]

const APERTURE_STOPS = [0.95, 1.2, 1.4, 1.8, 2, 2.8, 3.5, 4, 5.6, 8, 11, 16, 22]

function inchesFromDisplay(value: number, units: UnitSystem): number {
  return units === 'metric' ? value / 0.0254 : value * 12
}

function displayFromInches(inches: number, units: UnitSystem): number {
  return units === 'metric' ? inches * 0.0254 : inches / 12
}

function formatShutter(s: number): string {
  if (s >= 1) return `${formatMax2Decimals(s)} s`
  const inv = Math.round(1 / s)
  return `1/${inv}`
}

function nearSameShutter(a: number, b: number): boolean {
  if (a <= 0 || b <= 0) return false
  return Math.abs(a - b) / Math.max(a, b) < 0.02
}

function useSensor(
  sensorId: string,
  custom: { w: number; h: number; hPx: number },
  useCustom: boolean,
): SensorSpec {
  return useMemo(() => {
    if (useCustom) {
      return {
        id: 'custom',
        label: 'Custom sensor',
        brand: 'Generic',
        widthMm: custom.w,
        heightMm: custom.h,
        hPixels: Math.max(1000, custom.hPx),
      }
    }
    return SENSORS.find((s) => s.id === sensorId) ?? SENSORS[0]
  }, [sensorId, custom, useCustom])
}

export default function App() {
  const [units, setUnits] = useState<UnitSystem>('metric')
  const [sensorId, setSensorId] = useState(SENSORS[0].id)
  const [customSensor, setCustomSensor] = useState(false)
  const [customW, setCustomW] = useState(36)
  const [customH, setCustomH] = useState(24)
  const [customHPx, setCustomHPx] = useState(6000)

  const [lensMode, setLensMode] = useState<'catalog' | 'custom'>('catalog')
  const [mountFilter, setMountFilter] = useState<LensMount | 'all'>('all')
  const [vendorFilter, setVendorFilter] = useState<LensVendor | 'all'>('all')
  const [lensQuery, setLensQuery] = useState('')
  const [selectedLensId, setSelectedLensId] = useState(LENSES[0].id)
  const [customFL, setCustomFL] = useState(50)
  const [zoomFocal, setZoomFocal] = useState(50)

  const [aperture, setAperture] = useState(2.8)
  const [shutterSec, setShutterSec] = useState(1 / 125)
  const [iso, setIso] = useState(400)

  const [distanceDisplay, setDistanceDisplay] = useState(3)
  const [focusInfinity, setFocusInfinity] = useState(false)
  const [draggingSubject, setDraggingSubject] = useState(false)

  const stripRef = useRef<HTMLDivElement>(null)
  const draggingSubjectRef = useRef(false)

  const sensor = useSensor(sensorId, { w: customW, h: customH, hPx: customHPx }, customSensor)

  const filteredLenses = useMemo(
    () => filterLenses({ mount: mountFilter, vendor: vendorFilter, search: lensQuery }),
    [mountFilter, vendorFilter, lensQuery],
  )

  useEffect(() => {
    if (lensMode !== 'catalog' || filteredLenses.length === 0) return
    if (!filteredLenses.some((l) => l.id === selectedLensId)) {
      const first = filteredLenses[0]
      setSelectedLensId(first.id)
      const mid = (first.minMm + first.maxMm) / 2
      setZoomFocal(first.minMm === first.maxMm ? first.minMm : mid)
    }
  }, [filteredLenses, lensMode, selectedLensId])

  const selectedLens: LensRecord | undefined = useMemo(
    () => LENSES.find((l) => l.id === selectedLensId),
    [selectedLensId],
  )

  const focalLength = useMemo(() => {
    if (lensMode === 'custom') return customFL
    if (!selectedLens) return customFL
    if (selectedLens.minMm === selectedLens.maxMm) return selectedLens.minMm
    return zoomFocal
  }, [lensMode, customFL, selectedLens, zoomFocal])

  const widestN = useMemo(() => {
    if (lensMode === 'custom') return 1.0
    if (!selectedLens) return 1.0
    return widestApertureAtFocal(selectedLens, focalLength)
  }, [lensMode, selectedLens, focalLength])

  const subjectInches = focusInfinity ? 1e12 * 25.4 : inchesFromDisplay(distanceDisplay, units)
  const subjectMm = subjectInches * 25.4

  const c = cocMm(sensor)
  const crop = cropFactor(sensor)
  const pitch = pixelPitchMicrons(sensor)

  const dof = useMemo(
    () =>
      computeDof(
        {
          focalLengthMm: focalLength,
          aperture,
          cocMm: c,
          subjectDistanceMm: subjectMm,
        },
        sensor.heightMm,
        crop,
      ),
    [focalLength, aperture, c, subjectMm, sensor.heightMm, crop],
  )

  const { minM: stripMinM, maxM: stripMaxM } = stripMinMaxMeters(units)
  const subjectMeters = subjectMm / 1000

  const subjectStripT = useMemo(
    () => (focusInfinity ? 1 : stripTFromMeters(subjectMeters, stripMinM, stripMaxM)),
    [focusInfinity, subjectMeters, stripMinM, stripMaxM],
  )

  const horizontalFovDeg = useMemo(
    () => (2 * Math.atan(sensor.widthMm / (2 * focalLength)) * 180) / Math.PI,
    [sensor.widthMm, focalLength],
  )

  const coneGeom = useMemo(() => {
    const vbW = 100
    const apexX = 8
    const axisY = 28
    const farX = 97
    const dist = farX - apexX
    const halfRad = (horizontalFovDeg * Math.PI) / 360
    const spread = Math.min(20, dist * Math.tan(halfRad))
    const coneD = `M ${apexX} ${axisY} L ${farX} ${axisY - spread} L ${farX} ${axisY + spread} Z`
    const groundY = 34
    const subX = apexX + subjectStripT * dist
    return {
      coneD,
      groundY,
      apexX,
      axisY,
      farLineEnd: farX,
      hudSubjectPct: (subX / vbW) * 100,
    }
  }, [horizontalFovDeg, subjectStripT])

  const astro = useMemo(
    () =>
      computeAstro({
        focalLengthMm: focalLength,
        aperture,
        cropFactor: crop,
        pixelPitchMicrons: pitch,
      }),
    [focalLength, aperture, crop, pitch],
  )

  const ev100 = evAtIso100(aperture, shutterSec)
  const evS = evScene(aperture, shutterSec, iso)
  const diffractionWarn = aperture > dof.diffractionLimitedAperture

  const subjectDistMin = units === 'metric' ? 0.2 : 1
  const subjectDistMax = units === 'metric' ? MAX_SUBJECT_M : MAX_SUBJECT_FT
  const subjectSliderStep = units === 'metric' ? 1 : 5

  const clampDistance = (v: number) =>
    Math.min(subjectDistMax, Math.max(subjectDistMin, v))

  const updateDistanceFromClientX = useCallback(
    (clientX: number) => {
      const el = stripRef.current
      if (!el || focusInfinity) return
      const r = el.getBoundingClientRect()
      const w = r.width
      if (w <= 0) return
      const t = Math.min(1, Math.max(0, (clientX - r.left) / w))
      const m = metersFromStripT(t, stripMinM, stripMaxM)
      const display = units === 'metric' ? m : m / 0.3048
      setDistanceDisplay(
        Math.min(subjectDistMax, Math.max(subjectDistMin, display)),
      )
    },
    [
      focusInfinity,
      stripMinM,
      stripMaxM,
      units,
      subjectDistMin,
      subjectDistMax,
    ],
  )

  const applyGenre = (id: GenreId) => {
    const g = GENRES.find((x) => x.id === id)
    if (!g) return
    const dist =
      units === 'metric' ? g.distanceM : g.distanceM * 3.280839895013123
    setDistanceDisplay(dist)
    setCustomFL(g.focalMm)
    const lens = LENSES.find((l) => l.id === selectedLensId)
    if (lens && lensMode === 'catalog') {
      setZoomFocal(Math.min(Math.max(g.focalMm, lens.minMm), lens.maxMm))
    }
    setAperture(g.aperture)
    setShutterSec(g.shutterSec)
    setIso(g.iso)
    setFocusInfinity(id === 'astro')
  }

  const onPickLens = (id: string) => {
    setSelectedLensId(id)
    const l = LENSES.find((x) => x.id === id)
    if (l) {
      const mid = (l.minMm + l.maxMm) / 2
      setZoomFocal(mid)
      const w = widestApertureAtFocal(l, l.minMm === l.maxMm ? l.minMm : mid)
      setAperture(Math.max(w, Math.min(5.6, w * 1.4)))
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <div>
          <h1>Camera Lab</h1>
          <p className="tagline">
            Depth of field, exposure (shutter · aperture · ISO), and untracked astro limits in one
            workspace.
          </p>
        </div>
        <div className="hero-actions">
          <label className="seg">
            <span>Units</span>
            <select value={units} onChange={(e) => setUnits(e.target.value as UnitSystem)}>
              <option value="metric">Metric</option>
              <option value="imperial">Imperial</option>
            </select>
          </label>
        </div>
      </header>

      <section className="panel">
        <h2>Genre presets</h2>
        <p className="hint">
          Starting points for portrait, landscape, street, astro, and more — all knobs stay editable.
        </p>
        <div className="chips">
          {GENRES.map((g) => (
            <button key={g.id} type="button" className="chip" onClick={() => applyGenre(g.id)}>
              <strong>{g.label}</strong>
              <span>{g.blurb}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel grid-two">
        <div>
          <h2>Sensor</h2>
          <label className="field">
            <span>Body / format</span>
            <select
              value={sensorId}
              disabled={customSensor}
              onChange={(e) => setSensorId(e.target.value)}
            >
              {SENSORS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.brand !== 'Generic' ? `${s.brand} — ` : ''}
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={customSensor}
              onChange={(e) => setCustomSensor(e.target.checked)}
            />
            Custom dimensions (mm)
          </label>
          {customSensor && (
            <div className="row-3">
              <label>
                Width
                <input
                  type="number"
                  min={1}
                  step={0.1}
                  value={customW}
                  onChange={(e) => setCustomW(Number(e.target.value))}
                />
              </label>
              <label>
                Height
                <input
                  type="number"
                  min={1}
                  step={0.1}
                  value={customH}
                  onChange={(e) => setCustomH(Number(e.target.value))}
                />
              </label>
              <label>
                H-px (astro)
                <input
                  type="number"
                  min={1000}
                  step={100}
                  value={customHPx}
                  onChange={(e) => setCustomHPx(Number(e.target.value))}
                />
              </label>
            </div>
          )}
          <dl className="stats compact">
            <div>
              <dt>Crop (vs 36×24)</dt>
              <dd>{formatMax2Decimals(crop)}×</dd>
            </div>
            <div>
              <dt>CoC (diag/1500)</dt>
              <dd>{formatMax2Decimals(c * 1000)} mm</dd>
            </div>
            <div>
              <dt>Pixel pitch</dt>
              <dd>{formatMax2Decimals(pitch)} µm</dd>
            </div>
          </dl>
        </div>

        <div>
          <h2>Lens</h2>
          <div className="seg-inline">
            <button
              type="button"
              className={lensMode === 'catalog' ? 'active' : ''}
              onClick={() => setLensMode('catalog')}
            >
              Catalog
            </button>
            <button
              type="button"
              className={lensMode === 'custom' ? 'active' : ''}
              onClick={() => setLensMode('custom')}
            >
              Custom focal length
            </button>
          </div>
          {lensMode === 'catalog' ? (
            <>
              <p className="hint small">
                Extensible list in <code>src/data/lenses.ts</code> — add OEM and third-party SKUs as
                needed.
              </p>
              <div className="row-3">
                <label>
                  Mount
                  <select
                    value={mountFilter}
                    onChange={(e) => setMountFilter(e.target.value as LensMount | 'all')}
                  >
                    <option value="all">All mounts</option>
                    {MOUNTS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Brand
                  <select
                    value={vendorFilter}
                    onChange={(e) => setVendorFilter(e.target.value as LensVendor | 'all')}
                  >
                    <option value="all">All brands</option>
                    {VENDORS.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="field">
                <span>Search</span>
                <input
                  type="search"
                  value={lensQuery}
                  onChange={(e) => setLensQuery(e.target.value)}
                  placeholder="e.g. 70-200, Sigma, GM…"
                />
              </label>
              <label className="field">
                <span>Lens</span>
                {filteredLenses.length === 0 ? (
                  <p className="hint small">No lenses match — widen filters or clear search.</p>
                ) : (
                  <select
                    value={selectedLensId}
                    onChange={(e) => onPickLens(e.target.value)}
                    size={6}
                    className="lens-select"
                  >
                    {filteredLenses.map((l) => (
                      <option key={l.id} value={l.id}>
                        [{l.mount}] {l.vendor} {l.name}
                      </option>
                    ))}
                  </select>
                )}
              </label>
              {selectedLens && selectedLens.minMm !== selectedLens.maxMm && (
                <label className="field">
                  <span>
                    Zoom position ({selectedLens.minMm}–{selectedLens.maxMm} mm)
                  </span>
                  <input
                    type="range"
                    min={selectedLens.minMm}
                    max={selectedLens.maxMm}
                    step={1}
                    value={zoomFocal}
                    onChange={(e) => setZoomFocal(Number(e.target.value))}
                  />
                  <div className="range-val">{zoomFocal} mm</div>
                </label>
              )}
            </>
          ) : (
            <label className="field">
              <span>Focal length (mm)</span>
              <input
                type="number"
                min={3}
                max={1200}
                value={customFL}
                onChange={(e) => setCustomFL(Number(e.target.value))}
              />
            </label>
          )}
        </div>
      </section>

      <section className="panel">
        <h2>Exposure & focus</h2>
        <div className="grid-three">
          <label className="field">
            <span>
              Aperture (max wide open ≈ f/{formatMax2Decimals(widestN)} at this zoom)
            </span>
            <select
              value={(() => {
                const m = APERTURE_STOPS.find((n) => Math.abs(n - aperture) < 0.001)
                return m !== undefined ? String(m) : ''
              })()}
              onChange={(e) => {
                const v = e.target.value
                if (!v) return
                setAperture(Number(v))
              }}
            >
              <option value="">Full-stop presets…</option>
              {APERTURE_STOPS.filter((n) => n >= widestN - 1e-6).map((n) => (
                <option key={n} value={n}>
                  f/{n}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={widestN}
              max={45}
              step={0.1}
              value={aperture}
              onChange={(e) => setAperture(Number(e.target.value))}
            />
          </label>
          <label className="field">
            <span>Shutter speed</span>
            <select
              value={SHUTTER_PRESETS.find((p) => nearSameShutter(p.s, shutterSec))?.label ?? ''}
              onChange={(e) => {
                const p = SHUTTER_PRESETS.find((x) => x.label === e.target.value)
                if (p) setShutterSec(p.s)
              }}
            >
              <option value="">Presets…</option>
              {SHUTTER_PRESETS.map((p) => (
                <option key={p.label} value={p.label}>
                  {p.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1 / 8000}
              max={3600}
              step={0.0001}
              value={shutterSec}
              onChange={(e) => setShutterSec(Number(e.target.value))}
            />
            <span className="mini">{describeMotionBlur(shutterSec)}</span>
          </label>
          <label className="field">
            <span>ISO</span>
            <input
              type="range"
              min={50}
              max={102400}
              step={50}
              value={iso}
              onChange={(e) => setIso(Number(e.target.value))}
            />
            <div className="range-val">{iso}</div>
            <span className="mini">{describeNoiseRisk(iso)}</span>
          </label>
        </div>
        <label className="field">
          <span>
            Subject distance ({units === 'metric' ? 'm' : 'ft'}, up to{' '}
            {units === 'metric' ? `${MAX_SUBJECT_M.toLocaleString()} m` : `${Math.round(MAX_SUBJECT_FT).toLocaleString()} ft`}
            )
          </span>
          <div className="distance-inputs">
            <input
              type="range"
              min={subjectDistMin}
              max={subjectDistMax}
              step={subjectSliderStep}
              value={clampDistance(distanceDisplay)}
              disabled={focusInfinity}
              onChange={(e) => setDistanceDisplay(clampDistance(Number(e.target.value)))}
            />
            <input
              type="number"
              className="distance-number"
              min={subjectDistMin}
              max={subjectDistMax}
              step={units === 'metric' ? 0.1 : 1}
              value={distanceDisplay}
              disabled={focusInfinity}
              aria-label={`Subject distance in ${units === 'metric' ? 'metres' : 'feet'}`}
              onChange={(e) => {
                const v = Number(e.target.value)
                if (!Number.isFinite(v)) return
                setDistanceDisplay(clampDistance(v))
              }}
            />
          </div>
          <div className="range-val">
            {focusInfinity
              ? '∞ (infinity focus)'
              : `${formatMax2Decimals(distanceDisplay)} ${units === 'metric' ? 'm' : 'ft'}`}
          </div>
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={focusInfinity}
            onChange={(e) => setFocusInfinity(e.target.checked)}
          />
          Treat subject at infinity (astro / distant horizon)
        </label>
        {diffractionWarn && (
          <p className="warn">
            Diffraction may soften fine detail above ~f/{formatMax2Decimals(dof.diffractionLimitedAperture)} on
            this sensor (Airy disk vs CoC).
          </p>
        )}
      </section>

      <section className="panel stats-panel">
        <h2>Depth of field</h2>
        <div className="dof-summary">
          <div className="dof-summary-card">
            <span className="dof-summary-label">Near focus</span>
            <strong className="dof-summary-val">{formatDistance(dof.nearLimitMm / 25.4, units)}</strong>
          </div>
          <div className="dof-summary-card">
            <span className="dof-summary-label">Far focus</span>
            <strong className="dof-summary-val">
              {dof.farIsInfinity ? '∞' : formatDistance(dof.farLimitMm / 25.4, units)}
            </strong>
          </div>
          <div className="dof-summary-card">
            <span className="dof-summary-label">Total DoF</span>
            <strong className="dof-summary-val">
              {dof.farIsInfinity
                ? '∞'
                : formatDistance((dof.farLimitMm - dof.nearLimitMm) / 25.4, units)}
            </strong>
          </div>
          <div className="dof-summary-card">
            <span className="dof-summary-label">Hyperfocal</span>
            <strong className="dof-summary-val">{formatDistance(dof.hyperfocalMm / 25.4, units)}</strong>
          </div>
        </div>

        <p className="hint small dof-viz-caption">
          Horizontal FOV {formatMax2Decimals(horizontalFovDeg)}° (side view). Distance along the track is{' '}
          <strong>logarithmic</strong> ({units === 'metric' ? '0.2 m' : '1 ft'} →{' '}
          {units === 'metric'
            ? `${formatMax2Decimals(stripMaxM / 1000)} km`
            : `${Math.round(MAX_SUBJECT_FT).toLocaleString()} ft`}
          ). <strong>Drag the subject</strong> or tap the track. Numbers above use your exact distances.
        </p>

        <div className="dof-scene">
          <div className="dof-camera-col">
            <svg className="dof-camera-icon" viewBox="0 0 48 40" aria-hidden>
              <rect x="6" y="14" width="22" height="18" rx="3" fill="currentColor" opacity="0.92" />
              <circle cx="30" cy="23" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="30" cy="23" r="5" className="dof-camera-lens-inner" />
              <rect x="10" y="18" width="10" height="10" rx="1" className="dof-camera-screen" />
            </svg>
            <span className="dof-camera-label">Camera</span>
          </div>

          <div
            ref={stripRef}
            className={`dof-drag-track${focusInfinity ? ' dof-drag-track--locked' : ''}${draggingSubject ? ' is-dragging' : ''}`}
            onPointerDown={(e) => {
              if (focusInfinity) return
              if ((e.target as HTMLElement).closest('.dof-subject-handle')) return
              updateDistanceFromClientX(e.clientX)
            }}
          >
            <svg
              className="dof-cone-svg"
              viewBox="0 0 100 40"
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <linearGradient id="coneFillGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--dof-a)" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="var(--dof-b)" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <path d={coneGeom.coneD} fill="url(#coneFillGrad)" className="dof-cone-wedge" />
              <line
                x1={coneGeom.apexX}
                y1={coneGeom.groundY}
                x2={coneGeom.farLineEnd}
                y2={coneGeom.groundY}
                className="dof-ground-line"
              />
            </svg>

            <div className="dof-track-overlay">
              <button
                type="button"
                className="dof-subject-handle"
                style={{ left: `${coneGeom.hudSubjectPct}%` }}
                disabled={focusInfinity}
                aria-label="Drag horizontally to set subject distance"
                onPointerDown={(e) => {
                  if (focusInfinity) return
                  e.stopPropagation()
                  e.preventDefault()
                  draggingSubjectRef.current = true
                  setDraggingSubject(true)
                  ;(e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId)
                  updateDistanceFromClientX(e.clientX)
                }}
                onPointerMove={(e) => {
                  if (!draggingSubjectRef.current) return
                  updateDistanceFromClientX(e.clientX)
                }}
                onPointerUp={(e) => {
                  draggingSubjectRef.current = false
                  setDraggingSubject(false)
                  try {
                    e.currentTarget.releasePointerCapture(e.pointerId)
                  } catch {
                    /* already released */
                  }
                }}
                onLostPointerCapture={() => {
                  draggingSubjectRef.current = false
                  setDraggingSubject(false)
                }}
              >
                <svg className="dof-subject-icon" viewBox="0 0 40 56" aria-hidden>
                  <circle cx="20" cy="10" r="8" fill="currentColor" />
                  <path
                    d="M20 20 L20 42 M8 28 L32 28 M14 48 L20 38 L26 48"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="dof-subject-cap">Subject</span>
              </button>
            </div>

            <div className="dof-axis dof-axis--track">
              <span className="dof-axis-muted">{units === 'metric' ? '0.2 m' : '1 ft'}</span>
              <span>Distance (log) → ∞</span>
              <span>∞</span>
            </div>
          </div>
        </div>

        <dl className="stats">
          <div>
            <dt>Near limit</dt>
            <dd>{formatDistance(dof.nearLimitMm / 25.4, units)}</dd>
          </div>
          <div>
            <dt>Far limit</dt>
            <dd>{dof.farIsInfinity ? '∞' : formatDistance(dof.farLimitMm / 25.4, units)}</dd>
          </div>
          <div>
            <dt>Total DoF</dt>
            <dd>
              {dof.farIsInfinity
                ? '∞'
                : formatDistance((dof.farLimitMm - dof.nearLimitMm) / 25.4, units)}
            </dd>
          </div>
          <div>
            <dt>Hyperfocal</dt>
            <dd>{formatDistance(dof.hyperfocalMm / 25.4, units)}</dd>
          </div>
          <div>
            <dt>Vertical FOV</dt>
            <dd>{formatMax2Decimals(dof.verticalFovDeg)}°</dd>
          </div>
          <div>
            <dt>FF equivalent focal</dt>
            <dd>{formatMax2Decimals(dof.equivalentFocalMm)} mm</dd>
          </div>
        </dl>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            const hi = dof.hyperfocalMm / 25.4
            setFocusInfinity(false)
            setDistanceDisplay(displayFromInches(hi, units))
          }}
        >
          Set distance to hyperfocal
        </button>
      </section>

      <section className="panel grid-two">
        <div>
          <h2>Exposure</h2>
          <dl className="stats">
            <div>
              <dt>EV (ISO 100)</dt>
              <dd>{Number.isFinite(ev100) ? formatMax2Decimals(ev100) : '—'}</dd>
            </div>
            <div>
              <dt>Scene EV (with ISO)</dt>
              <dd>{Number.isFinite(evS) ? formatMax2Decimals(evS) : '—'}</dd>
            </div>
            <div>
              <dt>Shutter</dt>
              <dd>{formatShutter(shutterSec)}</dd>
            </div>
          </dl>
          <div className="triangle">
            <div className="tri-leg">
              <span className="tri-label">Time</span>
              <div className="tri-meter" style={{ height: `${Math.min(100, (Math.log2(shutterSec * 1000 + 1) / 20) * 100)}%` }} />
            </div>
            <div className="tri-leg">
              <span className="tri-label">Aperture</span>
              <div className="tri-meter" style={{ height: `${Math.min(100, (aperture / 22) * 100)}%` }} />
            </div>
            <div className="tri-leg">
              <span className="tri-label">ISO</span>
              <div className="tri-meter" style={{ height: `${Math.min(100, (Math.log2(iso / 50) / Math.log2(2048)) * 100)}%` }} />
            </div>
          </div>
          <p className="hint small">
            Bars are qualitative only (not calibrated EV wedges). Same scene brightness: opening one
            stop can be traded for halving ISO or doubling shutter time.
          </p>
        </div>
        <div>
          <h2>Astro (untracked)</h2>
          <dl className="stats">
            <div>
              <dt>500 rule (approx.)</dt>
              <dd>{formatMax2Decimals(astro.maxSeconds500Rule)} s</dd>
            </div>
            <div>
              <dt>NPF-style cap</dt>
              <dd>{formatMax2Decimals(astro.maxSecondsNpf)} s</dd>
            </div>
            <div>
              <dt>Suggested max</dt>
              <dd>{formatMax2Decimals(astro.recommended)} s</dd>
            </div>
          </dl>
          <p className="hint small">{astro.note}</p>
          <p className="hint small">
            Your shutter is <strong>{formatShutter(shutterSec)}</strong>
            {shutterSec > astro.recommended * 1.05 ? (
              <span className="warn-inline"> — likely visible trailing without a tracker.</span>
            ) : (
              <span> — within the simplified untracked guideline.</span>
            )}
          </p>
        </div>
      </section>

      <footer className="footer">
        <p>
          Formulas: thin-lens DoF / hyperfocal; exposure EV; simplified NPF-style star cap. Not a
          substitute for field tests or manufacturer specs.
        </p>
        <p className="footer-author">
          <a href="https://github.com/TheWanderingF0x" target="_blank" rel="noreferrer">
            GitHub — TheWanderingF0x
          </a>
        </p>
      </footer>
    </div>
  )
}
