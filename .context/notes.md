# Notes

## Project Structure
- Data lives in `/data/` — `kjv-bible.json` (7.3MB), `kjv-complete.json` (4.5MB), `processed/` directory with per-book JSON files
- DB layer (`src/utils/db.ts`) fetches per-book JSON files from `/data/processed/` with in-memory Map cache
- Zustand stores: `bookmarkStore.ts` (persisted to localStorage), `themeStore.ts`
- Bible reference parser: `src/utils/bibleReferences.ts`
- Constants: `src/constants/bible.ts`

## Gotchas
- `lucide-react` is excluded from Vite's `optimizeDeps` — keep this when upgrading Vite
- Tailwind dark mode uses `class` strategy, not `media` — preserve this
- Bookmarks use `crypto.randomUUID()` — requires secure context (HTTPS or localhost)
- Search currently has no debouncing built into the service layer (debounce hook exists but isn't used in App.tsx)

## [2026-09-01] Hapgood Hours OCR
**By:** Sonic 🦔
- Raw office extracts: `data/sources/hapgood/*.txt` from IA OCR `ServiceBookOfHolyOrthodoxChurchByHapgood`.
- Offices present: Great Vespers, Matins, First/Third/Sixth/Ninth Hour, Typical Psalms, Grand Compline.
- Hapgood omitted Midnight Office, Little Vespers, Small Compline — do not invent them.
- OCR junk includes `Digitized by VjOOQ IC`, running headers (`GREAT VESPERS 5`), hyphenation at line breaks, `Cfroir` for Choir.

## Patterns
- Components are functional with hooks
- State: Zustand for global, useState for local
- Styling: Tailwind utility classes, no custom CSS beyond index.css reset
- Data fetching: direct `fetch()` in db.ts, no React Query yet
