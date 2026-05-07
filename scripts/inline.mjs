// Post-build helper: produces dist/standalone.html with all CSS + JS inlined.
// Drop standalone.html anywhere — Linode, Dropbox, opening it locally — and it just works.
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const DIST = path.resolve("dist");
const ASSETS = path.join(DIST, "assets");

const html = await readFile(path.join(DIST, "index.html"), "utf8");
const files = await readdir(ASSETS);

const cssFile = files.find((f) => f.endsWith(".css"));
const jsFile = files.find((f) => f.endsWith(".js"));

if (!cssFile || !jsFile) {
  console.error("Expected one .css and one .js file under dist/assets/");
  process.exit(1);
}

const css = await readFile(path.join(ASSETS, cssFile), "utf8");
let js = await readFile(path.join(ASSETS, jsFile), "utf8");

// CRITICAL: HTML parser terminates a <script> tag at the first "</script"
// regardless of JavaScript string context. Minified React contains stray
// occurrences (e.g. "</script", "</style") inside warning strings, which
// would prematurely close our inline <script> and render the rest as text.
// Escape them — `<\/script` is byte-identical to `</script` inside any JS
// string literal, and the JS parser is happy.
js = js
  .replace(/<\/script/gi, "<\\/script")
  .replace(/<!--/g, "<\\!--");

// Same defensive escape inside the inlined CSS, just in case.
const safeCss = css
  .replace(/<\/style/gi, "<\\/style")
  .replace(/<!--/g, "<\\!--");

// CRITICAL #2: String.prototype.replace interprets `$&`, `$$`, `$1` etc. in
// the replacement string as backreferences. Minified React contains literal
// "$&/" inside its own regex usage, which would re-inject the matched
// <script> tag back into the output. Always use a function replacement
// when the replacement may contain user/bundle text.
const scriptTag = `<script type="module">${js}</script>`;
const styleTag = `<style>${safeCss}</style>`;

let out = html
  .replace(/\s*<link[^>]*rel="stylesheet"[^>]*>\s*/g, "")
  .replace(/<script[^>]*src="[^"]+\.js"[^>]*><\/script>/, () => scriptTag);

// Inject CSS just before </head>.
out = out.replace("</head>", () => `${styleTag}</head>`);

await writeFile(path.join(DIST, "standalone.html"), out, "utf8");
console.log(
  `wrote dist/standalone.html  (${(out.length / 1024).toFixed(1)} KB)`,
);
