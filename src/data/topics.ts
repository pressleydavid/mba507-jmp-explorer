/**
 * MBA 507: Data Driven Managerial Decisions 2
 * JMP Clickpath Tree
 *
 * Each leaf node maps a course concept to:
 *   - the exact JMP menu/red-triangle path
 *   - the assumption(s) the test addresses
 *   - a worked example built on a real dataset from the MBA 507 project folder
 *   - a managerial interpretation prompt
 *
 * Source materials referenced:
 *   - Companion text https://dhale-2025.github.io/Data_Driven_Managerial_Decisions2/
 *   - Week 1 through 5 lecture slides + lecture data in /MBA 507
 *   - Week 4 study pack and class notes
 */

export type NodeKind = "root" | "topic" | "branch" | "leaf";

export interface ClickpathStep {
  /** Menu / button label as it appears in JMP */
  label: string;
  /** Optional tooltip / extra context */
  hint?: string;
}

export interface WorkedExample {
  dataset: string;
  /** Folder-relative path so the user knows which file to open in JMP */
  path: string;
  response: string;
  predictors: string[];
  question: string;
  expected: string;
}

export interface TreeNode {
  id: string;
  kind: NodeKind;
  title: string;
  /** Short subtitle shown under the title in the tree */
  subtitle?: string;
  /** Long body shown inside the popup */
  description?: string;
  /** Assumption(s) addressed by this branch / test */
  assumptions?: string[];
  /** Pitfall warnings drawn from the course's "common mistakes" list */
  pitfalls?: string[];
  /** Step-by-step JMP path (only on leaves) */
  clickpath?: ClickpathStep[];
  /** Worked example using a real MBA 507 dataset */
  example?: WorkedExample;
  /** Managerial interpretation prompt */
  managerial?: string;
  children?: TreeNode[];
  /** Visual accent color for the topic's subtree */
  accent?: string;
}

// ────────────────────────────────────────────────────────────────────────────────
// Worked-example datasets actually present in /MBA 507/
// ────────────────────────────────────────────────────────────────────────────────

const DS = {
  paper: {
    dataset: "Paper Data.jmp",
    path: "Week1/Practice Problems/Paper Data.jmp",
  },
  companies: {
    dataset: "Companies 507.jmp",
    path: "Week1/Practice Problems/Companies 507.jmp",
  },
  cars: {
    dataset: "Cars.txt",
    path: "Week1/Practice Problems/Cars.txt",
  },
  fitness: {
    dataset: "Fitness.jmp",
    path: "Week2/Lecture Data/Fitness.jmp",
  },
  mlbValues: {
    dataset: "MLB data.jmp",
    path: "Week2/Lecture Data/MLB data.jmp",
  },
  mlb: {
    dataset: "MLB data.jmp",
    path: "Week2/Lecture Data/MLB data.jmp",
  },
  housing: {
    dataset: "WK3 Housing Prices.csv",
    path: "Week3/Practice Problems/WK3 Housing Prices.csv",
  },
  baseball: {
    dataset: "WK3 Baseball Example.jmp",
    path: "Week3/Practice Problems/WK3 Baseball Example.jmp",
  },
  homePrices4: {
    dataset: "Wk4 Home Prices.jmp",
    path: "Week4/Lecture Data/Wk4 Home Prices.jmp",
  },
  college: {
    dataset: "WK4 College.jmp",
    path: "Week4/Lecture Data/WK4 College.jmp",
  },
  insulation: {
    dataset: "WK 5 Insulation Data.jmp",
    path: "Week5/Lecture Slides and Data-20260426/WK 5 Insulation Data.jmp",
  },
  ph: {
    dataset: "WK 5 PH Data.jmp",
    path: "Week5/Lecture Slides and Data-20260426/WK 5 PH Data.jmp",
  },
} as const;

// Helper: build a step from a "A > B > C" string
const cp = (path: string, hint?: string): ClickpathStep => ({
  label: path,
  hint,
});

// ────────────────────────────────────────────────────────────────────────────────
// TREE
// ────────────────────────────────────────────────────────────────────────────────

