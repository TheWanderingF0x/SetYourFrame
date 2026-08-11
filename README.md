# Set Your Frame

Interactive photography calculators: **depth of field**, **exposure** (shutter · aperture · ISO), and **untracked astro** shutter guidance.

The interactive app is **Camera Lab** (`camera-lab/`). This repo root is a small **Jekyll** landing page for GitHub Pages.

**Live:** https://thewanderingf0x.github.io/SetYourFrame/camera-lab/

**Author:** [TheWanderingF0x](https://github.com/TheWanderingF0x)

## Quick start

```bash
cd camera-lab
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

Full feature docs, formulas, and data guides: [`camera-lab/README.md`](camera-lab/README.md).

## GitHub Pages

Push to `main` runs [`.github/workflows/jekyll-gh-pages.yml`](.github/workflows/jekyll-gh-pages.yml): builds Camera Lab with Vite, builds the Jekyll landing page, merges into `_site`, and deploys.

If you rename the repository, update `baseurl` in `_config.yml` to `/YourRepoName`.

## License

MIT — see [LICENSE](LICENSE).

## Security

No API keys or secrets are used. See [SECURITY.md](SECURITY.md).
