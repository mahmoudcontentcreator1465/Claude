# Brand source files

| File | What it is |
|---|---|
| `different-logo-official-white.png` | Official logo as supplied (1080×1080, transparent, white + teal #1ABC9C). Untouched. |
| `different-logo-dark-1080.png` | Light-background version **derived** from the official file: only the white pixels were recoloured to #111111 (anti-aliased edges blended proportionally); the teal is unchanged. |

Web copies live in `public/brand/` and `src/assets/brand/` (trimmed to the artwork's bounding box):

- `different-logo-dark.png`: for light backgrounds (header, OG image)
- `different-logo-white.png`: for dark backgrounds (footer, mobile menu)
- `different-mark-dark.png` / `different-mark-white.png`: symbol only (favicon, decorative uses)

**To replace with the official dark/black logo** once it's supplied as a file (ideally SVG): overwrite
`src/assets/brand/different-logo-dark.png` and `public/brand/different-logo-dark.png` with the official
file, trimmed to the artwork. Keep the filename and every usage picks it up. Then re-run
`node scripts/generate-og.mjs` to refresh the share images.
