import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), ViteMinifyPlugin({})],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
