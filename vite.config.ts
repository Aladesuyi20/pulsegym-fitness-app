// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Outside Lovable, pick the deploy target from the environment:
//   - Vercel sets VERCEL=1 -> nitro "vercel" preset (writes .vercel/output)
//   - or set NITRO_PRESET explicitly (e.g. "netlify", "node-server", "cloudflare-module")
//   - otherwise (plain local `npm run build`) default to "node-server", so
//     `npm run build && npm run preview` works out of the box on any machine.
//     Without this, the underlying config's own default ("cloudflare-module")
//     produces a Cloudflare Worker bundle that `vite preview` cannot run
//     locally (it looks for a Node server entry that won't exist).
const preset = process.env.NITRO_PRESET ?? (process.env.VERCEL ? "vercel" : "node-server");

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: { preset },
});
