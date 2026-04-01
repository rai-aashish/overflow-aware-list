import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Set BASE_URL env var to your repo name when deploying to GitHub Pages,
// e.g. BASE_URL=/overflow-aware-list/ in the Actions workflow.
export default defineConfig({
    base: process.env.BASE_URL ?? "./",
    plugins: [tailwindcss(), svelte()],
    resolve: {
        alias: { "@": `${__dirname}src` },
    },
    build: {
        outDir: "dist",
    },
});
