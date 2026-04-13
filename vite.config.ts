import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxyTarget =
    env.VITE_DEV_API_PROXY_TARGET || "http://localhost:5000";
  // SmarterASP "Password Protection" = Basic Auth tầng host; trình duyệt không gửi được qua preflight CORS.
  // Chỉ dùng ở dev: proxy Node gắn Authorization khi gọi upstream. KHÔNG dùng biến VITE_* (tránh lộ ra bundle).
  const devProxyBasicAuth = env.DEV_PROXY_BASIC_AUTH?.trim();

  const apiProxy: Record<string, unknown> = {
    target: apiProxyTarget,
    changeOrigin: true,
  };
  if (devProxyBasicAuth) {
    apiProxy.auth = devProxyBasicAuth;
  }

  return {
    plugins: [
      react(),
      tsconfigPaths(),
      ViteMinifyPlugin({}),
      {
        name: "admin-html-rewrite",
        configureServer(server) {
          server.middlewares.use((req, _res, next) => {
            const url = req.url ?? "";
            const hasFileExt = /\.[a-zA-Z0-9]+($|\?)/.test(url);
            if ((url === "/admin" || url.startsWith("/admin/")) && !hasFileExt) {
              req.url = "/admin.html";
            }
            next();
          });
        },
      },
    ],
    server: {
      proxy: {
        "/api": apiProxy,
      },
    },
  };
});
