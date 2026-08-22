# Decisions

## [2026-08-22] Initial Architecture Assessment
**By:** Sonic 🦔
**Context:** Atom Verse is a KJV Bible verse search app built with Vite + React 18 + TypeScript + Tailwind v3 + Zustand. Currently a single-page search box with bookmarks. No routing, no tests, no CI. In-memory search loads all 31K verses per query.
**Decision:** Execute Phase 1 (Foundation) + Phase 3 (UX Polish) in parallel tracks to bring the app to pro level.
**Status:** Active

## [2026-08-22] Stack Upgrade Targets
**By:** Sonic 🦔
**Context:** Current dependencies are outdated (React 18, Tailwind v3, Zustand 4). Need modern stack for pro-level polish.
**Decision:** Upgrade to React 19, Vite 6, Tailwind v4, Zustand 5. Add TanStack Router, TanStack Query, Fuse.js, Framer Motion, Vitest.
**Alternatives considered:** Next.js (overkill for a static Bible app), Remix (same), keeping current stack (limits what we can do).
**Status:** Active

## [2026-08-22] Search Engine Replacement
**By:** Sonic 🦔
**Context:** Current search loads ALL 31K verses into memory on every query via fetch + flatMap. O(n) scan with basic scoring. Won't scale.
**Decision:** Replace with Fuse.js for client-side fuzzy search. Index once on app load, query fast thereafter.
**Alternatives considered:** MiniSearch (more complex API), Algolia (external dependency, cost), Typesense (server required). Fuse.js is zero-config, client-side, fuzzy-tolerant.
**Status:** Active

## [2026-08-22] Routing Strategy
**By:** Sonic 🦔
**Context:** App is currently a single view with no routing. Need routes for book browser, chapter reader, bookmarks, etc.
**Decision:** TanStack Router — type-safe, file-based routing, no framework lock-in.
**Alternatives considered:** React Router v7 (heavier, less type-safe), wouter (too minimal for this scope).
**Status:** Active
