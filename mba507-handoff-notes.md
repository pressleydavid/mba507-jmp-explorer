# MBA 507 JMP Method Selector — Technical Handoff

## Tech stack

- Vite 5 + React 18 + TypeScript 5 (strict)
- Tailwind CSS 3 with custom NC State Wolfpack palette + 5 category colors
- Framer Motion 11 for the spring-animated detail card and leaf transitions
- No backend, no API calls, no client routing — pure static SPA
- `vite.config.ts` uses `base: './'` so it works at any subpath
- Bundle: 297 KB raw / 97 KB gzipped

## Project layout

```
mba507-flowchart/
├── package.json, vite.config.ts, tsconfig*.json
├── tailwind.config.js, postcss.config.js
├── index.html
├── README.md  (full Linode + nginx + Certbot deploy guide)
└── src/
    ├── main.tsx, App.tsx, index.css
    ├── types/index.ts          # Topic, Category, ClickpathStep, WorkingExample
    ├── data/
    │   ├── categories.ts       # 5 branches (the content schema)
    │   └── topics.ts           # 18 topics — all course content lives here
    ├── components/
    │   ├── Nodes.tsx           # RootNode, CategoryNode, LeafNode
    │   └── DetailCard.tsx      # The "exploding" modal
    └── lib/utils.ts            # color class maps, bezier path helper
```

## The content tree (5 branches, 18 leaves)

Branches are organized by **managerial question**, not statistical taxonomy — this is intentional and matches how Hale teaches the course (interpretation-first):

| Branch | Question | Color | Leaves |
|---|---|---|---|
| **Explore** | Are these variables related? | blue `#3B82F6` | Scatterplot, Pearson r, Correlation Matrix |
| **Predict (1 X)** | Predict Y from one X? | emerald `#10B981` | SLR, Polynomial SLR |
| **Predict (Many X)** | Controlling for several factors? | violet `#8B5CF6` | MLR, Indicator Vars, MLR + Polynomial, Interactions |
| **Validate (LINE)** | Are assumptions met? | amber `#F59E0B` | Linearity, Independence, Normality, Equal Variance, Influential Points, Multicollinearity/VIF |
| **Refine** | Which variables, which form? | pink `#EC4899` | Stepwise, All Possible, Fit Comparison, Transformations |

---

## Build & run commands

Requires Node 18+ (verified on Node 22.22.2, npm 10.9.7).

```bash
npm install                # one-time, installs 138 packages
npm run dev                # vite dev server on http://localhost:5173 (HMR)
npm run build              # tsc -b && vite build → ./dist
npm run preview            # serves ./dist on http://localhost:4173 (smoke test)
```

The `build` script runs **`tsc -b`** before Vite, so type errors fail the build. Vite-only builds skip type checking — don't switch to `vite build` alone without understanding the tradeoff.

## Type contracts (the editing surface)

All content lives in two files. Adding a topic means appending one object literal — no component changes.

```ts
// src/types/index.ts
export type CategoryId =
  | 'explore' | 'predict-1x' | 'predict-mx' | 'validate' | 'refine';

export interface Topic {
  id: string;                  // unique slug, used as React key
  category: CategoryId;        // determines branch + color
  short: string;               // text on the leaf node
  title: string;               // detail card heading
  weeks: string[];             // ['Week 1', 'Week 2']
  oneLiner: string;            // sentence under the title
  whenToUse: string;
  clickpath: ClickpathStep[];  // numbered JMP steps
  example: WorkingExample;     // dataset + setup + managerial reading
  concepts: string[];          // chip tags
  caveats?: string[];
  lineLetters?: ('L'|'I'|'N'|'E')[];  // VALIDATE topics only
}

export interface ClickpathStep {
  label: string;               // literal JMP menu text — use ▸ as separator
  note?: string;               // italicized clarifier
}

export interface WorkingExample {
  dataset: string;             // filename from the project folder
  setup: string;               // what to fit/run
  managerial: string;          // what a manager concludes
}
```

## State model (App.tsx)

Three pieces of state, no router, no global store, no context:

```ts
const [activeCats, setActiveCats] = useState<Set<CategoryId>>(...)  // open branches
const [openTopic, setOpenTopic]   = useState<Topic | null>(null)    // modal target
const [filterText, setFilterText] = useState('')                    // search
```

`topicsByCat` is a `useMemo`'d `Map<CategoryId, Topic[]>` rebuilt whenever `filterText` changes. Search matches against short name, title, concepts, and weeks (case-insensitive substring).

## Tailwind config notes

