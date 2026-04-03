# Changelog

## 2026-04-04

- **GitHub Pages:** Root Jekyll site (`_config.yml`, `index.md`, `_layouts/default.html`) plus workflow update: build Vite with `--base=/<repo>/camera-lab/`, merge `dist` into `_site/camera-lab/`, add `.nojekyll`.
- **Numbers:** All displayed measurements and readouts use **at most 2 decimal places** via `formatMax2Decimals` in `units.ts` and updated `formatDistance`.
- **DoF scene:** Removed near/far overlay labels, near/far SVG markers, ground **focus band**, and its pulse animation; visualization shows **FOV wedge**, ground line, and **Subject** only (aligned to cone geometry).
- **DoF scene (earlier):** Logarithmic distance strip; draggable Subject; camera icon; `sceneScale.ts`. Removed unused `dofBarPositions` from `dof.ts`.
- **UI:** Default metric (imperial still available); subject distance up to **10 km** with slider + number input; DoF summary cards and interactive scene strip.
- Removed hero “Inspired by Depth Of Field Simulator” line; footer links [TheWanderingF0x](https://github.com/TheWanderingF0x).
- **Docs:** README updated (author link, distance limits, DoF visualization, default units).
- Added **README.md** documentation: quick start, feature tour, formulas (DoF, EV, astro), data extension guides, project layout, and limitations.
- Initial **Camera Lab** app (Vite + React + TypeScript): depth of field / hyperfocal (thin-lens model, CoC = diagonal/1500), exposure readouts (EV at ISO 100 and scene EV with ISO), shutter / aperture / ISO controls with motion and noise hints, qualitative exposure-triangle bars.
- Sensor presets: generic formats plus representative Nikon, Canon, and Sony bodies; optional custom sensor size and horizontal resolution for pixel pitch.
- Lens catalog: Nikon Z/F, Canon RF/EF/EF-S, Sony FE/E plus Sigma, Tamron, Samyang, Viltrox, Tokina, Zeiss, Laowa, Voigtländer — filterable by mount, brand, and search; custom focal-length mode; zoom focal slider with variable max aperture by position.
- Genre presets (portrait, landscape, street, astro, macro, sports, event, product).
- Astro panel: 500 rule and simplified NPF-style untracked shutter cap vs current shutter; infinity-focus option for distant subjects.
- UI styling and dark mode via `prefers-color-scheme`.
