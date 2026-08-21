import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const defaultSiteOrigin =
  "https://blueberry-valley-tales.littlezhangsan.workers.dev";

export default defineConfig(() => {
  const siteOrigin = (process.env.SITE_ORIGIN ?? defaultSiteOrigin).replace(
    /\/$/,
    "",
  );

  return {
    root: fileURLToPath(new URL("./vercel", import.meta.url)),
    publicDir: fileURLToPath(new URL("./public", import.meta.url)),
    plugins: [
      react(),
      {
        name: "site-origin",
        transformIndexHtml(html) {
          return html.replaceAll("%SITE_ORIGIN%", siteOrigin);
        },
      },
    ],
    build: {
      outDir: fileURLToPath(new URL("./dist-vercel", import.meta.url)),
      emptyOutDir: true,
    },
  };
});
