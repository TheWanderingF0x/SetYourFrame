# Camera Lab

Interactive **depth of field**, **exposure** (shutter · aperture · ISO), and **untracked astro** shutter guidance. Built with **React**, **TypeScript**, and **Vite**.

**Author:** [TheWanderingF0x on GitHub](https://github.com/TheWanderingF0x).

## Requirements

- [Node.js](https://nodejs.org/) (LTS recommended) with npm

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### GitHub Pages (Jekyll + this app)

The repo root is a minimal **Jekyll** site (`_config.yml`, `index.md`, `_layouts/default.html`). GitHub Actions builds **Camera Lab** with `vite build --base=/<repo>/camera-lab/`, runs Jekyll into `_site`, copies `camera-lab/dist` to `_site/camera-lab/`, and adds `.nojekyll` so assets are not processed by Jekyll again.

After enabling **Pages** (source: GitHub Actions), the app lives at:

`https://<user>.github.io/<repo>/camera-lab/`

If you rename the repository, update `baseurl` in the root `_config.yml` to match `/YourRepoName`.

### Other scripts

| Command | Purpose |
|--------|---------|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Typecheck + production bundle to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |

## Using the app

### Theme and units

- **Theme:** **Light** is the default (better contrast for controls). Use the header **Theme** control for **Light** or **Dark**; the choice is saved in `localStorage` (`camera-lab-theme`).
- **Units:** Defaults to **metric**; switch **Imperial** for distances and DoF readouts. Genre presets convert subject distance for the active unit system.

### Sensor

- Pick a **body / format** preset (Nikon, Canon, Sony, or generic sizes), or enable **Custom dimensions** to set width, height (mm), and horizontal pixel count.
- **Crop factor** is computed vs a **36 × 24 mm** full-frame reference diagonal (~43.27 mm).
- **CoC** (circle of confusion) uses the **diagonal / 1500** rule unless you rely on the same diagonal derived from your custom rectangle.
- **Pixel pitch** (for astro) is `sensor width (mm) × 1000 / horizontal pixels`.

### Lens

- **Catalog**: filter by **mount**, **brand**, and **search** text. Zooms expose a **focal length** slider; maximum aperture at that zoom is interpolated between wide and tele specs in the data.
- **Custom focal length**: bypass the catalog and type any focal length (mm).

Aperture controls enforce that you cannot select an f-number **wider** than the lens allows at the current zoom (smaller f-number = wider opening).

### Exposure and focus

- **Aperture**, **shutter** (seconds or presets), and **ISO** update EV readouts and hints.
- **Subject distance** drives DoF (slider plus numeric field), up to **10 000 m** or **~32 808 ft** (e.g. aircraft at distance). Enable **Treat subject at infinity** for astro or very distant horizons (internally uses a very large subject distance for the thin-lens DoF model).
- **Set distance to hyperfocal** snaps subject distance to the computed hyperfocal distance (in current units).

### Genre presets

Chips load starting values for portrait, landscape, street, astro, macro, sports, event, and product. All controls remain editable afterward. **Astro** also enables infinity focus.

### Depth of field panel

- Summary **cards** highlight **Near focus**, **Far focus**, **Total DoF**, and **Hyperfocal**.
- **Scene visualization**: **camera** icon on the left; SVG **horizontal field-of-view wedge** and a simple **ground** line; **Subject** marker only (no near/far overlays or in-focus band on the diagram). **Drag** the subject or **tap** the track (disabled for infinity focus).
- Distances along the track use a **logarithmic** scale from **0.2 m** (or **1 ft** in imperial) to **10 km** (or the equivalent in feet), so long subjects (e.g. aircraft) stay usable on one strip. Summary cards and the rest of the app still use your **exact** distances.
- **Near / far / total DoF**, **hyperfocal**, **vertical field of view**, and **full-frame equivalent focal length** also appear in the detail grid. Far limit can read **∞** when the formula yields infinity in practice.
- **Diffraction** warning compares the Airy disk scale (~`0.001342 × N` mm) to the CoC.

### Exposure panel

- **EV (ISO 100)** = \(\log_2(N^2 / t)\) with \(t\) in seconds.
- **Scene EV (with ISO)** subtracts \(\log_2(\mathrm{ISO}/100)\) so that raising ISO by one stop moves scene EV by one stop for the same \(N\) and \(t\).
- The three **triangle** bars are **qualitative** (not calibrated light-meter wedges); they are for intuition only.

### Astro (untracked)

- **500 rule**: \(t \approx 500 / (f \times \text{crop})\) seconds — legacy rule of thumb; ignores resolution.
- **NPF-style (simplified)**: \(t \approx (35N + 30p) / f\) with \(p\) = pixel pitch in **micrometres**, \(f\) = focal length in mm, \(N\) = f-number.
- **Suggested max** is the **minimum** of the two (when both are valid). The app compares your current shutter to that value.

For tracked mounts, longer exposures are normal; this section is only for **fixed tripods** without tracking.

## Extending data

### Lenses — `src/data/lenses.ts`

Each entry is a `LensRecord`:

- `vendor`, `name`, `mount`
- `minMm`, `maxMm` (equal for primes)
- `maxApertureWide`, optional `maxApertureTele` for variable-aperture zooms

Use the helper `L(...)` at the bottom of the file or push new objects into `LENSES`. Remount the same optical formula under another `mount` if you support multiple SKUs (e.g. Sigma DN for Z and FE).

### Sensors — `src/data/sensors.ts`

Each `SensorSpec` needs `widthMm`, `heightMm`, and `hPixels` (horizontal resolution for pitch). Add objects to `SENSORS`; `id` must be unique.

### Genre presets — `src/data/genres.ts`

Edit `GENRES`: distances are stored in **metres** (`distanceM`). The UI converts to feet when Imperial is selected.

## Project layout

```
camera-lab/
├── src/
│   ├── App.tsx           # UI and wiring
│   ├── App.css
│   ├── main.tsx
│   ├── index.css
│   ├── data/
│   │   ├── sensors.ts
│   │   ├── lenses.ts
│   │   └── genres.ts
│   └── lib/
│       ├── dof.ts        # Hyperfocal, near/far limits, FOV
│       ├── sceneScale.ts # Log strip mapping for the DoF scene UI
│       ├── exposure.ts   # EV and helpers
│       ├── astro.ts      # 500 rule, NPF-style cap
│       └── units.ts      # Distance formatting
├── index.html
├── package.json
├── vite.config.ts
├── CHANGELOG.md
└── README.md
```

## Theory and limitations

- **Thin-lens geometry** is assumed; real lenses, focus breathing, and pupil magnification are not modeled.
- **CoC** is a print/viewing convention; perceived sharpness varies by output size and viewing distance.
- **Exposure** does not include lens transmission (T-stops), filters, or scene reflectance; EV here is **photometric** for the chosen \(N\), \(t\), ISO only.
- **Astro rules** are approximations; declination, pixel shape, and personal tolerance for trailing stars are not included in the simplified NPF form.

Use manufacturer specs and field tests for critical work. This tool is for **learning and planning**, not a substitute for raw inspection or metering in the field.

## License

Private project (`"private": true` in `package.json`). Add a license file if you open-source the repo.
