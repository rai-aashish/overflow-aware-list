import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
    base: process.env.BASE_URL ?? "./",
    plugins: [tailwindcss(), react()],
    resolve: {
        alias: { "@": `${__dirname}src` },
    },
    build: {
        outDir: "dist",
    },
});