export const tree: TreeNode = {
  id: "root",
  kind: "root",
  title: "MBA 507",
  subtitle: "Data-Driven Managerial Decisions 2: JMP decision tree",
  description:
    "Pick a topic, then a concept, then a test. Each leaf shows the exact JMP 19.1.0 clickpath, the assumption being checked, a worked example using a dataset from the course materials, and a managerial interpretation prompt.",
  children: [
    // ──────────────────────────────────────────── TOPIC 1 ───────────────────────
    {
      id: "t1",
      kind: "topic",
      title: "Topic 1",
      subtitle: "Scatterplots & Correlation (Week 1)",
      description:
        "Always look at the data first. Use scatterplots to check shape, direction, and outliers; use Pearson's r only after you've confirmed the relationship looks linear. Correlation ≠ causation; lurking variables can fake a relationship.",
      accent: "#f5b454",
      children: [
        {
          id: "t1-pair",
          kind: "branch",
          title: "Single-pair scatterplot",
          subtitle: "One X vs one Y",
          children: [
            {
              id: "t1-pair-fityx",
              kind: "leaf",
              title: "Fit Y by X scatterplot",
              subtitle: "Fastest way to see one relationship",
              assumptions: ["Both variables continuous", "Look for linearity before computing r"],
              clickpath: [
                cp("Analyze ▸ Fit Y by X"),
                cp('Drag the response into the "Y, Response" box'),
                cp('Drag the predictor into the "X, Factor" box'),
                cp("Click OK"),
                cp("Inspect the scatterplot for shape, outliers, and clusters"),
              ],
              example: {
                ...DS.paper,
                response: "strength",
                predictors: ["amount"],
                question:
                  "Does the amount of pulp affect paper strength? What does the cloud of points look like?",
                expected:
                  "A clear positive, roughly linear relationship. Paper strength increases with amount.",
              },
              managerial:
                "Before reporting an r-value, confirm the cloud is linear. A curved cloud invalidates Pearson's r and a single number will mislead the operator.",
              pitfalls: [
                "Reporting r without looking at the plot. Outliers and curves can flip the story.",
              ],
            },
            {
              id: "t1-pair-graph",
              kind: "leaf",
              title: "Graph Builder scatterplot",
              subtitle: "Customizable, color/size by a third variable",
              clickpath: [
                cp("Graph ▸ Graph Builder"),
                cp("Drag X column to the X drop zone"),
                cp("Drag Y column to the Y drop zone"),
                cp("Optionally drop a categorical column on Color or Overlay"),
                cp("Right-click ▸ Add ▸ Smoother (or Line of Fit)"),
                cp("Done (top-left)"),
              ],
              example: {
                ...DS.fitness,
                response: "Oxy",
                predictors: ["Runtime", "Gender (color)"],
                question:
                  "Does the runtime → oxygen-uptake relationship differ for men and women?",
                expected:
                  "Negative slope overall (lower runtime = better oxygen uptake), with the two genders showing slightly offset clouds.",
              },
              managerial:
                "Coloring by a third variable is a poor-man's interaction check before you ever fit a model.",
            },
          ],
        },
        {
          id: "t1-mat",
          kind: "branch",
          title: "Many-pair scan",
          subtitle: "Scatterplot matrix + correlation matrix",
          children: [
            {
              id: "t1-mat-multi",
              kind: "leaf",
              title: "Pearson correlation matrix",
              subtitle: "Use to triage candidate predictors",
              assumptions: [
                "Pearson assumes linearity; verify with a scatterplot matrix first",
                "Sensitive to outliers; a single point can dominate r",
              ],
              clickpath: [
                cp("Analyze ▸ Multivariate Methods ▸ Multivariate"),
                cp('Add all candidate continuous columns to "Y, Columns"'),
                cp("Click OK"),
                cp("Inspect the Correlations table and Scatterplot Matrix"),
                cp(
                  "Red triangle ▸ Pairwise Correlations  →  to see p-values",
                ),
              ],
              example: {
                ...DS.cars,
                response: "MidPrice",
                predictors: ["HwyMPG", "CityMPG", "EngineSize", "Horsepower", "Weight"],
                question:
                  "Which engine/efficiency variables are most strongly associated with mid-range price?",
                expected:
                  "Strong negative r between MPG and Price, strong positive r between Horsepower/Weight and Price; HwyMPG and CityMPG are nearly perfectly correlated (multicollinearity warning for MLR later).",
              },
              managerial:
                "Use the matrix to spot redundant predictors before fitting MLR. Two columns with r > 0.9 carry essentially the same information.",
              pitfalls: [
                "Treating high r as evidence of causality.",
                "Skipping the scatterplot. A single outlier or curve can produce a misleading r.",
              ],
            },
            {
              id: "t1-mat-corr-r2",
              kind: "leaf",
              title: "Correlation vs R² (in SLR)",
              subtitle: "In simple linear regression, r² = R²",
              clickpath: [
                cp("Analyze ▸ Fit Y by X ▸ Fit Line"),
                cp("Read R² in the Summary of Fit table"),
                cp(
                  "Compare to r from Multivariate (Analyze ▸ Multivariate Methods ▸ Multivariate)",
                ),
                cp("Confirm: r² (squared correlation) equals R² shown in Fit Line"),
              ],
              example: {
                ...DS.paper,
                response: "strength",
                predictors: ["amount"],
                question: "Show the link between r and R².",
                expected:
                  "Correlation r ≈ 0.95, R² ≈ 0.90. Squaring r recovers R² exactly.",
              },
              managerial:
                "R² alone is not a quality verdict. A high R² with bad residuals is still a bad model.",
            },
          ],
        },
        {
          id: "t1-out",
          kind: "branch",
          title: "Outlier & shape diagnostics",
          children: [
            {
              id: "t1-out-dist",
              kind: "leaf",
              title: "Univariate outlier check",
              subtitle: "Distribution of each variable",
              clickpath: [
                cp("Analyze ▸ Distribution"),
                cp('Add columns to "Y, Columns" and click OK'),
                cp("Look at boxplot whiskers and histogram tails"),
                cp(
                  "Red triangle on a column ▸ Save ▸ Outlier Box Plot Outliers (flag rows)",
                ),
              ],
              example: {
                ...DS.companies,
                response: "Profits ($M)",
                predictors: [],
                question: "Are any companies extreme on profits or assets?",
                expected:
                  "Boxplot reveals 2 to 3 large companies pulling the right tail. They will dominate any correlation with size.",
              },
              managerial:
                "Outliers are not always 'wrong'. Sometimes they ARE the business decision (the top 1% of customers). Identify, then decide.",
            },
          ],
        },
      ],
    },

    // ──────────────────────────────────────────── TOPIC 2 ───────────────────────
    {
      id: "t2",
      kind: "topic",
      title: "Topic 2",
      subtitle: "Simple Linear Regression + LINE assumptions (Week 2)",
      description:
        "Fit a single line ŷ = b₀ + b₁x. Validate with the LINE assumptions: Linearity, Independence, Normality of residuals, Equal variance. Don't extrapolate beyond the observed range of x.",
      accent: "#5aa9e6",
      children: [
        {
          id: "t2-fit",
          kind: "branch",
          title: "Fit the line",
          children: [
            {
              id: "t2-fit-line",
              kind: "leaf",
              title: "Fit Line (SLR)",
              subtitle: "Slope, intercept, R², slope p-value",
              clickpath: [
                cp("Analyze ▸ Fit Y by X"),
                cp("Y = response, X = predictor → OK"),
                cp("Red triangle ▸ Fit Line"),
                cp("Read: Parameter Estimates → b₀, b₁, p-value of slope"),
                cp("Read: Summary of Fit → R², Adj R², RMSE"),
                cp(
                  "Red triangle ▸ Confid Curves Fit  /  Confid Curves Indiv  to overlay CI/PI bands",
                ),
              ],
              example: {
                ...DS.mlbValues,
                response: "Franchise Value ($M)",
                predictors: ["Estimated Revenue ($M)"],
                question:
                  "Does revenue predict franchise value, and what's the unit-economic story?",
                expected:
                  "Slope is significant. Each additional $1M in revenue is associated with a meaningful increase in franchise value.",
              },
              managerial:
                'Interpret slope as: "for each 1-unit increase in X, predicted Y changes by b₁ (within the observed range of X)."',
              pitfalls: [
                "Interpreting the intercept literally when X = 0 is outside the data range.",
                "Predicting outside the observed X range (extrapolation).",
              ],
            },
            {
              id: "t2-fit-poly",
              kind: "leaf",
              title: "Fit Polynomial (degree 2/3/4)",
              subtitle: "When the cloud is curved",
              assumptions: [
                "Use only when residuals from a linear fit show curvature",
                "Higher degree ≠ better; watch for overfitting",
              ],
              clickpath: [
                cp("Analyze ▸ Fit Y by X (same as SLR)"),
                cp("Red triangle ▸ Fit Polynomial ▸ 2 (or 3, 4)"),
                cp("Compare R² and look at the residual plot"),
                cp("Use Compare Models report (Save the model first if needed)"),
              ],
              example: {
                ...DS.mlbValues,
                response: "Franchise Value ($M)",
                predictors: ["Estimated Revenue ($M)"],
                question: "Is franchise value a linear or quadratic function of revenue?",
                expected:
                  "Compare R² between linear and quadratic fits. If the quadratic term is significant, marginal revenue has a diminishing effect on value.",
              },
              managerial:
                "A quadratic relationship means the marginal effect of revenue on value changes at different revenue levels. The slope coefficient is no longer a constant.",
            },
          ],
        },
        {
          id: "t2-line",
          kind: "branch",
          title: "LINE assumptions",
          subtitle: "Linearity, Independence, Normality, Equal variance",
          children: [
            {
              id: "t2-line-l",
              kind: "leaf",
              title: "L: Linearity",
              subtitle: "Residuals vs Fitted should be patternless",
              assumptions: [
                "Mean of residuals = 0 across all fitted values",
                "No bow / U / inverted-U pattern",
              ],
              clickpath: [
                cp("Analyze ▸ Fit Y by X ▸ Fit Line"),
                cp(
                  "Red triangle on the Linear Fit report ▸ Plot Residuals",
                ),
                cp(
                  'Inspect the "Residual by Predicted" plot; look for a curved pattern',
                ),
                cp(
                  "If curved → return to Fit Polynomial or transform X (log/sqrt)",
                ),
              ],
              example: {
                ...DS.mlbValues,
                response: "Franchise Value ($M)",
                predictors: ["Estimated Revenue ($M)"],
                question: "Does the residual-vs-fitted plot reveal curvature?",
                expected:
                  "Look for a U or bow pattern. If present, a polynomial or log transform may fit better than a straight line.",
              },
              managerial:
                "A curved residual plot means your linear coefficient is an average of two different slopes. The 'one number' is misleading the manager.",
            },
            {
              id: "t2-line-i",
              kind: "leaf",
              title: "I: Independence",
              subtitle: "Mostly a problem with time-ordered data",
              clickpath: [
                cp("Analyze ▸ Fit Model (or Fit Y by X ▸ Fit Line)"),
                cp(
                  "Red triangle ▸ Save Columns ▸ Residuals",
                ),
                cp(
                  "If data is time-ordered: Graph ▸ Graph Builder, drop residuals on Y and time/index on X",
                ),
                cp(
                  "Or red triangle ▸ Row Diagnostics ▸ Durbin-Watson  (in Fit Model)",
                ),
              ],
              example: {
                ...DS.mlb,
                response: "Franchise Value ($M)",
                predictors: ["Estimated Revenue ($M)"],
                question:
                  "Are residuals correlated team-by-team or year-over-year?",
                expected:
                  "Cross-sectional snapshot, so independence is plausible, but if you used multiple years, Durbin-Watson would be the test.",
              },
              managerial:
                "Autocorrelated residuals make every standard error and p-value too small. Treat 'significant' results from time-series with skepticism unless independence is checked.",
            },
            {
              id: "t2-line-n",
              kind: "leaf",
              title: "N: Normality of residuals",
              subtitle: "Histogram + Q-Q plot",
              assumptions: [
                "Residuals (NOT the response) should be approximately normal",
                "More important for inference than for prediction",
              ],
              clickpath: [
                cp("Analyze ▸ Fit Y by X ▸ Fit Line  (or Fit Model)"),
                cp("Red triangle ▸ Save Columns ▸ Residuals"),
                cp(
                  "Analyze ▸ Distribution → drop the residuals column → OK",
                ),
                cp(
                  "Red triangle on Distribution ▸ Continuous Fit ▸ Normal",
                ),
                cp(
                  "Red triangle ▸ Normal Quantile Plot  (visual Q-Q)",
                ),
                cp(
                  "Optionally: Red triangle ▸ Goodness of Fit  (Shapiro-Wilk)",
                ),
              ],
              example: {
                ...DS.mlbValues,
                response: "Franchise Value ($M)",
                predictors: ["Estimated Revenue ($M)"],
                question:
                  "Are the residuals from the linear fit approximately normal?",
                expected:
                  "Check the histogram and Normal Quantile Plot of residuals. Mild departures in tails are common with financial data.",
              },
              managerial:
                "Mild non-normality with large n is usually fine (CLT). Heavy skew or fat tails warrants caution on confidence intervals.",
            },
            {
              id: "t2-line-e",
              kind: "leaf",
              title: "E: Equal variance (homoscedasticity)",
              subtitle: "Funnel/megaphone in residual plot = bad",
              clickpath: [
                cp("Analyze ▸ Fit Y by X ▸ Fit Line  (or Fit Model)"),
                cp(
                  "Red triangle ▸ Plot Residuals  (Fit Y by X)  OR  Row Diagnostics ▸ Plot Residual by Predicted (Fit Model)",
                ),
                cp(
                  "Funnel-shaped scatter → variance grows with fitted value → consider log(Y)",
                ),
                cp(
                  "Optionally fit again with: Tables ▸ Compute → log(Y), refit",
                ),
              ],
              example: {
                ...DS.companies,
                response: "Profits ($M)",
                predictors: ["Sales ($M)"],
                question:
                  "Does residual spread grow with company size?",
                expected:
                  "Strong megaphone. Large companies have large residual variance. log-transform of Profits/Sales is the textbook fix.",
              },
              managerial:
                "Heteroscedasticity makes prediction intervals wrong: too wide for small Y, too narrow for large Y. Decisions based on those intervals will be miscalibrated.",
            },
          ],
        },
        {
          id: "t2-int",
          kind: "branch",
          title: "Inference & prediction",
          children: [
            {
              id: "t2-int-ci",
              kind: "leaf",
              title: "Confidence interval for the slope",
              clickpath: [
                cp("Analyze ▸ Fit Y by X ▸ Fit Line"),
                cp(
                  'Right-click on the Parameter Estimates table ▸ Columns ▸ Lower 95%, Upper 95%',
                ),
                cp(
                  "If 0 is inside the 95% CI for the slope, you cannot reject H₀: β₁ = 0",
                ),
              ],
              example: {
                ...DS.paper,
                response: "strength",
                predictors: ["amount"],
                question: "What's the 95% CI for the slope of strength on amount?",
                expected:
                  "CI is comfortably above 0 → strong evidence amount drives strength.",
              },
              managerial:
                "Quote the CI to managers, not just the p-value. A CI conveys the magnitude of the effect, not just its statistical existence.",
            },
            {
              id: "t2-int-pi",
              kind: "leaf",
              title: "Prediction & confidence bands",
              clickpath: [
                cp("Analyze ▸ Fit Y by X ▸ Fit Line"),
                cp(
                  "Red triangle ▸ Confid Curves Fit  → mean response band",
                ),
                cp(
                  "Red triangle ▸ Confid Curves Indiv  → individual prediction band",
                ),
                cp(
                  "To predict at a specific X: Red triangle ▸ Save Columns ▸ Prediction Formula, then add a row with the new X",
                ),
              ],
              example: {
                ...DS.fitness,
                response: "Oxy",
                predictors: ["Runtime"],
                question:
                  "Predict Oxy at runtime = 9.5 minutes. Give a single estimate and an interval.",
                expected:
                  "Point prediction near the regression line; PI noticeably wider than CI because it includes individual-level noise.",
              },
              managerial:
                "Use the CI when forecasting an average, the PI when forecasting an individual. They are very different intervals. Confusing them is one of the most common business reporting errors.",
            },
          ],
        },
      ],
    },

    // ──────────────────────────────────────────── TOPIC 3 ───────────────────────
    {
      id: "t3",
      kind: "topic",
      title: "Topic 3",
      subtitle: "Multiple Linear Regression (Week 3)",
      description:
        "Move from one X to many. Coefficients are now interpreted holding all other predictors constant. Adjusted R² penalizes unhelpful predictors. Multicollinearity (high VIF) destabilizes the coefficients you most want to interpret.",
      accent: "#7ed957",
      children: [
        {
          id: "t3-fit",
          kind: "branch",
          title: "Fit the model",
          children: [
            {
              id: "t3-fit-mlr",
              kind: "leaf",
              title: "Fit Model: Standard Least Squares",
              subtitle: "All MLR work flows from here",
              clickpath: [
                cp("Analyze ▸ Fit Model"),
                cp('Drag the response into "Y"'),
                cp(
                  'Highlight all predictors → click "Add" so they appear under Construct Model Effects',
                ),
                cp('Personality stays at "Standard Least Squares"'),
                cp("Click Run"),
                cp(
                  "Read: Summary of Fit (R², Adj R², RMSE) → ANOVA → Parameter Estimates → Effect Tests",
                ),
              ],
              example: {
                ...DS.housing,
                response: "Price",
                predictors: ["Living Area", "Bedrooms", "Bathrooms", "Fireplaces", "Age"],
                question:
                  "Holding other features constant, which factors drive house price?",
                expected:
                  "Living Area dominates; Bedrooms can come out negative once Living Area is in (more bedrooms in the same square footage means smaller rooms).",
              },
              managerial:
                'Sign flips ARE the lesson of MLR. "Bedrooms is bad for price" is nonsense without "holding Living Area constant".',
              pitfalls: [
                'Using "Bedrooms is negative therefore bedrooms hurt price" outside the held-constant frame.',
                "Reading R² without Adjusted R² when comparing models.",
              ],
            },
            {
              id: "t3-fit-effects",
              kind: "leaf",
              title: "Effect Tests (overall significance of a predictor)",
              subtitle: "Especially important for categorical predictors",
              clickpath: [
                cp("Inside Fit Model output: scroll to Effect Tests table"),
                cp(
                  "Each row is a partial F-test: 'does this effect add anything beyond the others?'",
                ),
                cp(
                  "For a categorical with k levels, this single F-test is what you cite, not k−1 individual t-tests",
                ),
              ],
              example: {
                ...DS.baseball,
                response: "Salary",
                predictors: ["League", "Position", "Years", "BattingAvg"],
                question:
                  "Does Position (a categorical with several levels) matter overall, controlling for the rest?",
                expected:
                  "Effect Test gives a single p-value for Position as a whole, much cleaner than reading dummy-by-dummy.",
              },
              managerial:
                "Quote the partial F-test for the whole categorical variable, not a single dummy-vs-reference contrast. The latter is a different question.",
            },
          ],
        },
        {
          id: "t3-multi",
          kind: "branch",
          title: "Multicollinearity",
          children: [
            {
              id: "t3-multi-vif",
              kind: "leaf",
              title: "VIF (Variance Inflation Factor)",
              subtitle: "VIF > 5 suspicious, > 10 problematic",
              assumptions: [
                "Predictors should not be highly linearly dependent on one another",
                "VIFᵢ = 1 / (1 − R²ᵢ) where R²ᵢ is from regressing Xᵢ on the other predictors",
              ],
              clickpath: [
                cp("Analyze ▸ Fit Model → Run"),
                cp(
                  "Right-click on the Parameter Estimates table ▸ Columns ▸ VIF",
                ),
                cp(
                  "Inspect: any VIF > 5 → multicollinearity warning; > 10 → fix it",
                ),
                cp(
                  'Fix by removing or combining the redundant predictor (e.g., keep "HwyMPG", drop "CityMPG")',
                ),
              ],
              example: {
                ...DS.cars,
                response: "MidPrice",
                predictors: ["HwyMPG", "CityMPG", "Horsepower", "Weight", "EngineSize"],
                question: "Which predictors collide with one another?",
                expected:
                  "VIF on HwyMPG and CityMPG is huge (> 20) → drop one. EngineSize/Horsepower/Weight may also have moderate VIFs.",
              },
              managerial:
                'When VIF is high, the coefficient for a variable is the "extra info this variable adds beyond the others," and there isn\'t much. The number on that variable is unstable; do not anchor a decision on it.',
              pitfalls: [
                "Treating a non-significant t in the presence of high VIF as evidence the variable doesn't matter; it might just be redundant.",
              ],
            },
          ],
        },
        {
          id: "t3-resid",
          kind: "branch",
          title: "MLR residuals",
          children: [
            {
              id: "t3-resid-rd",
              kind: "leaf",
              title: "Residual diagnostics in Fit Model",
              clickpath: [
                cp("Inside Fit Model output: Red triangle (top of report) ▸ Row Diagnostics"),
                cp(
                  "Plot Residual by Predicted  → linearity & equal variance",
                ),
                cp("Plot Residual by Row Number → independence (if ordered)"),
                cp(
                  "Press, Durbin-Watson  → autocorrelation in residuals",
                ),
                cp(
                  "Red triangle ▸ Save Columns ▸ Residuals, Studentized Residuals, Hats, Cook's D Influence",
                ),
              ],
              example: {
                ...DS.housing,
                response: "Price",
                predictors: ["Living Area", "Bedrooms", "Bathrooms", "Fireplaces", "Age"],
                question:
                  "Once we control for everything, are the residuals well-behaved?",
                expected:
                  "Mild fan-shape suggests log(Price) might tighten things up; one or two high-Cook's-D points worth flagging.",
              },
              managerial:
                "All four LINE assumptions still apply in MLR; they just need to be checked against the multivariate fitted values, not a single-X scatter.",
            },
          ],
        },
      ],
    },

    // ──────────────────────────────────────────── TOPIC 4 ───────────────────────
    {
      id: "t4",
      kind: "topic",
      title: "Topic 4",
      subtitle: "Variable selection, dummies, interactions, transforms (Week 4)",
      description:
        "Make a real-world model: pick predictors with stepwise/best-subsets, encode categoricals, add interactions when the slope of one X depends on another, transform when residuals misbehave, and identify influential observations.",
      accent: "#c084fc",
      children: [
        {
          id: "t4-sel",
          kind: "branch",
          title: "Variable selection",
          children: [
            {
              id: "t4-sel-step",
              kind: "leaf",
              title: "Stepwise (mixed)",
              subtitle: "First-pass model, never the final word",
              clickpath: [
                cp("Analyze ▸ Fit Model"),
                cp("Y = response; add ALL candidate predictors to Construct Model Effects"),
                cp('Change "Personality" (top right) to "Stepwise"'),
                cp("Click Run"),
                cp(
                  'Stopping Rule: choose "Minimum BIC" (preferred) or "P-value Threshold"',
                ),
                cp('Direction: choose "Mixed" (default), "Forward", or "Backward"'),
                cp("Click Go"),
                cp(
                  'Click "Make Model" → opens a new Fit Model dialog with the selected variables',
                ),
                cp("Click Run on that follow-up dialog → final fit"),
              ],
              example: {
                ...DS.housing,
                response: "Price",
                predictors: [
                  "Living Area",
                  "Bedrooms",
                  "Bathrooms",
                  "Fireplaces",
                  "Age",
                ],
                question:
                  "Which subset of home features forms the most parsimonious BIC-minimizing model?",
                expected:
                  "Living Area dominates; some features like Fireplaces or Age may drop as they add little beyond Living Area and Bathrooms.",
              },
              managerial:
                'Stepwise gives "a" model, not "the" model. Confirm with VIF, sign sense, and theory before reporting.',
              pitfalls: [
                "Reporting stepwise p-values as if they were valid. They're inflated by selection.",
                "Ignoring theory and dropping a variable the business knows must be in the model.",
              ],
            },
            {
              id: "t4-sel-best",
              kind: "leaf",
              title: "All Possible Models / Best Subsets",
              clickpath: [
                cp("Analyze ▸ Fit Model"),
                cp("Add all candidate predictors → Personality = Stepwise → Run"),
                cp(
                  "Red triangle on Stepwise report ▸ All Possible Models",
                ),
                cp(
                  "Sort by AICc, BIC, or Adjusted R² to compare subsets",
                ),
                cp(
                  "Pick the model with lowest BIC (parsimony) or AICc (predictive)",
                ),
              ],
              example: {
                ...DS.housing,
                response: "Price",
                predictors: [
                  "Living Area",
                  "Bedrooms",
                  "Bathrooms",
                  "Fireplaces",
                  "Age",
                ],
                question:
                  "Among 5 home features, which combination minimizes BIC?",
                expected:
                  "A 2 to 3 variable subset typically wins BIC; adding all 5 nudges Adjusted R² up slightly but loses on BIC due to the parsimony penalty.",
              },
              managerial:
                "BIC is more aggressive than AIC at penalizing complexity. If interpretability matters more than out-of-sample prediction, prefer BIC.",
            },
          ],
        },
        {
          id: "t4-cat",
          kind: "branch",
          title: "Categorical & interaction terms",
          children: [
            {
              id: "t4-cat-dummy",
              kind: "leaf",
              title: "Categorical predictor (auto-dummy)",
              subtitle: "JMP creates dummies / effect-coding for you",
              clickpath: [
                cp("Cols ▸ Column Info → set the column's Modeling Type to Nominal"),
                cp("Analyze ▸ Fit Model → add the categorical column as an effect"),
                cp("Run"),
                cp(
                  "Read coefficient on each level. JMP uses effect coding (deviations from the overall mean) by default",
                ),
                cp(
                  "Read Effect Tests → single p-value for the categorical as a whole",
                ),
              ],
              example: {
                ...DS.cars,
                response: "MidPrice",
                predictors: ["Type (categorical)", "Horsepower", "Weight"],
                question:
                  "Does vehicle Type explain price beyond Horsepower and Weight?",
                expected:
                  "Effect Test for Type is significant; individual level coefficients show Sporty/Luxury commanding a price premium relative to the mean.",
              },
              managerial:
                "Each level coefficient is a comparison: to the overall mean (effect coding) or to a reference level (dummy coding). Always report which one you're using.",
              pitfalls: [
                "Including all k levels manually: the dummy-variable trap. Let JMP encode the variable automatically.",
              ],
            },
            {
              id: "t4-cat-int",
              kind: "leaf",
              title: "Interaction term (X₁ · X₂)",
              subtitle: "Use when the slope of X₁ depends on X₂",
              clickpath: [
                cp("Analyze ▸ Fit Model"),
                cp("Add the two main effects (X₁ and X₂) to Construct Model Effects"),
                cp(
                  "Highlight BOTH in the column list ▸ click 'Cross' → adds X₁*X₂",
                ),
                cp(
                  "Or: highlight all → Macros ▸ Factorial to Degree (= 2) for all pairwise interactions",
                ),
                cp("Run"),
                cp(
                  "Hierarchy: keep the main effects in the model even if their solo p-value isn't significant",
                ),
              ],
              example: {
                ...DS.homePrices4,
                response: "Price",
                predictors: ["Living Area", "Downtown (0/1)", "Living Area * Downtown"],
                question:
                  "Does each extra square foot earn more in downtown vs non-downtown?",
                expected:
                  "Positive interaction coefficient → downtown sq-ft slope is steeper. The single 'sq-ft is worth $X' figure is misleading without the location qualifier.",
              },
              managerial:
                "An interaction term is the formal way of saying 'it depends'. It is often the most actionable term in a model, highlighting segments where a lever works harder.",
              pitfalls: [
                "Dropping a main effect while keeping the interaction (violates the hierarchy principle).",
                "Adding every pairwise interaction; multicollinearity explodes.",
              ],
            },
          ],
        },
        {
          id: "t4-trans",
          kind: "branch",
          title: "Transformations",
          children: [
            {
              id: "t4-trans-log",
              kind: "leaf",
              title: "log(Y) to fix funnel-shaped residuals",
              assumptions: ["Use when residuals fan out as fitted Y grows"],
              clickpath: [
                cp(
                  "Cols ▸ New Column → name 'logY', formula = Log(Y)",
                ),
                cp("Analyze ▸ Fit Model → Y = logY → add predictors → Run"),
                cp(
                  "Re-check Plot Residual by Predicted → spread should be even",
                ),
                cp(
                  "Interpret coefficient: a 1-unit increase in X → roughly 100·b₁ % change in Y (small b₁ approximation)",
                ),
              ],
              example: {
                ...DS.companies,
                response: "Profits ($M)",
                predictors: ["Sales ($M)"],
                question:
                  "Heteroscedastic residuals: does log(Profits) on log(Sales) tighten things up?",
                expected:
                  "Yes. The log-log model is a constant-elasticity model: a 1% change in Sales is associated with a b₁% change in Profits.",
              },
              managerial:
                "Log models talk in elasticities, directly useful for pricing and growth conversations.",
            },
            {
              id: "t4-trans-poly",
              kind: "leaf",
              title: "Polynomial term in MLR",
              clickpath: [
                cp("Analyze ▸ Fit Model"),
                cp("Add the linear effect X to the model"),
                cp(
                  'Highlight X in the columns list and click "Cross" with itself, OR use Macros ▸ Polynomial to Degree',
                ),
                cp("Run → read coefficients on X and X²"),
                cp(
                  "Interpret: marginal effect of X is now b₁ + 2·b₂·X (depends on X)",
                ),
              ],
              example: {
                ...DS.paper,
                response: "strength",
                predictors: ["amount", "amount²"],
                question:
                  "Does adding a quadratic term for amount improve the model for paper strength?",
                expected:
                  "If the quadratic coefficient is significant, there's a diminishing (or accelerating) return to additional pulp amount.",
              },
              managerial:
                "A significant quadratic term means the marginal effect changes across the range of X. Compute the turning point at −b₁ / (2·b₂) to find the optimum.",
            },
          ],
        },
        {
          id: "t4-inf",
          kind: "branch",
          title: "Influential observations",
          children: [
            {
              id: "t4-inf-cook",
              kind: "leaf",
              title: "Cook's D, leverage (hat), studentized residuals",
              clickpath: [
                cp("Analyze ▸ Fit Model → Run"),
                cp(
                  "Red triangle ▸ Save Columns ▸ Cook's D Influence",
                ),
                cp("Red triangle ▸ Save Columns ▸ Hats (leverage)"),
                cp(
                  "Red triangle ▸ Save Columns ▸ Studentized Residuals",
                ),
                cp(
                  "Rules of thumb: Cook's D > 4/n flagged; |Studentized| > 3 unusual; Hat > 2(p+1)/n high leverage",
                ),
                cp(
                  "Red triangle ▸ Row Diagnostics ▸ Plot Cook's D",
                ),
              ],
              example: {
                ...DS.homePrices4,
                response: "Price",
                predictors: ["Living Area", "Bedrooms", "Bathrooms", "Age"],
                question:
                  "Are any houses individually pulling the regression coefficients?",
                expected:
                  "1 to 2 large/old homes typically have Cook's D > 0.1. Re-fit with and without them to gauge sensitivity.",
              },
              managerial:
                "Don't blindly delete. An influential point may be an outlier in the data sense AND a real customer/transaction in the business sense. Investigate, document, decide.",
            },
          ],
        },
      ],
    },

    // ──────────────────────────────────────────── TOPIC 5 ───────────────────────
    {
      id: "t5",
      kind: "topic",
      title: "Topic 5",
      subtitle: "Wrap-up: Influential points, ANOVA, intro Logistic (Week 5)",
      description:
        "Pulling threads together: handle non-constant variance, introduce ANOVA as the natural extension of regression with categorical X, and a glimpse of logistic regression for binary Y.",
      accent: "#ef4444",
      children: [
        {
          id: "t5-ncv",
          kind: "branch",
          title: "Non-constant variance",
          children: [
            {
              id: "t5-ncv-fix",
              kind: "leaf",
              title: "Diagnose & fix heteroscedasticity",
              clickpath: [
                cp("Analyze ▸ Fit Model → Run"),
                cp(
                  "Red triangle ▸ Row Diagnostics ▸ Plot Residual by Predicted → look for funnel",
                ),
                cp(
                  "If funnel: try log(Y), √Y, or a Box-Cox via Red triangle ▸ Factor Profiling ▸ Box-Cox Y Transformation",
                ),
                cp(
                  "Refit and re-check the residual plot; funnel should flatten",
                ),
              ],
              example: {
                ...DS.insulation,
                response: "Heat Loss",
                predictors: ["Insulation Thickness", "Outdoor Temp"],
                question: "Does residual spread grow with predicted heat loss?",
                expected:
                  "Yes. A Box-Cox suggests λ ≈ 0 (log), which flattens the residual plot.",
              },
              managerial:
                "If you forecast individual cases, NCV breaks your prediction intervals. Fix it before quoting any '±X% confidence' to the business.",
            },
          ],
        },
        {
          id: "t5-an",
          kind: "branch",
          title: "ANOVA (intro)",
          children: [
            {
              id: "t5-an-1way",
              kind: "leaf",
              title: "One-way ANOVA via Fit Y by X",
              subtitle: "Continuous Y, categorical X",
              clickpath: [
                cp("Cols ▸ Column Info → make X Nominal"),
                cp("Analyze ▸ Fit Y by X → Y = response, X = the categorical → OK"),
                cp("Red triangle ▸ Means/Anova"),
                cp(
                  "Read the F-test for differences in group means",
                ),
                cp(
                  "Red triangle ▸ Compare Means ▸ All Pairs, Tukey HSD",
                ),
              ],
              example: {
                ...DS.cars,
                response: "MidPrice",
                predictors: ["Type"],
                question: "Do mean prices differ across vehicle Type?",
                expected:
                  "Yes. F-test highly significant; Tukey HSD reveals which Type pairs differ.",
              },
              managerial:
                "ANOVA is just regression with one categorical predictor. The F-test is the same partial F-test you saw in Effect Tests.",
            },
          ],
        },
        {
          id: "t5-log",
          kind: "branch",
          title: "Logistic regression (intro, optional)",
          children: [
            {
              id: "t5-log-bin",
              kind: "leaf",
              title: "Binary Y → Nominal Logistic",
              subtitle: "Introductory; just be familiar with the path",
              clickpath: [
                cp("Cols ▸ Column Info → set the binary Y to Nominal"),
                cp("Analyze ▸ Fit Model → Y = the binary column"),
                cp(
                  'Personality auto-switches to "Nominal Logistic"',
                ),
                cp("Add predictors → Run"),
                cp(
                  "Read: Whole Model Test (overall fit), Parameter Estimates (log-odds), Odds Ratios",
                ),
              ],
              example: {
                ...DS.cars,
                response: "Type (Small vs not-Small, recoded to 0/1)",
                predictors: ["Horsepower", "Weight", "HwyMPG"],
                question:
                  "Which specs predict whether a car is classified as Small?",
                expected:
                  "Weight and HwyMPG meaningfully shift the odds of being Small; coefficients are in log-odds; exponentiate for odds ratios.",
              },
              managerial:
                'Coefficients are log-odds. Interpret as: "a 1-unit change in X multiplies the odds by exp(b₁)".',
            },
          ],
        },
      ],
    },
  ],
};
