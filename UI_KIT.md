# Rhema — UI Kit

**rhema.quest** · KJV Bible search & reading app
Stack: React 19 · Tailwind CSS v4 · Framer Motion · Lucide React · TanStack Router/Query

This document is the single source of truth for visual design across Rhema. It's copy-paste ready — every component spec gives you working Tailwind classes for light + dark mode, states, and (where relevant) Framer Motion props.

**Aesthetic:** clean, minimal, warm. A study tool, not a dashboard. Calm typography, generous whitespace, one confident accent color, restrained motion.

---

## Table of Contents

1. [Design Tokens](#1-design-tokens)
2. [Component Specifications](#2-component-specifications)
3. [Layout Patterns](#3-layout-patterns)
4. [Animation Specifications](#4-animation-specifications)
5. [Iconography](#5-iconography)
6. [Accessibility](#6-accessibility)
7. [Responsive Breakpoints](#7-responsive-breakpoints)

---

## 1. Design Tokens

### 1.1 Color Palette

Rhema uses **blue as the primary accent** (already established in-product — links, focus rings, active states) and adds **amber as a warm secondary accent** for bookmarks/highlights, keeping the interface calm rather than corporate. Neutrals are Tailwind's `gray` scale so components read cleanly against the existing codebase.

#### Primary — Blue (links, primary actions, focus, active nav)

| Token | Light | Dark | Tailwind class |
|---|---|---|---|
| `primary-50` | `#eff6ff` | — | `blue-50` |
| `primary-100` | `#dbeafe` | — | `blue-100` |
| `primary-400` | `#60a5fa` | used as dark-mode accent | `blue-400` |
| `primary-500` | `#3b82f6` | `#3b82f6` | `blue-500` |
| `primary-600` | `#2563eb` | `#2563eb` | `blue-600` |
| `primary-700` | `#1d4ed8` | — | `blue-700` |

Usage: `bg-blue-500 hover:bg-blue-600` (buttons), `text-blue-600 dark:text-blue-400` (links), `ring-blue-500 dark:ring-blue-400` (focus).

#### Secondary — Amber (bookmarks, highlights, warmth accents)

| Token | Light | Dark | Tailwind class |
|---|---|---|---|
| `secondary-100` | `#fef3c7` | — | `amber-100` |
| `secondary-400` | `#fbbf24` | `#fbbf24` | `amber-400` |
| `secondary-500` | `#f59e0b` | `#f59e0b` | `amber-500` |
| `secondary-600` | `#d97706` | — | `amber-600` |

Usage: bookmarked-state icon fill, "featured verse" badges, subtle warm highlights (e.g. verse-of-the-day card border).

#### Accent — Rose (favorites / hearted verses, sparingly)

| Token | Value | Tailwind class |
|---|---|---|
| `accent-500` | `#f43f5e` | `rose-500` |
| `accent-600` | `#e11d48` | `rose-600` |

#### Semantic

| Purpose | Light bg | Light text | Dark bg | Dark text | Classes |
|---|---|---|---|---|---|
| Success | `#f0fdf4` | `#15803d` | `emerald-950/40` | `#4ade80` | `bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400` |
| Warning | `#fffbeb` | `#b45309` | `amber-950/40` | `#fbbf24` | `bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400` |
| Error | `#fef2f2` | `#b91c1c` | `red-950/40` | `#f87171` | `bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400` |
| Info | `#eff6ff` | `#1d4ed8` | `blue-950/40` | `#60a5fa` | `bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400` |

#### Neutral scale (gray)

| Token | Light usage | Dark usage |
|---|---|---|
| `gray-50` | App background | — |
| `gray-100` | Subtle hover surfaces | — |
| `gray-200` | Borders, dividers | — |
| `gray-400` | Placeholder text | Muted body text |
| `gray-500` | Secondary text | Secondary text (dark bg) |
| `gray-700` | Body text | Borders (dark) |
| `gray-800` | Headings (light-weight) | Card surfaces |
| `gray-900` | Primary headings, buttons | App background, primary surfaces |
| `white` | Card surfaces | Primary text (`gray-100`/`white`) |

**Surface pairing convention** used throughout this kit:
```
bg-white dark:bg-gray-900          /* app shell */
bg-white dark:bg-gray-800          /* cards, raised surfaces */
border-gray-200 dark:border-gray-800
text-gray-900 dark:text-gray-100   /* headings */
text-gray-700 dark:text-gray-300   /* body */
text-gray-500 dark:text-gray-400   /* muted/meta */
```

### 1.2 Typography

**Font stack** — system fonts (already configured in `src/index.css`), no web-font request needed:

```css
--font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
```

For verse text specifically, consider a serif for a "reading" feel — optional, opt-in per component:

```css
--font-serif: "Iowan Old Style", "Palatino Linotype", "Georgia", ui-serif, serif;
```

Use `font-serif` only on verse body text in the Reader (`ReaderPage`), never on UI chrome (buttons, nav, labels).

#### Type scale

| Level | Size (responsive) | Weight | Line height | Tailwind |
|---|---|---|---|---|
| H1 | `clamp(1.25rem, 4vw, 1.875rem)` | 700 | 1.2 | `text-2xl md:text-3xl font-bold leading-tight` |
| H2 | `clamp(1.125rem, 3.5vw, 1.5rem)` | 700 | 1.25 | `text-xl md:text-2xl font-bold leading-snug` |
| H3 | `clamp(1rem, 3vw, 1.25rem)` | 600 | 1.3 | `text-lg md:text-xl font-semibold leading-snug` |
| H4 | `1.125rem` | 600 | 1.35 | `text-lg font-semibold` |
| H5 | `1rem` | 600 | 1.4 | `text-base font-semibold` |
| H6 | `0.875rem` | 600 | 1.4 | `text-sm font-semibold uppercase tracking-wide` |
| Body | `clamp(0.875rem, 2.5vw, 1rem)` | 400 | 1.6 | `text-sm md:text-base leading-relaxed` |
| Body large (verse text) | `1.125rem` | 400 | 1.75 | `text-lg leading-relaxed` |
| Caption | `0.75rem` | 500 | 1.4 | `text-xs font-medium` |
| Code / reference mono | `0.875rem` | 500 | 1.4 | `text-sm font-mono` |

Weights used: `font-normal` (400) body, `font-medium` (500) UI labels/captions, `font-semibold` (600) subheadings, `font-bold` (700) headings.

### 1.3 Spacing Scale

4px base, follows Tailwind defaults — don't invent custom values, compose from these:

| Token | px | Tailwind |
|---|---|---|
| `space-1` | 4px | `1` |
| `space-2` | 8px | `2` |
| `space-3` | 12px | `3` |
| `space-4` | 16px | `4` |
| `space-5` | 20px | `5` |
| `space-6` | 24px | `6` |
| `space-8` | 32px | `8` |
| `space-10` | 40px | `10` |
| `space-12` | 48px | `12` |
| `space-16` | 64px | `16` |

Convention: `p-4`/`gap-4` inside compact components (badges, chips), `p-6` for cards, `px-4` page gutters on mobile, `py-16`+ for hero sections.

### 1.4 Border Radius

| Token | Value | Tailwind | Usage |
|---|---|---|---|
| `sm` | 6px | `rounded-md` | Inputs, chips, small buttons |
| `md` | 8px | `rounded-lg` | Cards, buttons, dropdowns |
| `lg` | 12px | `rounded-xl` | Modals, command palette, large cards |
| `xl` | 16px | `rounded-2xl` | Hero panels, feature callouts |
| `full` | 9999px | `rounded-full` | Avatars, icon buttons, pills, badges |

### 1.5 Shadows

Keep shadows soft — this is a reading app, not a SaaS dashboard. Avoid heavy dark shadows in dark mode (use border + subtle glow instead).

| Token | Light | Dark | Tailwind |
|---|---|---|---|
| `sm` | `0 1px 2px rgba(0,0,0,0.05)` | none (use border) | `shadow-sm dark:shadow-none dark:border dark:border-gray-800` |
| `md` | `0 4px 6px -1px rgba(0,0,0,0.08)` | `0 4px 6px -1px rgba(0,0,0,0.3)` | `shadow-md dark:shadow-black/30` |
| `lg` | `0 10px 15px -3px rgba(0,0,0,0.1)` | `0 10px 15px -3px rgba(0,0,0,0.4)` | `shadow-lg dark:shadow-black/40` |
| `xl` | `0 20px 25px -5px rgba(0,0,0,0.12)` | `0 20px 25px -5px rgba(0,0,0,0.5)` | `shadow-xl dark:shadow-black/50` |

Cards: `shadow-md hover:shadow-lg`. Modals/command palette: `shadow-xl`. Dropdowns/tooltips: `shadow-lg`.

### 1.6 Transitions

| Token | Duration | Easing | Usage |
|---|---|---|---|
| `fast` | 150ms | `ease-out` | Hover states, color/opacity changes |
| `base` | 200ms | `ease-in-out` | Default — `transition-colors duration-200` |
| `moderate` | 250ms | `ease-out` | Card enter, header show/hide |
| `slow` | 350ms | `ease-in-out` | Modal/palette scale-fade, page transitions |

Framer Motion easing curves:
```ts
export const easing = {
  out: [0.16, 1, 0.3, 1],       // easeOutExpo-ish, snappy settle
  inOut: [0.4, 0, 0.2, 1],      // standard material inOut
  spring: { type: 'spring', stiffness: 400, damping: 30 },
};
```

---

## 2. Component Specifications

### 2.1 Button

Base classes shared by all variants:
```
inline-flex items-center justify-center gap-2 font-medium rounded-lg
transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
```

**Primary**
```html
<button class="inline-flex items-center justify-center gap-2 font-medium rounded-lg
  bg-blue-500 text-white
  hover:bg-blue-600
  active:bg-blue-700
  focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-200
  px-4 py-2 text-sm">
  Search
</button>
```

**Secondary**
```html
<button class="inline-flex items-center justify-center gap-2 font-medium rounded-lg
  bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100
  hover:bg-gray-200 dark:hover:bg-gray-700
  active:bg-gray-300 dark:active:bg-gray-600
  focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-200
  px-4 py-2 text-sm">
  Cancel
</button>
```

**Ghost**
```html
<button class="inline-flex items-center justify-center gap-2 font-medium rounded-lg
  text-gray-600 dark:text-gray-300
  hover:bg-gray-100 dark:hover:bg-gray-800
  active:bg-gray-200 dark:active:bg-gray-700
  focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-200
  px-4 py-2 text-sm">
  Clear filters
</button>
```

**Danger**
```html
<button class="inline-flex items-center justify-center gap-2 font-medium rounded-lg
  bg-red-500 text-white
  hover:bg-red-600
  active:bg-red-700
  focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-200
  px-4 py-2 text-sm">
  Delete bookmark
</button>
```

**Sizes**
| Size | Classes |
|---|---|
| `sm` | `px-3 py-1.5 text-xs rounded-md` |
| `md` (default) | `px-4 py-2 text-sm rounded-lg` |
| `lg` | `px-5 py-2.5 text-base rounded-lg` |

**Icon-only** (always `min-w-[44px] min-h-[44px]` for touch target):
```html
<button
  aria-label="Toggle theme"
  class="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full
    text-gray-600 dark:text-gray-300
    hover:bg-gray-100 dark:hover:bg-gray-800
    active:bg-gray-200 dark:active:bg-gray-700
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
    transition-colors duration-200">
  <Sun class="w-5 h-5" />
</button>
```

Framer Motion tap feedback (apply to all buttons):
```tsx
<motion.button whileTap={{ scale: 0.96 }} transition={{ duration: 0.1 }}>
```

### 2.2 Input

**Text input, base**
```html
<input
  type="text"
  class="w-full px-4 py-2.5 rounded-lg text-sm
    bg-white dark:bg-gray-800
    border border-gray-200 dark:border-gray-700
    text-gray-900 dark:text-gray-100
    placeholder:text-gray-400 dark:placeholder:text-gray-500
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-200"
  placeholder="Search verses or type a reference…"
/>
```

**With icon prefix** (wrap in relative container):
```html
<div class="relative">
  <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
  <input
    class="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm
      bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
      text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      transition-colors duration-200"
    placeholder="Search…"
  />
</div>
```

**Search variant** (hero-size, with suffix clear button + kbd hint):
```html
<div class="relative">
  <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
  <input
    class="w-full pl-12 pr-16 py-4 rounded-xl text-base
      bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
      text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500
      shadow-sm focus:shadow-md
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      transition-all duration-200"
    placeholder="Search “love your neighbor” or “John 3:16”"
  />
  <kbd class="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5
    px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700
    text-xs font-mono text-gray-400 dark:text-gray-500">/</kbd>
</div>
```

**Error state**
```
border-red-400 dark:border-red-500 focus:ring-red-500
```
Pair with helper text: `text-xs text-red-600 dark:text-red-400 mt-1.5`

### 2.3 Card

**Verse card** (see also `VerseCard.tsx` — this is the canonical spec already in use):
```html
<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6
  hover:shadow-lg transition-shadow duration-200">
  <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3
    hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
    John 3:16
  </h3>
  <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
    For God so loved the world…
  </p>
  <div class="flex justify-end space-x-3"><!-- bookmark / share icon buttons --></div>
</div>
```

Focused state (keyboard nav `j`/`k`):
```
ring-2 ring-blue-500 dark:ring-blue-400 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-900 shadow-lg
```

**Info card** (About page, feature explainer):
```html
<div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
  <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center mb-4">
    <Command class="w-5 h-5 text-blue-600 dark:text-blue-400" />
  </div>
  <h4 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5">Command palette</h4>
  <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
    Press ⌘K to jump to any book or chapter instantly.
  </p>
</div>
```

**Stat card** (e.g. bookmark count, books read):
```html
<div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 p-5">
  <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Bookmarks</p>
  <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">24</p>
</div>
```

### 2.4 Badge

**Verse number badge** (superscript-style, inline in reader):
```html
<span class="inline-flex items-center justify-center w-5 h-5 rounded-full
  bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400
  text-xs font-semibold mr-2 align-super">7</span>
```

**Bookmarked status badge**
```html
<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
  bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400
  text-xs font-medium">
  <BookmarkCheck class="w-3 h-3" /> Bookmarked
</span>
```

**Count badge** (nav bubble, matches `Header.tsx`)
```html
<span class="absolute -top-1 -right-1 bg-blue-500 text-white
  rounded-full w-5 h-5 text-xs flex items-center justify-center font-medium">
  3
</span>
```

**Neutral / testament badge** (e.g. "New Testament")
```html
<span class="inline-flex items-center px-2.5 py-1 rounded-full
  bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium">
  New Testament
</span>
```

### 2.5 Avatar / Icon Container

```html
<!-- Feature icon, 40px container -->
<div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
  <BookOpen class="w-5 h-5 text-blue-600 dark:text-blue-400" />
</div>

<!-- Larger, 56px, hero use -->
<div class="w-14 h-14 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center">
  <Heart class="w-7 h-7 text-amber-600 dark:text-amber-400" />
</div>

<!-- Circular avatar container (generic), 32px -->
<div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
  <Info class="w-4 h-4 text-gray-500 dark:text-gray-400" />
</div>
```

### 2.6 Navigation

**Header nav** (desktop, matches `Header.tsx` — sticky, blurs on scroll, hides on scroll-down mobile):
```html
<header class="fixed top-0 left-0 right-0 z-40 md:sticky
  border-b border-gray-200 dark:border-gray-800
  bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
  <div class="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
    <!-- logo + wordmark -->
    <!-- action icons: command palette trigger, bookmarks, about, theme toggle -->
  </div>
</header>
```

**Bottom nav** (mobile only, `< 768px`):
```html
<nav class="fixed bottom-0 left-0 right-0 z-40 md:hidden
  bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg
  border-t border-gray-200 dark:border-gray-800
  pb-[env(safe-area-inset-bottom)]">
  <div class="flex items-center justify-around h-16">
    <a class="flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px]
      text-blue-600 dark:text-blue-400">
      <Search class="w-5 h-5" />
      <span class="text-[10px] font-medium">Search</span>
    </a>
    <a class="flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px]
      text-gray-500 dark:text-gray-400
      hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
      <Bookmark class="w-5 h-5" />
      <span class="text-[10px] font-medium">Saved</span>
    </a>
    <!-- active item: text-blue-600 dark:text-blue-400 -->
  </div>
</nav>
```

**Sidebar** (optional, desktop `> 1024px`, book navigation for reader):
```html
<aside class="hidden lg:block w-64 shrink-0 border-r border-gray-200 dark:border-gray-800
  h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto py-6 px-3">
  <nav class="space-y-0.5">
    <a class="flex items-center px-3 py-2 rounded-lg text-sm font-medium
      text-gray-700 dark:text-gray-300
      hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
      Genesis
    </a>
    <a class="flex items-center px-3 py-2 rounded-lg text-sm font-medium
      bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400"><!-- active -->
      Exodus
    </a>
  </nav>
</aside>
```

### 2.7 Command Palette

Matches `cmdk` + `CommandPalette.tsx` pattern.

**Overlay**
```html
<div class="fixed inset-0 z-50 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />
```

**Panel**
```html
<div class="fixed left-1/2 top-[20vh] z-50 w-full max-w-lg -translate-x-1/2
  bg-white dark:bg-gray-800 rounded-xl shadow-xl
  border border-gray-200 dark:border-gray-700 overflow-hidden">

  <div class="flex items-center gap-3 px-4 border-b border-gray-200 dark:border-gray-700">
    <Search class="w-4 h-4 text-gray-400 shrink-0" />
    <input
      class="w-full py-3.5 bg-transparent text-sm text-gray-900 dark:text-gray-100
        placeholder:text-gray-400 focus:outline-none"
      placeholder="Jump to book, chapter, or verse…"
    />
    <kbd class="px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700
      text-xs font-mono text-gray-400">Esc</kbd>
  </div>

  <div class="max-h-80 overflow-y-auto p-2">
    <p class="px-2 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Books</p>
    <button class="w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm
      text-gray-700 dark:text-gray-300
      data-[selected=true]:bg-blue-50 dark:data-[selected=true]:bg-blue-950/40
      data-[selected=true]:text-blue-700 dark:data-[selected=true]:text-blue-400
      transition-colors">
      <span>Genesis</span>
      <kbd class="text-xs font-mono text-gray-400">↵</kbd>
    </button>
  </div>
</div>
```

Framer Motion:
```tsx
const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const panelVariants = {
  hidden: { opacity: 0, scale: 0.96, y: -8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: easing.out } },
  exit: { opacity: 0, scale: 0.96, y: -8, transition: { duration: 0.15 } },
};
```

### 2.8 Modal / Dialog

```html
<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div class="fixed inset-0 bg-black/40 dark:bg-black/60" /> <!-- overlay -->

  <div class="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl
    border border-gray-200 dark:border-gray-700 p-6">
    <button aria-label="Close dialog" class="absolute top-4 right-4 p-1.5 rounded-full
      text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
      hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      <X class="w-4 h-4" />
    </button>
    <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Clear all bookmarks?</h2>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">This can't be undone.</p>
    <div class="flex justify-end gap-3">
      <!-- ghost button "Cancel", danger button "Clear" -->
    </div>
  </div>
</div>
```

Framer Motion:
```tsx
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: easing.out } },
  exit: { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.15 } },
};
```

### 2.9 Toast

Base container (matches `react-hot-toast` usage in `VerseCard.tsx`):
```html
<div class="flex items-center gap-3 bg-white dark:bg-gray-800
  border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg
  px-4 py-3 text-sm text-gray-900 dark:text-gray-100 min-w-[280px]">
  <BookmarkCheck class="w-4 h-4 text-emerald-500 shrink-0" />
  <span class="flex-1">Verse bookmarked</span>
</div>
```

**Success** — leading icon `text-emerald-500` (`CheckCircle`/`BookmarkCheck`)
**Error** — leading icon `text-red-500` (`X` or `AlertCircle`), optional `border-red-200 dark:border-red-900/50`
**Info** — leading icon `text-blue-500` (`Info`)

**Undo action variant**
```html
<div class="flex items-center gap-3 bg-white dark:bg-gray-800
  border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg px-4 py-3 text-sm">
  <span class="text-gray-900 dark:text-gray-100">Bookmark removed</span>
  <button class="px-2 py-1 text-xs font-medium rounded
    bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200">
    Undo
  </button>
</div>
```

Framer Motion slide-in (bottom-right):
```tsx
const toastVariants = {
  hidden: { opacity: 0, y: 20, x: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, x: 0, scale: 1, transition: easing.spring },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.15 } },
};
```
`react-hot-toast` config: `position="bottom-right"` on mobile fall back to `top-center` to avoid the bottom nav bar.

### 2.10 Skeleton Loader

**Verse card skeleton**
```html
<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
  <div class="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
  <div class="space-y-2 mb-4">
    <div class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
    <div class="h-4 w-11/12 bg-gray-200 dark:bg-gray-700 rounded"></div>
    <div class="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
  </div>
  <div class="flex justify-end gap-3">
    <div class="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
    <div class="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
  </div>
</div>
```

**Text skeleton line**
```html
<div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style="width: 70%"></div>
```

Framer Motion pulse (alternative to CSS `animate-pulse` when finer control is needed):
```tsx
<motion.div
  animate={{ opacity: [0.5, 1, 0.5] }}
  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
  className="bg-gray-200 dark:bg-gray-700 rounded"
/>
```

### 2.11 Empty State

Matches `EmptyState.tsx` pattern:
```html
<div class="flex flex-col items-center justify-center text-center py-16 px-4">
  <div class="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
    <Bookmark class="w-6 h-6 text-gray-400 dark:text-gray-500" />
  </div>
  <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5">No bookmarks yet</h3>
  <p class="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6">
    Save verses as you read to find them here later.
  </p>
  <button class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
    bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200">
    <Search class="w-4 h-4" /> Start searching
  </button>
</div>
```

### 2.12 Dropdown / Select

**Book selector** (button-triggered dropdown, reader navigation):
```html
<button class="flex items-center justify-between gap-2 px-3.5 py-2 rounded-lg text-sm
  bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
  text-gray-900 dark:text-gray-100
  hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200
  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
  <span>Genesis</span>
  <ChevronDown class="w-4 h-4 text-gray-400" />
</button>

<div class="absolute mt-1 w-48 max-h-72 overflow-y-auto
  bg-white dark:bg-gray-800 rounded-lg shadow-lg
  border border-gray-200 dark:border-gray-700 py-1 z-30">
  <button class="w-full text-left px-3 py-2 text-sm
    text-gray-700 dark:text-gray-300
    hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
    Exodus
  </button>
  <button class="w-full text-left px-3 py-2 text-sm font-medium
    bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400"><!-- selected -->
    Genesis
  </button>
</div>
```

**Chapter selector** — same pattern, grid layout for numeric picker:
```html
<div class="grid grid-cols-6 gap-1.5 p-3 w-64">
  <button class="aspect-square rounded-md text-sm font-medium
    text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
    transition-colors duration-150">7</button>
  <button class="aspect-square rounded-md text-sm font-medium
    bg-blue-500 text-white"><!-- current chapter -->8</button>
</div>
```

### 2.13 Toggle / Switch

**Theme toggle** (icon-swap style, matches current `Header.tsx` usage — recommend upgrading emoji to Lucide icons):
```html
<button
  role="switch"
  aria-checked="false"
  aria-label="Switch to dark mode"
  class="relative flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full
    text-gray-600 dark:text-gray-300
    hover:bg-gray-100 dark:hover:bg-gray-800
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
    transition-colors duration-200">
  <Sun class="w-5 h-5 dark:hidden" />
  <Moon class="w-5 h-5 hidden dark:block" />
</button>
```

**Generic switch** (settings-style, e.g. "reduce motion"):
```html
<button role="switch" aria-checked="true"
  class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full
    bg-blue-500 dark:bg-blue-500
    transition-colors duration-200
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">
  <span class="inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow
    translate-x-6 transition-transform duration-200"></span>
</button>
<!-- off state: bg-gray-200 dark:bg-gray-700, thumb translate-x-1 -->
```

### 2.14 Tooltip

**Keyboard shortcut hint** (matches `KeyboardHints.tsx`):
```html
<div role="tooltip" class="absolute z-50 px-2.5 py-1.5 rounded-md
  bg-gray-900 dark:bg-gray-700 text-white
  text-xs font-medium shadow-lg
  flex items-center gap-1.5 whitespace-nowrap
  after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2
  after:border-4 after:border-transparent after:border-t-gray-900 dark:after:border-t-gray-700">
  Bookmark
  <kbd class="px-1 py-0.5 rounded bg-white/20 font-mono text-[10px]">b</kbd>
</div>
```

Framer Motion:
```tsx
<motion.div
  initial={{ opacity: 0, y: 4 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 4 }}
  transition={{ duration: 0.1 }}
/>
```

### 2.15 Divider

```html
<!-- Standard -->
<hr class="border-gray-200 dark:border-gray-800" />

<!-- With label (e.g. "Old Testament" / "New Testament" section break) -->
<div class="flex items-center gap-3 py-2">
  <hr class="flex-1 border-gray-200 dark:border-gray-800" />
  <span class="text-xs font-medium text-gray-400 uppercase tracking-wide">New Testament</span>
  <hr class="flex-1 border-gray-200 dark:border-gray-800" />
</div>

<!-- Vertical (inline nav separators) -->
<span class="h-4 w-px bg-gray-200 dark:bg-gray-800"></span>
```

### 2.16 Tag / Chip

**Filter chip**
```html
<button class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
  bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
  hover:bg-gray-200 dark:hover:bg-gray-700
  transition-colors duration-200">
  Psalms
</button>

<!-- active/selected -->
<button class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
  bg-blue-500 text-white">
  Psalms
  <X class="w-3.5 h-3.5" />
</button>
```

**Search suggestion chip** (e.g. "Try: love, faith, hope"):
```html
<button class="inline-flex items-center px-3 py-1.5 rounded-full text-sm
  border border-gray-200 dark:border-gray-700
  text-gray-600 dark:text-gray-300
  hover:border-blue-300 hover:text-blue-600
  dark:hover:border-blue-700 dark:hover:text-blue-400
  transition-colors duration-200">
  Love your neighbor
</button>
```

---

## 3. Layout Patterns

### 3.1 Page Shell

```html
<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
  <Header /> <!-- fixed/sticky, h-16 -->
  <main class="flex-1 max-w-3xl w-full mx-auto px-4 pt-20 md:pt-8 pb-24 md:pb-12">
    <!-- pt-20 accounts for fixed header on mobile; pb-24 clears bottom nav -->
  </main>
  <Footer class="hidden md:block" /> <!-- desktop only; mobile uses bottom nav -->
</div>
```

Max-width convention: `max-w-3xl` (768px) for reading-focused content (search results, reader). Use `max-w-5xl` only for wider layouts like a bookmarks grid on desktop.

### 3.2 Search Page

```html
<section class="text-center py-12 md:py-20">
  <h1 class="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
    Search the KJV Bible
  </h1>
  <p class="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
    Search by keyword or jump straight to a reference.
  </p>
  <div class="max-w-xl mx-auto"><!-- Search input, hero variant --></div>
  <div class="flex flex-wrap justify-center gap-2 mt-4"><!-- suggestion chips --></div>
</section>

<section class="space-y-4 mt-8">
  <!-- results: stacked VerseCards, staggered enter -->
</section>
```

### 3.3 Reader Page

```html
<div class="sticky top-16 z-20 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm
  -mx-4 px-4 py-3 mb-6 border-b border-gray-200 dark:border-gray-800
  flex items-center justify-between">
  <button aria-label="Previous chapter"><ChevronLeft class="w-5 h-5" /></button>
  <div class="text-center">
    <h1 class="text-lg font-bold text-gray-900 dark:text-gray-100">John 3</h1>
    <button class="text-xs text-gray-400">Change chapter</button>
  </div>
  <button aria-label="Next chapter"><ChevronRight class="w-5 h-5" /></button>
</div>

<div class="space-y-1">
  <!-- verse-by-verse, each: sup number badge + font-serif text-lg leading-relaxed -->
  <p class="py-2 px-3 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors duration-150 cursor-pointer">
    <span class="text-xs font-semibold text-gray-400 align-super mr-1.5">16</span>
    <span class="font-serif text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
      For God so loved the world…
    </span>
  </p>
</div>

<div class="flex items-center justify-between mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
  <!-- prev/next chapter buttons, secondary variant, full labels on desktop -->
</div>
```

### 3.4 Bookmarks Page

```html
<div class="flex items-center justify-between mb-6">
  <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Bookmarks</h1>
  <span class="text-sm text-gray-500 dark:text-gray-400">24 saved</span>
</div>

<div class="mb-6"><!-- search/filter input, icon-prefix variant --></div>

<div class="space-y-4"><!-- VerseCards, or EmptyState if none --></div>
```

Desktop (`≥ 1024px`) may switch to a 2-column grid: `lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0`.

### 3.5 Mobile Layout

- **Bottom nav**: fixed, `h-16`, 3–4 items max (Search, Reader/Continue, Bookmarks, About), `pb-[env(safe-area-inset-bottom)]`.
- **Safe areas**: apply `env(safe-area-inset-*)` at the `html`/shell level (already done in `index.css`) plus bottom-nav-specific bottom padding.
- **Touch targets**: every interactive element ≥ `44px × 44px` (`min-w-[44px] min-h-[44px]`), already the convention in `VerseCard.tsx` / `Header.tsx` — keep it everywhere, including chips and dropdown items where visually smaller (pad the hit area with padding, not just the visible box).
- **Content gutters**: `px-4` mobile, `px-6` tablet+.
- **Sticky elements** stack: header (`z-40`) → reader chapter bar (`z-20`) → bottom nav (`z-40`) → command palette/modal (`z-50`).

---

## 4. Animation Specifications

All variants assume `import { motion, AnimatePresence } from 'framer-motion'`.

### 4.1 Page Transitions

```tsx
export const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: easing.out } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: easing.inOut } },
};

// Usage (AnimatedPage.tsx pattern)
<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
  {children}
</motion.div>
```

### 4.2 Card Animations

**Staggered list enter**
```tsx
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: easing.out } },
};

<motion.div variants={container} initial="hidden" animate="show">
  {results.map((r) => (
    <motion.div key={r.id} variants={item}><VerseCard {...r} /></motion.div>
  ))}
</motion.div>
```

**Hover scale** (use sparingly — cards already have shadow-lift; reserve scale for chips/buttons):
```tsx
<motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.15 }}>
```

### 4.3 Header — Hide on Scroll Down / Show on Scroll Up

Matches `useScrollDirection.ts` + `Header.tsx`:
```tsx
<motion.header
  initial={false}
  animate={{ y: isHidden ? -100 : 0 }}
  transition={{ duration: 0.25, ease: 'easeInOut' }}
  className={isAtTop ? 'bg-white dark:bg-gray-900' : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg'}
/>
```

### 4.4 Command Palette

```tsx
<AnimatePresence>
  {open && (
    <>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        className="fixed left-1/2 top-[20vh] -translate-x-1/2 z-50 w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.96, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -8 }}
        transition={{ duration: 0.2, ease: easing.out }}
      >
        {/* palette content */}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

### 4.5 Toast

```tsx
toast.custom((t) => (
  <motion.div
    initial={{ opacity: 0, y: 20, x: 20, scale: 0.95 }}
    animate={{ opacity: t.visible ? 1 : 0, y: 0, x: 0, scale: 1 }}
    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
  >
    {/* toast content */}
  </motion.div>
));
```

### 4.6 Skeleton Pulse

```tsx
<motion.div
  className="bg-gray-200 dark:bg-gray-700 rounded"
  animate={{ opacity: [0.5, 1, 0.5] }}
  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
/>
```
CSS-only equivalent (preferred for pure loading skeletons — cheaper, no JS): `animate-pulse`.

### 4.7 Reduced Motion

Respect `prefers-reduced-motion` globally — wrap the app root:
```tsx
import { MotionConfig } from 'framer-motion';

<MotionConfig reducedMotion="user">
  <App />
</MotionConfig>
```
This makes Framer Motion automatically disable transform/scale animations (but keep opacity fades) for users who request it — no per-component branching needed.

---

## 5. Iconography

**Library:** `lucide-react` (already a dependency).

### Required icon set

| Icon | Usage |
|---|---|
| `Search` | Search input, empty state, nav |
| `BookOpen` | Logo, reader nav |
| `Bookmark` | Bookmark (unset state), nav |
| `BookmarkCheck` | Bookmark (set state), toast |
| `Share2` | Share verse |
| `Copy` | Copy verse (share fallback) |
| `ChevronLeft` | Prev chapter/page |
| `ChevronRight` | Next chapter/page |
| `ChevronDown` | Dropdown trigger |
| `Sun` | Light mode toggle |
| `Moon` | Dark mode toggle |
| `Command` | Command palette trigger |
| `X` | Close modal/toast/chip |
| `Heart` | Favorite (accent use) |
| `ExternalLink` | Outbound links (About page) |
| `Info` | About, info toasts/badges |
| `Trash2` | Delete bookmark |
| `Loader2` | Loading spinner (`animate-spin`) |

### Sizing scale

| Size | px | Tailwind | Context |
|---|---|---|---|
| Inline | 16px | `w-4 h-4` | Within text, badges, chips |
| Button | 20px | `w-5 h-5` | Buttons, icon buttons, nav icons |
| Navigation | 24px | `w-6 h-6` | Bottom nav active icons (optional emphasis) |
| Feature | 32px | `w-8 h-8` | Logo, empty-state hero icon, feature cards |

Default stroke width: Lucide's default (`2`). Don't mix stroke widths within the same view.

---

## 6. Accessibility

### 6.1 Focus Ring

Standard focus-visible treatment, applied to every interactive element:
```
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900
```
Never remove focus outlines without replacing them — `focus:outline-none` must always pair with a `focus-visible:ring-*`.

### 6.2 Color Contrast (WCAG AA)

All text/background pairs in this kit meet **4.5:1** for body text and **3:1** for large text (≥18px/14px bold):

- `text-gray-700` on `bg-white` → 8.3:1 ✓
- `text-gray-300` on `bg-gray-800` → 8.9:1 ✓
- `text-gray-500` on `bg-white` (captions) → 4.6:1 ✓ (AA, borderline — don't drop to `gray-400` for body-sized text)
- `text-white` on `bg-blue-500` → 4.6:1 ✓
- `text-blue-600` on `bg-white` → 5.9:1 ✓ / `text-blue-400` on `bg-gray-900` → 7.2:1 ✓

Rule of thumb: never place `gray-400` text on a light background for anything other than placeholders/disabled states (those are exempt from AA body-text contrast requirements).

### 6.3 Keyboard Navigation

| Key | Action |
|---|---|
| `/` | Focus search input |
| `⌘K` / `Ctrl+K` | Open command palette |
| `j` / `k` | Next / previous verse or result |
| `b` | Toggle bookmark on focused verse |
| `Esc` | Close modal / command palette / clear search focus |
| `Tab` / `Shift+Tab` | Standard focus traversal |
| `Enter` | Activate focused item |
| `↑` / `↓` | Navigate command palette / dropdown results |

Modals and the command palette must **trap focus** while open and **restore focus** to the trigger element on close.

### 6.4 ARIA

- Icon-only buttons: always `aria-label` (see Button spec — never rely on `title` alone).
- Toggle/switch components: `role="switch"` + `aria-checked`.
- Command palette / modal: `role="dialog"` `aria-modal="true"` `aria-labelledby` pointing at the heading.
- Toasts: `role="status"` `aria-live="polite"` (errors: `aria-live="assertive"`).
- Verse list: consider `aria-label` on the chapter container (e.g. `aria-label="John chapter 3"`) so screen readers announce context once, not per-verse.
- Loading states: `aria-busy="true"` on the container being replaced by skeletons.

### 6.5 Reduced Motion

- Wrap app in `<MotionConfig reducedMotion="user">` (see §4.7).
- For any hand-rolled CSS transitions/animations not covered by Framer Motion, gate with:
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

---

## 7. Responsive Breakpoints

Tailwind defaults, used as-is (no custom breakpoints):

| Breakpoint | Range | Layout behavior |
|---|---|---|
| **Mobile** (default) | `< 768px` | Bottom nav visible, header nav condensed (icons only), stacked single-column content, `px-4` gutters, dropdowns become full-width sheets where practical |
| **`md:`** Tablet | `768px – 1024px` | Bottom nav hidden, header nav shows full labels, footer visible, content stays single-column but wider gutters (`px-6`), optional sidebar collapses to a top book-selector |
| **`lg:`** Desktop | `> 1024px` | Full header nav, optional sidebar (reader book list) shown, bookmarks page may go 2-column grid, max content width caps at `max-w-3xl` (reading views) / `max-w-5xl` (grid views) and centers with generous side margins |

Component-level responsive notes already baked into the specs above:
- Header: `hidden sm:flex` on the command palette trigger button (icon-only below `sm`).
- Page shell: `pt-20 md:pt-8` (clears fixed mobile header vs. sticky desktop header), `pb-24 md:pb-12` (clears bottom nav on mobile only).
- Typography: `h1`–`h3` and body text use `clamp()` for fluid scaling between mobile and desktop rather than hard breakpoint jumps (see §1.2, already configured in `index.css`).
