# Rhema
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A fast, modern KJV Bible verse search app.

**Live:** [rhema.quest](https://rhema.quest)

## Features

- 🔍 Fuzzy search by keyword or exact reference (e.g., "John 3:16")
- 📖 Chapter reader with verse-by-verse display
- 🔖 Bookmarks with local persistence
- ⌨️ Keyboard shortcuts (`/` search, `j/k` navigate, `b` bookmark, `⌘K` command palette)
- 🌙 Dark/light theme
- 📱 Mobile-first responsive design
- ⚡ Client-side search — no server required

## Stack

React 19 · Vite 6 · Tailwind CSS v4 · TanStack Router · TanStack Query · Zustand · Fuse.js · Framer Motion

## Getting Started

```bash
git clone https://github.com/eosdev-x/atom-verse.git
cd atom-verse
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm run test` | Run tests (Vitest) |
| `npm run lint` | Run ESLint |

## License

MIT
