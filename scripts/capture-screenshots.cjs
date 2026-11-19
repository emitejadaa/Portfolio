#!/usr/bin/env node
/**
 * Captures project previews from the live deploys: a static render of the home page only
 * (first viewport, no scrolling), 1440 × 900 and 390 × 844 for the mobile ones.
 *
 *   npm run screenshots            # everything
 *   npm run screenshots -- liba    # only some slugs
 *
 * Needs Playwright's Chromium and sharp (ships with Next.js). A deploy that answers with
 * an HTTP error is reported and skipped, so a broken page never overwrites a good capture.
 */
const { chromium } = require("playwright");
const sharp = require("sharp");
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
  // NeuroLinked: el deploy da 404; agregarlo cuando vuelva a estar online.
  // { slug: "neurolinked", file: "home", url: "https://neurolinked.vercel.app" },
];

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
      const res = await page.goto(shot.url, { waitUntil: "domcontentloaded", timeout: 120000 });
      if (!res || res.status() >= 400) throw new Error(`HTTP ${res ? res.status() : "sin respuesta"}`);
      await settle(page);
      // Siempre la página inicial, arriba de todo.
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
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

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
