// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/tanstack/vite";

export default defineConfig({
  nitro: {
    preset: "vercel",
    externals: {
      inline: ["tslib"],
    },
    // Impede que o Rollup/esbuild substitua process.env por {} no bundle server.
    // Sem isso, `process.env.GEMINI_API_KEY` pode ser substituído por `undefined`
    // no build, mesmo que a variável exista no runtime da Vercel.
    replace: {
      "process.env": "process.env",
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    envPrefix: ["VITE_", "GEMINI_", "LOVABLE_", "GROQ_", "OPENROUTER_", "SUPABASE_"],
    plugins: [mcpPlugin()],
  },
});
