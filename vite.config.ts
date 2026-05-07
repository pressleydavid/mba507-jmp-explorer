import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Single-file build keeps deploy to Linode trivial:
//   npm run build  →  dist/index.html (all JS/CSS inlined)
// Then scp dist/ to your server's web root.
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    assetsInlineLimit: 1024 * 1024, // inline everything we can
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
