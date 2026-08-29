#!/usr/bin/env node
/*
 * Regenerates the faceplate screenshots used by the product pages.
 *
 * The synths are shipped into static/products/<slug>/web/ by their own deploy
 * scripts; this drives each web build in a headless browser and writes a PNG
 * into the matching content bundle, where the product templates pick it up as
 * content/products/<slug>/faceplate*.png.
 *
 *   npm i puppeteer          # once, not committed — the site has no build deps
 *   node scripts/capture-faceplates.mjs
 *
 * The web builds need cross-origin isolation (SharedArrayBuffer), so this
 * serves them over a local server that sets COOP/COEP, mirroring static/_headers.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 8899;

/* Each target: where the web build lives, where the PNG goes, any panel to click
 * first (matched on the button's visible text), and whether to frame the
 * faceplate itself or the overlay that click opened. */
const TARGETS = [
  { slug: 'vxn-1b', out: 'faceplate.png' },
  { slug: 'vxn-1b', out: 'faceplate-fx.png', click: 'fx / global' },
  { slug: 'vxn-2', out: 'faceplate.png' },
  { slug: 'vxn-2', out: 'faceplate-matrix.png', click: 'mod matrix', shoot: 'overlay' },
];

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.wasm': 'application/wasm', '.json': 'application/json', '.bin': 'application/octet-stream',
  '.css': 'text/css', '.png': 'image/png',
};

function serve(dir) {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(dir, rel);
    if (!file.startsWith(dir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Resource-Policy': 'same-origin',
    });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(PORT, '127.0.0.1', () => resolve(server)));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let puppeteer;
try {
  puppeteer = (await import(process.env.PUPPETEER_MODULE ?? 'puppeteer')).default;
} catch {
  console.error('puppeteer is not installed. Run: npm i puppeteer');
  process.exit(1);
}

const server = await serve(path.join(root, 'static', 'products'));
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] });

for (const t of TARGETS) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1700, height: t.shoot === 'overlay' ? 1800 : 1300, deviceScaleFactor: 2 });
  await page.goto(`http://127.0.0.1:${PORT}/${t.slug}/web/index.html`, { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(6000);

  /* Dismiss the splash the web builds show on load. */
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('button, a')) {
      if (el.textContent.trim().toLowerCase() === 'close') el.click();
    }
  });
  await sleep(1500);

  if (t.click) {
    await page.evaluate((label) => {
      for (const el of document.querySelectorAll('button, [role=tab], .tab')) {
        if (el.textContent.trim().toLowerCase().replace(/\s+/g, ' ').startsWith(label)) {
          el.click();
          return;
        }
      }
    }, t.click);
    await sleep(2500);
  }

  if (t.shoot === 'overlay') {
    /* Overlay slot lists are fixed-height scrollers; let them size to all their
     * rows so the still shows the whole matrix rather than the first screenful. */
    await page.evaluate(() => {
      for (const el of document.querySelectorAll('.mm-overlay-list, .overlay-panel')) {
        el.style.setProperty('height', 'auto', 'important');
        el.style.setProperty('max-height', 'none', 'important');
        el.style.setProperty('overflow', 'visible', 'important');
      }
    });
    await sleep(600);
  }

  /* Crop to the drawn extent of the faceplate: the root element is taller than
   * its panels, and the on-screen keyboard sits at the bottom of the viewport.
   * Overlay shots crop to the open panel instead. */
  const box = t.shoot === 'overlay' ? await page.evaluate(() => {
    const open = [...document.querySelectorAll('.overlay-backdrop')]
      .filter((b) => b.getBoundingClientRect().width > 0);
    const panel = open.length ? [...open[0].children].find((c) => c.getBoundingClientRect().width > 0) : null;
    if (!panel) return null;
    const r = panel.getBoundingClientRect();
    const pad = 20;
    return {
      x: Math.max(0, r.x - pad), y: Math.max(0, r.y - pad),
      w: Math.min(r.width + pad * 2, window.innerWidth),
      h: Math.min(r.height + pad * 2, window.innerHeight),
    };
  }) : await page.evaluate(() => {
    const rootEl = document.querySelector('.vxn-faceplate, #faceplate, .faceplate');
    const r = rootEl.getBoundingClientRect();
    let bottom = r.top, right = r.left;
    const walk = (n) => {
      for (const c of n.children) {
        const b = c.getBoundingClientRect();
        if (b.width > 0 && b.height > 0 && b.height < 1200 && getComputedStyle(c).visibility !== 'hidden') {
          bottom = Math.max(bottom, b.bottom);
          right = Math.max(right, b.right);
        }
        walk(c);
      }
    };
    walk(rootEl);
    return {
      x: r.left, y: r.top,
      w: Math.min(right - r.left, window.innerWidth - r.left),
      h: Math.min(bottom - r.top, window.innerHeight - r.top),
    };
  });

  if (!box) {
    console.error(`skipped ${t.slug}/${t.out}: nothing to frame`);
    await page.close();
    continue;
  }

  const dest = path.join(root, 'content', 'products', t.slug, t.out);
  await page.screenshot({ path: dest, clip: { x: box.x, y: box.y, width: Math.ceil(box.w), height: Math.ceil(box.h) } });
  console.log(`wrote ${path.relative(root, dest)} (${Math.ceil(box.w)}x${Math.ceil(box.h)} @2x)`);
  await page.close();
}

await browser.close();
server.close();
