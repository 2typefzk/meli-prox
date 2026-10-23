import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// Protótipo navegável das telas da página "Screens" do Figma (Meli Case).
export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: "./",
  plugins: [react()],
  server: { port: 5199, fs: { allow: [fileURLToPath(new URL("../..", import.meta.url))] } },
  build: { outDir: "../prototype-dist", emptyOutDir: true },
});
