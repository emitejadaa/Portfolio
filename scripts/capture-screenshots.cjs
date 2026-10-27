#!/usr/bin/env node
/**
 * Captures project screenshots from the live deploys (doc: "Capturas: salen de los deploys",
 * 1440 × 900 y 390 × 844) and records the game.it tour video.
 *
 *   npm run screenshots            # everything
 *   npm run screenshots -- liba    # only some slugs
 *
 * Needs Playwright's Chromium, sharp (ships with Next.js) and ffmpeg for the video.
 */
const { chromium } = require("playwright");
const sharp = require("sharp");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const OUT = path.join(__dirname, "..", "public", "projects");
const CACHE = path.join(__dirname, ".cache");

const SHOTS = [
  { slug: "freewheel", file: "app", url: "https://freewheel-5a.vercel.app" },
  { slug: "freewheel", file: "landing", url: "https://landing-page-free-wheel.vercel.app" },
  { slug: "freewheel", file: "mobile", url: "https://freewheel-5a.vercel.app", mobile: true },
  { slug: "secure-track", file: "site", url: "https://secure-track.vercel.app" },
  { slug: "pequenos-pasos", file: "home", url: "https://www.xn--pequeospasos-ehb.app" },
  { slug: "pequenos-pasos", file: "mobile", url: "https://www.xn--pequeospasos-ehb.app", mobile: true },
  { slug: "game-it", file: "home", url: "https://game-it-63r9.onrender.com" },
  { slug: "liba", file: "home", url: "https://liba-one.vercel.app" },
  { slug: "csbs-dp", file: "home", url: "https://csbs-form.vercel.app" },
];

// game.it: un video corto recorriendo 3 o 4 juegos.
const GAME_TOUR = {
  base: "https://game-it-63r9.onrender.com",
  stops: ["", "#play/minigolf", "#play/drift", "#play/connect4", "#play/chess", ""],
  dwellMs: 2600,
};

const only = process.argv.slice(2);
const want = (slug) => only.length === 0 || only.includes(slug);

async function toWebp(png, dest, width) {
  await sharp(png).resize({ width, withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toFile(dest);
  const kb = Math.round(fs.statSync(dest).size / 1024);
  console.log(`  ✓ ${path.relative(process.cwd(), dest)} (${kb} KB)`);
}

async function settle(page) {
  await page.waitForLoadState("networkidle", { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2500);
  // Close obvious cookie / consent banners if a site has one.
  for (const label of ["Aceptar", "Accept", "Entendido", "OK"]) {
    const btn = page.getByRole("button", { name: label, exact: true });
    if (await btn.count().catch(() => 0)) await btn.first().click({ timeout: 1000 }).catch(() => {});
  }
}

async function main() {
  fs.mkdirSync(CACHE, { recursive: true });
  const browser = await chromium.launch();

  for (const shot of SHOTS.filter((s) => want(s.slug))) {
    console.log(`${shot.slug}/${shot.file} ← ${shot.url}`);
    const context = await browser.newContext(
      shot.mobile
        ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
        : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
    );
    const page = await context.newPage();
    try {
      await page.goto(shot.url, { waitUntil: "domcontentloaded", timeout: 120000 });
      await settle(page);
      const png = path.join(CACHE, `${shot.slug}-${shot.file}.png`);
      await page.screenshot({ path: png });
      fs.mkdirSync(path.join(OUT, shot.slug), { recursive: true });
      await toWebp(png, path.join(OUT, shot.slug, `${shot.file}.webp`), shot.mobile ? 585 : 1440);
    } catch (err) {
      console.warn(`  ✗ ${shot.slug}/${shot.file}: ${err.message}`);
    } finally {
      await context.close();
    }
  }

  if (want("game-it")) {
    console.log("game-it/tour ← video");
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      recordVideo: { dir: CACHE, size: { width: 1280, height: 800 } },
    });
    const page = await context.newPage();
    const started = Date.now();
    await page.goto(GAME_TOUR.base, { waitUntil: "networkidle", timeout: 120000 });
    const loadedAt = (Date.now() - started) / 1000;
    for (const stop of GAME_TOUR.stops) {
      await page.evaluate((h) => {
        window.location.hash = h;
      }, stop);
      await page.waitForTimeout(GAME_TOUR.dwellMs);
    }
    const video = page.video();
    await context.close();
    const webm = await video.path();
    const mp4 = path.join(OUT, "game-it", "tour.mp4");
    fs.mkdirSync(path.dirname(mp4), { recursive: true });
    execFileSync("ffmpeg", [
      "-y",
      "-loglevel", "error",
      "-ss", String(Math.max(0, loadedAt + 0.6)),
      "-i", webm,
      "-vf", "scale=1280:-2,fps=30",
      "-c:v", "libx264",
      "-preset", "slow",
      "-crf", "30",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      "-an",
      mp4,
    ]);
    console.log(`  ✓ ${path.relative(process.cwd(), mp4)} (${Math.round(fs.statSync(mp4).size / 1024)} KB)`);
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
