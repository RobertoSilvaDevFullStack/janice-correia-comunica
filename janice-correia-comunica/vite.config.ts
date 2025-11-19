import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080, // ← Força usar a porta 8080
  },
  plugins: [react()],
  build: {
    cssMinify: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          ui: [
            "@radix-ui/react-accordion",
            "@radix-ui/react-dialog",
            "@radix-ui/react-select",
            "@radix-ui/react-toast"
          ],
          tiptap: ["@tiptap/react", "@tiptap/starter-kit", "@tiptap/extension-link", "@tiptap/extension-image"],
          data: ["axios", "@tanstack/react-query"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
