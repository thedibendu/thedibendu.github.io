# thedibendu.github.io — Claude Code Project Brief

Dibendu Singh's personal portfolio. Plain HTML + CSS + vanilla JS.
No build step, no framework. GitHub Pages deployment (push to main = live).

---

## ── SECTION 0 · PROJECT RULES ──────────────────────────────────────────

- **No floating dots, star particles, or canvas animations** on any page (user explicitly rejected)
- **No hard-coded content in HTML** for publications or research — always edit the `.js` data files
- **No Codex for canvas/animation JS** — too slow; do those directly in Claude
- Use **CSS keyframe animations** for all motion (no JS-driven animation loops)
- All pages share `style.css`; page-specific styles go in their own `.css` file

---

## ── SECTION 1 · DESIGN SYSTEM ──────────────────────────────────────────

### Colours

| Token | Value | Used for |
|---|---|---|
| `--dark` | `#040d18` | Hero + dark section backgrounds |
| `--surface` | `#0b1929` | Card backgrounds |
| `--cyan` | `#06b6d4` | Primary accent |
| `--cyan-bright` | `#22d3ee` | Highlights, active states, glow |

Inline colours (not in :root):
- Card border: `rgba(6,182,212,0.14)`
- Card bg: `rgba(6,182,212,0.04)`
- Body text (on dark): `rgba(255,255,255,0.65)`
- Muted text: `rgba(255,255,255,0.35)`

### Typography

- Font: **DM Sans** (Google Fonts) — weights 300 / 400 / 500 / 600 / 700 / 800
- Only one font across the entire site

### Shared Patterns

**Scroll-reveal:** add class `reveal`, `reveal-left`, or `reveal-right`. JS `IntersectionObserver` adds `.visible`. Stagger with `style="--delay:0.1s"`.

**Glassmorphism cards:** `background: rgba(6,182,212,0.04)`, `border: 1px solid rgba(6,182,212,0.14)`, `border-radius: 20px`.

**Section backgrounds:** light sections = default white, dark sections = `class="bg-dark"`, subtle tint = `class="bg-surface"`.

### Keyframe Animations

In `style.css`: `heroShift` · `scrollBounce` · `cursorBlink` · `hv-spin` · `hv-pulse` · `hv-dna-flow` · `hv-chip-float`

In `research-pages.css`: `spin-slow` · `dna-float` · `cloud-pulse` · `thread-float` · `chain-sway` · `frame-pulse` · `fadeCode`

---

## ── SECTION 2 · MAIN PAGE (index.html + style.css) ─────────────────────

### Page Structure (top to bottom)

`#hero` → `#about` → `#research` (bg-dark) → `#skills` → `#cv` (bg-surface) → `#contact` (bg-dark) → `footer`

### Hero Section

Two-column grid (`.hero-inner`): left = text, right = animated molecular motor visual.

```
#hero
  .orb × 3           (absolute, blurred cyan glow blobs, z-index 1)
  .hero-inner         (grid: 55fr 45fr, z-index 2)
    .hero-content     (left — eyebrow, h1.hero-name, .hero-tags, .hero-bio, .hero-actions)
    .hero-visual      (right — CSS molecular motor diagram)
      .hv-stage
        .hv-bg-glow        cryo-EM density glow blob
        .hv-outer-ring     capsid shell
        .hv-motor-ring     hexameric ATPase ring (6 arcs, rotates 38s)
        .hv-subunits       6 glowing cyan dots, synced with motor ring
        .hv-inner-ring     portal channel (pulsing)
        .hv-dna-beam       DNA thread through center
        .hv-chip × 4       floating labels: Cryo-EM · ATP→Force · DNA Motor · ~4Å
  .scroll-cue         (absolute bottom)
```

Hero visual hides at `max-width: 900px` (mobile = text only).

### Research Cards on Main Page

Six `.card.research-card-link` elements inside `#research`. Each is an `<a>` linking to `research.html?topic=<id>`. To add a new card: add an `<a>` here AND a new entry in `research.js`.

### JavaScript in index.html

Five blocks (in order):
1. Nav style on scroll + back-to-top
2. Mobile hamburger
3. Active nav link (IntersectionObserver)
4. Scroll-reveal (.reveal → .visible)
5. Hero particle network — **REMOVED, do not re-add**

---

## ── SECTION 3 · JOURNAL (blog.html + blog.css + posts.js) ──────────────

### Data File: posts.js

