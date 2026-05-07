Tech stack

Vite 5 + React 18 + TypeScript 5 (strict)
Tailwind CSS 3 with custom NC State Wolfpack palette + 5 category colors
Framer Motion 11 for the spring-animated detail card and leaf transitions
No backend, no API calls, no client routing — pure static SPA
vite.config.ts uses base: './' so it works at any subpath
Bundle: 297 KB raw / 97 KB gzipped

Project layout
mba507-flowchart/
├── package.json, vite.config.ts, tsconfig\*.json
├── tailwind.config.js, postcss.config.js
├── index.html
├── README.md (full Linode + nginx + Certbot deploy guide)
└── src/
├── main.tsx, App.tsx, index.css
├── types/index.ts # Topic, Category, ClickpathStep, WorkingExample
├── data/
│ ├── categories.ts # 5 branches (the content schema)
│ └── topics.ts # 18 topics — all course content lives here
├── components/
│ ├── Nodes.tsx # RootNode, CategoryNode, LeafNode
│ └── DetailCard.tsx # The "exploding" modal
└── lib/utils.ts # color class maps, bezier path helper
The content tree (5 branches, 18 leaves)
Branches are organized by managerial question, not statistical taxonomy — this is intentional and matches how Hale teaches the course (interpretation-first):
BranchQuestionColorLeavesExploreAre these variables related?blue #3B82F6Scatterplot, Pearson r, Correlation MatrixPredict (1 X)Predict Y from one X?emerald #10B981SLR, Polynomial SLRPredict (Many X)Controlling for several factors?violet #8B5CF6MLR, Indicator Vars, MLR + Polynomial, InteractionsValidate (LINE)Are assumptions met?amber #F59E0BLinearity, Independence, Normality, Equal Variance, Influential Points, Multicollinearity/VIFRefineWhich variables, which form?pink #EC4899Stepwise, All Possible, Fit Comparison, Transformations
