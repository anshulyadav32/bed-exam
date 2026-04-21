import { defineConfig, loadEnv } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || "http://localhost:4000";

  return {
    root: __dirname,
    build: {
      outDir: path.resolve(__dirname, "../dist"),
      emptyOutDir: true
    },
    server: {
      port: 5173,
      proxy: {
        "/api": apiProxyTarget
      }
    }
  };
});