```js
window.POSTS = [{
  id:       1,
  date:     "2026-01-15",
  title:    "Post title",
  category: "Lab Life",
  excerpt:  "Short preview shown on listing page.",
  body:     "Full HTML content of the post.",
  images:   []   // optional image filenames from /images/
}]
```

To add a new post: copy the template block at the top of `posts.js`, paste inside the array, edit fields. The journal page renders everything automatically.

### Layout

Two-column on desktop: left = post listing cards, right = sidebar (categories + recent posts). Single column on mobile.

---

## ── SECTION 4 · PUBLICATIONS (publications.html + publications.css + publications.js) ──

### Data File: publications.js

```js
window.PUBLICATIONS = [{
  id:      1,
  badge:   "Manuscript in preparation",  // "Published article" / "Preprint" / "Poster / presentation"
  year:    "2026",
  title:   "Full title here",
  authors: "Dibendu Singh, Co-author Name",
  note:    "Journal name or short description.",
  tags:    ["cryo-EM", "molecular motors"],
  url:     "https://doi.org/..."          // use "#" if not yet public
}]
```

Cards are rendered as `<a>` elements — the entire card is clickable and links to `url`.

### Layout

Two-column: left = publication card stack (`#pub-stack`), right = sidebar with snapshot stats and manuscript status timeline.

**Sidebar snapshot numbers** — currently hand-edited in `publications.html`. Future improvement: auto-calculate from `publications.js` data.

---

## ── SECTION 5 · RESEARCH PAGES (research.html + research-pages.css + research.js) ──

### How It Works

`research.html` is a single template. URL param `?topic=<id>` picks the topic from `research.js`. Unknown IDs redirect to `index.html#research`.

To edit research content: **only edit `research.js`**. Never put content in `research.html`.

### Data File: research.js

```js
window.RESEARCH = [{
  id:    "topic-id",
  title: "Topic Title",
  lede:  "One sentence shown in hero.",
  visual: "translocase",        // see visual types below
  chips:  ["Word1","Word2","Word3"],
  overview: {
    heading:    "Bold statement.",
    paragraphs: ["Para 1.", "Para 2."],
    stat:       { value: "ATP", label: "short label" }
  },
  points: [
    { label: "Step One", text: "Description." },
    { label: "Step Two", text: "Description." },
    { label: "Step Three", text: "Description." }
  ],
  focus: [
    { label: "Research question", text: "..." },
    { label: "Structural readout", text: "..." }
  ],
  why:       "Why this matters.",
  next:      "next-topic-id",
  nextLabel: "Next Topic Title",
  codeExamples: [...]   // optional — only on computational-workflows so far
}]
```

### Visual Types

| Value | Renders |
|---|---|
| `translocase` | dna-ribbon + motor-ring + dna-track |
| `motor` | motor-cycle (4 spans) + motor-ring |
| `capsid` | capsid-shell + motor-ring.compact + genome-thread |
| `microscope` | microscope-column + particle-field + density-cloud.small |
| `model` | density-cloud + model-chain + fit-frame |
| `workflow` | code-panel (4 hardcoded command lines) |

### Current Topics (in order)

`dna-translocases` → `molecular-motors` → `viral-dna-packaging` → `cryo-em` → `model-building` → `computational-workflows`

### Code Showcase (computational-workflows only)

Three tabbed examples: Filter particles (Python) · Batch refinement (Bash) · Validate maps (Python).
Syntax highlighting via `hlLine()` in research.html inline script.
Styles in `research-pages.css` under `/* CODE SHOWCASE */`.

### Page Layout (injected by JS)

```
research-page-hero → topic-nav strip → #overview → research-feature-band
  → [code-showcase if codeExamples] → research-focus → research-next
```

---

## ── SECTION 6 · SHARED META / HEAD ─────────────────────────────────────

All four HTML pages have (after `<meta name="description">`):

```html
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="shortcut icon" href="favicon.svg">
<meta property="og:type" ...>
<meta property="og:url" ...>
<meta property="og:title" ...>
<meta property="og:description" ...>
<meta property="og:image" content="https://thedibendu.github.io/photo.jpg">
<meta name="twitter:card" content="summary_large_image">
... (twitter equivalents)
```

When adding a new page, copy this block and update `og:url` and `og:title`.

---

## ── SECTION 7 · FUTURE WORK / KNOWN GAPS ───────────────────────────────

- Publications sidebar snapshot numbers are currently hand-edited — should auto-calculate from `publications.js`
- Research cards on main page are still hard-coded in `index.html` — could be driven by `research.js`
- No search or filter on the journal or publications pages yet
