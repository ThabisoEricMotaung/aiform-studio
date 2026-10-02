// Renders compositions/manifesto-short to renders/ (BRAND.md §7, §11).
//   node compositions/manifesto-short/render.mjs            → renders/aiform-manifesto-short-vertical-v2.mp4
//   node compositions/manifesto-short/render.mjs --stills 3 7 13.5  → PNG stills only
// Needs playwright-core (not a site dependency: `npm i --no-save playwright-core`
// or set NODE_PATH), a Chromium build (CHROME_PATH, else the newest ms-playwright one) and ffmpeg.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Loaded through createRequire so NODE_PATH works (ESM imports ignore it).
const { chromium } = createRequire(import.meta.url)("playwright-core");
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROOT = path.resolve(__dirname, "../..");
const PAGE = "/compositions/manifesto-short/index.html";
const OUT = path.join(ROOT, "renders", "aiform-manifesto-short-vertical-v2.mp4");
const FPS = 30, DURATION = 15;
const TYPES = { ".html": "text/html; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" };

function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const dir = path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), ".cache"), "ms-playwright");
  const builds = fs.readdirSync(dir).filter((d) => /^chromium-\d+$/.test(d)).sort((a, b) => b.split("-")[1] - a.split("-")[1]);
  return path.join(dir, builds[0], "chrome-win64", "chrome.exe");
}

(async () => {
  const stillsAt = process.argv.includes("--stills") ? process.argv.slice(process.argv.indexOf("--stills") + 1).map(Number) : null;
  const server = http.createServer((req, res) => {
    const file = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
    if (!file.startsWith(ROOT)) return res.writeHead(403).end();
    fs.readFile(file, (err, data) => {
      if (err) return res.writeHead(404).end();
      res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" }).end(data);
    });
  }).listen(0);
  const browser = await chromium.launch({ executablePath: chromePath() });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const missing = [];
  page.on("response", (r) => r.status() >= 400 && missing.push(r.url()));
  await page.goto(`http://localhost:${server.address().port}${PAGE}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const fonts = await page.evaluate(() => ["400 108px Fraunces", '400 34px "Public Sans"'].map((f) => document.fonts.check(f)));
  if (missing.length || fonts.includes(false)) throw new Error(`Missing assets: ${missing.join(", ") || "fonts not loaded"}`);

  const frames = fs.mkdtempSync(path.join(os.tmpdir(), "aiform-frames-"));
  const times = stillsAt || Array.from({ length: FPS * DURATION }, (_, i) => i / FPS);
  for (const [i, t] of times.entries()) {
    await page.evaluate((s) => window.renderAt(s), t);
    const name = stillsAt ? `still-${t.toFixed(2)}s.png` : `f${String(i).padStart(4, "0")}.png`;
    await page.screenshot({ path: path.join(stillsAt ? path.join(ROOT, "renders") : frames, name) });
  }
  await browser.close();
  server.close();

  if (!stillsAt) {
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", String(FPS), "-i", path.join(frames, "f%04d.png"),
      "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "16", "-movflags", "+faststart", OUT], { stdio: "inherit" });
    console.log(`Rendered ${path.relative(ROOT, OUT)}`);
  }
  fs.rmSync(frames, { recursive: true, force: true });
})().catch((err) => { console.error(err.message); process.exit(1); });
