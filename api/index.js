// Vercel serverless function — runs TanStack Start SSR
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = join(__dirname, "..");
const CLIENT_DIR = join(root, "dist/client");

const MIME_TYPES = {
  js: "application/javascript",
  css: "text/css",
  html: "text/html",
  png: "image/png",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  json: "application/json",
  map: "application/json",
};

export default async function handler(req, res) {
  try {
    const host = req.headers.host || "localhost:3000";
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const fullUrl = `${protocol}://${host}${req.url}`;
    const url = new URL(fullUrl);
    const pathname = url.pathname;

    // Serve static files from dist/client
    if (pathname.startsWith("/assets/") || pathname === "/favicon.png") {
      const filePath = join(CLIENT_DIR, pathname);
      if (existsSync(filePath)) {
        const ext = pathname.split(".").pop();
        res.setHeader("Content-Type", MIME_TYPES[ext] || "application/octet-stream");
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        return res.end(readFileSync(filePath));
      }
    }

    // Load SSR handler
    const ssrPath = join(root, "dist/server/server.js");
    if (!existsSync(ssrPath)) {
      return res.status(500).end("SSR handler not found");
    }

    const server = await import(ssrPath);
    const app = server.default || server;

    // Build standard Request object for the SSR handler
    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (v) headers.set(k, Array.isArray(v) ? v.join(", ") : v);
    }

    let body = null;
    if (req.method !== "GET" && req.method !== "HEAD") {
      body = await new Promise((resolve) => {
        let data = "";
        req.on("data", (c) => (data += c));
        req.on("end", () => resolve(data || null));
      });
    }

    const request = new Request(url, {
      method: req.method,
      headers,
      body,
    });

    const response = await app.fetch(request);
    res.status(response.status);
    response.headers.forEach((v, k) => res.setHeader(k, v));
    return res.end(await response.text());
  } catch (e) {
    console.error("SSR Error:", e);
    if (!res.headersSent) {
      res.status(500).end(`Error: ${e.message}`);
    }
  }
}