- **Custom palette is in `tailwind.config.js`** under `theme.extend.colors.wolfpack` and `theme.extend.colors.cat`. Changing a category hex requires updating both `tailwind.config.js` (for class generation) AND `src/data/categories.ts` (for inline `style={{ backgroundColor: hex }}` on the SVG/Framer pieces).
- **Tailwind safelist isn't used** — every dynamic class is mapped through `src/lib/utils.ts` (`catTextClass`, `catBgClass`, `catBorderClass`) so the JIT compiler sees them as literals. If you add a new category, add the corresponding entries to those maps or the classes will be purged.
- Fonts (Inter, JetBrains Mono, Source Serif 4) load from Google Fonts via `<link>` in `index.html`. For offline/airgapped deployment, self-host them and update the `link` tag.

## Animation specifics

- **DetailCard** uses a spring transition (`stiffness: 320, damping: 28, mass: 0.6`) for the pop-out. Initial state is `scale: 0.6, y: 40`. Tweak in `DetailCard.tsx`.
- **Leaf nodes** stagger in via `delay: i * 0.04` when their parent category opens. The `+`/`×` icon on the category node rotates 45° via `animate={{ rotate: isActive ? 45 : 0 }}`.
- Framer Motion's `AnimatePresence` wraps both the leaf list and the modal. **Don't remove `<AnimatePresence>` without removing `exit` props** — it'll silently break exit animations.

## Build output and caching

```
dist/
├── index.html              # 1.31 KB, no-cache (entry point, contains hashed asset refs)
└── assets/
    ├── index-[hash].js     # 296 KB / 97 KB gzipped, immutable
    └── index-[hash].css    # 19 KB / 4.4 KB gzipped, immutable
```

Vite hashes asset filenames on every build. Cache `index.html` for zero seconds and `/assets/*` for one year — this is exactly what the nginx config in the README does. Without that pattern, users will load stale JS after a redeploy.

## Deployment options ranked by effort

1. **Local-only:** `python3 -m http.server` from `dist/` directory. Zero install. Good for personal use.
2. **GitHub Pages:** push `dist/` to a `gh-pages` branch (or `/docs` on main). Free, custom-domain-capable.

## Browser/device support

- Targets `es2020` (set in `vite.config.ts`). Covers Safari 14+, Chrome 87+, Firefox 78+, Edge 88+.
- Backdrop blur (`glass`, `glass-strong` utility classes) needs `backdrop-filter` support — fine on every modern browser; Firefox required `layout.css.backdrop-filter.enabled` until v103.
- **Mobile is functional but not optimized.** The 5-column branch grid (`gridTemplateColumns: repeat(5, ...)`) is fixed; on narrow viewports leaf labels truncate. If mobile matters, add a `md:` breakpoint that switches to a vertical accordion layout.
- No accessibility audit has been done. The modal sets `role="dialog"` and `aria-modal="true"` and traps focus visually but doesn't programmatically focus the close button on open or restore focus on close. Add a `useEffect` with `ref.current?.focus()` if needed.

## Known gotchas

- **Tailwind v3, not v4.** The class-generation rules and config syntax differ. Don't blindly copy v4 examples in.
- **`base: './'` in vite.config.ts** is what makes the same build work at `/` or `/mba507/`. If you ever need absolute paths (e.g., for a service worker), change this to `'/'` or the actual subpath.
- **Strict mode + Framer Motion:** React 18's StrictMode double-invokes effects in dev. Framer Motion handles this fine, but custom `useEffect` animations (none currently) need to be idempotent.
- **No tests.** No vitest, no Playwright. Smoke test was a one-shot Puppeteer script during the build, not committed.
- **No CI.** Add a GitHub Action with `npm ci && npm run build` if you want PR checks.
- **TypeScript path aliases not configured.** All imports are relative (`'./components/Nodes'`). If the file tree grows, add `@/*` paths to `tsconfig.json` and `vite.config.ts`.

## Performance notes

- 296 KB JS bundle is mostly Framer Motion (~150 KB minified) and React (~45 KB). If size matters, swap Framer Motion for CSS transitions — saves ~50 KB gzipped — but you lose the springs.
- The 18 topics are statically imported. If the tree grows past ~50 topics, code-split the `topics.ts` data with a dynamic `import()` triggered on first interaction.
- All animations run on transform/opacity (GPU-accelerated). No layout thrash observed in the Puppeteer smoke test.

## Files in the delivered zips

**`mba507-jmp-selector-dist.zip`** — three files, drop into any web root:
```
mba507-dist/index.html
mba507-dist/assets/index-[hash].js
mba507-dist/assets/index-[hash].css
```

**`mba507-jmp-selector-source.zip`** — full editable project, no `node_modules`:
```
mba507-flowchart/
├── (config files)
├── README.md
└── src/  (9 files)
```
Run `npm install && npm run build` to reproduce the dist.
