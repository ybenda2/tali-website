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

**Default pipeline (JPEG):** Target **max long edge 2048px**, then encode with **mozjpeg** at **quality ~82**, **progressive**, **optimize**:

1. Resize: `sips -Z 2048 input.jpg --out /tmp/step.jpg` (macOS).
2. Re-encode: `djpeg -fast -dct float -ppm /tmp/step.jpg | cjpeg -quality 82 -optimize -progressive -outfile output.jpg`

Use the same **`.jpg` / `.JPG`** extension pattern as sibling files in that folder. Replace the on-disk file (or write the final file) under `assets/images/...` after compression.

**Exceptions:** `placeholder.svg` need not be raster-compressed. The **hero** (`hero-interior.png`) is already web-sized (1024px-wide); if you replace it, keep dimensions modest (~1024–1600px wide) and prefer a **small** PNG or JPEG—do not commit a multi-megabyte source.

If `sips` / `djpeg` / `cjpeg` are unavailable, use an equivalent (resize long edge ≤2048px, sensible JPEG quality, progressive) and state what you used.

## Quality bar

- Match existing naming, formatting, and comment level in touched files.
- After UI or layout changes, sanity-check in a browser (mobile menu, filters, lightbox, forms).
- Do not strip or weaken accessibility attributes without a clear, stated reason.

## What not to do

- Do not commit secrets (API keys, real personal contact data) unless the project owner explicitly wants them in-repo.
- Do not replace the static approach with a framework unless the owner requests it.
