# Agent instructions — Tali website

Concise guidance for AI assistants and automation working in this repository.

## Project

- **What:** Static, single-page marketing site for an interior design studio (Hebrew primary, RTL).
- **Stack:** Plain HTML (`index.html`), CSS (`assets/css/styles.css`), vanilla JS (`assets/js/main.js`). No build step unless you add one explicitly.
- **Content:** Studio name, tagline, contact placeholders, and project gallery data live in `assets/js/main.js` (`STUDIO`, `PROJECTS`).

## Conventions

- **Scope:** Change only what the task requires. Avoid drive-by refactors, unrelated files, or new docs unless asked.
- **RTL:** Keep `lang="he"` and `dir="rtl"` on the document; preserve accessibility patterns already in the markup (landmarks, labels, skip link).
- **Assets:** Static files under `assets/` (`images/`, `css/`, `js/`). Paths in HTML and JS are relative to the site root (e.g. `assets/images/...`).
- **Images on static hosts:** Use **simple filenames** (ASCII, no spaces or parentheses) under `assets/images/` so URLs work reliably on GitHub Pages and similar hosts. Prefer `project_1.jpg` over `DSC copy (1).JPG`. Update any JS arrays that list filenames when renaming.
- **New projects in the gallery:** Follow the existing `PROJECTS` entry shape (`id`, `title`, optional `subtitle`, `tags`, `cover`, `images[]`). Reuse `PLACEHOLDER` paths until real assets exist.

## Adding or replacing images (required)

The site is **mobile-first**. Whenever you **add, replace, or drop in** new raster images for the repo (gallery photos, hero, etc.), **compress them before committing**—do not leave full-resolution camera exports in `assets/images/`.

### Automatic compression (agents)

Whenever **any new or updated raster** lands under `assets/images/` as part of your work, **run compression in the same session** before you stop—treat uncompressed gallery assets as an incomplete task.

1. **Default:** From the repo root, run **`python3 scripts/compress_images.py`**. It processes every `.jpg` / `.jpeg` under `assets/images/` with **downscale-only** resizing (long edge cap 2048px; never upscales) and JPEG re-encode via `sips`. Special case: `press_walls_tali_srur_baker.jpg` is capped at 1400px on the long edge—adjust the script if that filename changes or you add another inline/press image with different rules.
2. **Git hook (local):** Enable once per clone: **`git config core.hooksPath .githooks`**. On **macOS**, when you stage any `.jpg` / `.jpeg` under `assets/images/`, **`pre-commit`** runs `scripts/compress_images.py` and re-stages those files. On non-macOS the hook skips compression (prints a message); compress manually or use a Mac before pushing large JPEGs.
3. **PNG / SVG:** The script does not rewrite PNGs. If you add or replace a PNG (e.g. hero, profile), resize/recompress manually if the file is large; keep heroes roughly **1024–1600px** wide and **small** file size. `placeholder.svg` need not be raster-compressed.

### Manual pipeline (JPEG, when not using the script)

Target **max long edge 2048px**, then encode with **mozjpeg** at **quality ~82**, **progressive**, **optimize**:

1. **Resize (downscale only):** Do **not** use `sips -Z 2048` by itself—it can **upscale** images smaller than 2048px. Only shrink when needed: compute width/height so the long edge is 2048px, then e.g. `sips -z <height> <width> input.jpg --out /tmp/step.jpg` (macOS), or use `scripts/compress_images.py`.
2. Re-encode: `djpeg -fast -dct float -ppm /tmp/step.jpg | cjpeg -quality 82 -optimize -progressive -outfile output.jpg`

Use the same **`.jpg` / `.JPG`** extension pattern as sibling files in that folder. Replace the on-disk file (or write the final file) under `assets/images/...` after compression.

**Exceptions:** `placeholder.svg` need not be raster-compressed. The **hero** (`hero-interior.png`) is already web-sized (1024px-wide); if you replace it, keep dimensions modest (~1024–1600px wide) and prefer a **small** PNG or JPEG—do not commit a multi-megabyte source.

If `sips` / `djpeg` / `cjpeg` are unavailable, use an equivalent (resize long edge ≤2048px **without upscaling**, sensible JPEG quality, progressive when the tool supports it) and state what you used.

## Quality bar

- Match existing naming, formatting, and comment level in touched files.
- After UI or layout changes, sanity-check in a browser (mobile menu, filters, lightbox, forms).
- Do not strip or weaken accessibility attributes without a clear, stated reason.

## What not to do

- Do not commit secrets (API keys, real personal contact data) unless the project owner explicitly wants them in-repo.
- Do not replace the static approach with a framework unless the owner requests it.
