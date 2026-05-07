# MBA 507: JMP Clickpath Tree

Interactive decision tree for **MBA 507: Data-Driven Managerial Decisions 2** (Donnie Hale, NC State Jenkins MBA). Pick a topic, drill into a concept, click a leaf: the JMP clickpath, the LINE assumption it addresses, a worked example using a real dataset from your `/MBA 507` folder, and a managerial-interpretation prompt all explode out of the node.

Five course topics are wired in (Weeks 1 through 5): scatterplots & correlation, simple linear regression with LINE assumption checks, multiple linear regression with VIF, variable selection / dummies / interactions / transformations / influential points, and the Week 5 wrap-up (non-constant variance, ANOVA, intro to logistic regression).

## Getting started (if you want to make your own updates)

If you just want to use the app, visit the live site above. But if you want to add content, tweak the tree, or make other changes, and you've never used Node.js before, here's everything you need.

1. **Install Node.js:** Download the LTS version from [nodejs.org](https://nodejs.org/) and run the installer. This also installs `npm` (the package manager).

2. **Clone the repo:** Open a terminal (Terminal on Mac, PowerShell on Windows) and run:
   ```bash
   git clone https://github.com/pressleydavid/mba507-jmp-explorer.git
   cd mba507-jmp-explorer
   ```

3. **Install dependencies:** This downloads the libraries the app needs (React, Vite, etc.) into a local `node_modules/` folder. You only need to do this once:
   ```bash
   npm install
   ```

4. **Start the dev server:** This runs the app locally and opens it in your browser. It will auto-refresh whenever you save a change:
   ```bash
   npm run dev
   ```
   Then visit http://localhost:5173 in your browser.

5. **Edit content:** All the course content (topics, clickpaths, examples) lives in a single file: `src/data/topics.ts`. Open it in any text editor, make changes, and the browser will update automatically.

6. **Deploy your changes:** When you're happy with your edits:
   ```bash
   npm run deploy
   ```
   This publishes the updated app to GitHub Pages.

## Stack

- React 18 + TypeScript
- Vite (single-file build; `dist/index.html` with all JS/CSS inlined)
- No external runtime dependencies, no analytics, no tracking

## Develop

```bash
cd "mba507-jmp-explorer"
npm install
npm run dev          # http://localhost:5173
```

## Build for production

```bash
npm run build              # dist/index.html + dist/assets/*.{js,css}
npm run build:standalone   # also writes dist/standalone.html (single-file, ~190KB)
```

`standalone.html` has the JS and CSS inlined. Drop it anywhere (Linode, Dropbox, an SD card) and it just works, no web server config required.

## Deploy to GitHub Pages

The app is pre-configured to deploy to GitHub Pages via the `gh-pages` npm package.

```bash
npm run deploy
```

This builds the project and pushes the `dist/` folder to the `gh-pages` branch. The app will be available at:

```
https://<your-username>.github.io/mba507-jmp-explorer/
```

### Forking into an existing GitHub Pages site

If you already have a `<username>.github.io` repo and want to add this app under a subpath:

1. Fork or clone this repo.
2. In `vite.config.ts`, set the `base` option to match your desired subpath:
   ```ts
   base: '/mba507-jmp-explorer/',
   ```
3. Run `npm run deploy`. The `gh-pages` package will push the built files to the `gh-pages` branch of your fork.
4. In your repo's **Settings > Pages**, set the source to the `gh-pages` branch.

The app will be available at `https://<your-username>.github.io/mba507-jmp-explorer/`.

## File layout

```
mba507-jmp-explorer/
├── README.md
├── package.json
├── tsconfig*.json
├── vite.config.ts
├── index.html
└── src/
    ├── main.tsx               # React mount
    ├── App.tsx                # shell + popup state
    ├── styles.css             # design system (dark / glassy / accent-driven)
    ├── components/
    │   ├── Header.tsx
    │   ├── TreeView.tsx       # root → topics → branches → leaves
    │   └── ClickpathPopup.tsx # exploding card with JMP path + example
    └── data/
        └── topics.ts          # all course content lives here
```

## Editing the tree

Open `src/data/topics.ts` and edit the `tree` constant. Each `TreeNode` has:

| field | meaning |
|---|---|
| `kind` | `root` / `topic` / `branch` / `leaf` |
| `title`, `subtitle` | shown in the tree |
| `clickpath` | array of `{ label, hint? }` (only on leaves) |
| `example` | dataset, response, predictors, question, expected (drawn from your `/MBA 507` folder) |
| `assumptions`, `pitfalls`, `managerial` | shown in the popup |
| `accent` | topic-level accent color (CSS color string) |

Add a new test by appending another leaf under the matching `branch`. Add a new topic by adding another child under the root.

## Source materials

- Companion text: [Data-Driven Managerial Decisions 2](https://dhale-2025.github.io/Data_Driven_Managerial_Decisions2/)
- Doane & Seward, Ch. 12 (SLR) and Ch. 13 (MLR)
- Lecture slides + datasets in `/MBA 507/Week1` … `/Week5`
- Week 4 study pack and class notes in `/MBA 507/Week4/Practice Problems` and `/Week4/Lecture Slides`

JMP version targeted: **19.1.0**. Most paths are stable from 18.x onward; the major change is "Personality" being on the right of the Fit Model dialog and the addition of Box-Cox under Factor Profiling.
