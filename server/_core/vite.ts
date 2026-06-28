import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // In development: source tree → dist/public (relative to server/_core/)
  // In production: esbuild outputs server bundle to dist/_core/vite.js,
  //   so import.meta.dirname = dist/_core — go up one level to reach dist/public.
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "..", "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // Vite content-hashes JS/CSS/image filenames at build time (e.g. index-Bx3kLm9a.js).
  // Those assets are safe to cache for 1 year with the immutable directive.
  // HTML must never be cached so users always get the latest app shell.
  app.use(
    express.static(distPath, {
      setHeaders(res, filePath) {
        const isHashed = /\.[a-f0-9]{8,}\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|webp|gif|ico)$/i.test(filePath);
        if (isHashed) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        } else {
          // favicon, robots.txt, manifest, etc. — 1 day
          res.setHeader("Cache-Control", "public, max-age=86400");
        }
      },
    })
  );

  // fall through to index.html if the file doesn't exist.
  // Inject a Link: preload header for the LCP hero image so the browser
  // starts fetching it before the HTML is fully parsed (HTTP Early Hints).
  const HERO_PRELOAD = '<https://d2xsxph8kpxj0f.cloudfront.net/310519663449035187/5G96cC5HiLZMXbLbP234aP/domus-hero-milan-8KAoKuZsmiaC2PDXN6NmGS.webp>; rel=preload; as=image; type="image/webp"';
  app.use("*", (_req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Link", HERO_PRELOAD);
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
