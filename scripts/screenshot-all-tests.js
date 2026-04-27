// Screenshots aller Test-Seiten: Desktop + Mobile, Full-Page
// npx playwright install chromium  (einmalig)
// node scripts/screenshot-all-tests.js

const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const SITE = "https://sitereadyprototype.pages.dev";
const OUT = "/tmp/siteready-screenshots";
fs.mkdirSync(OUT, { recursive: true });

const SITES = [
  "bar-nachtschicht",
  "uno-aperitivo-bar",
  "stahlbau-stockmeister",
  "sevennineseven-kg",
  "friseur-bello-dauerwello",
  "testfirma",
  "radatz-gmbh",
  "checkmate-touring-eu",
  "wagner-it-solutions-eu",
];

(async () => {
  const browser = await chromium.launch();
  for (const sub of SITES) {
    const url = `${SITE}/s/${sub}`;
    for (const view of [
      { name: "desktop", width: 1440, height: 900 },
      { name: "mobile",  width: 390,  height: 844 },
    ]) {
      const ctx = await browser.newContext({ viewport: { width: view.width, height: view.height } });
      const page = await ctx.newPage();
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
        // Kleinen Scroll-Trigger fuer Lazy-Load Bilder
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(1500);
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(500);
        const file = path.join(OUT, `${sub}__${view.name}.png`);
        await page.screenshot({ path: file, fullPage: true });
        console.log(`✓ ${sub} (${view.name}) → ${file}`);
      } catch (e) {
        console.error(`✗ ${sub} (${view.name}):`, e.message);
      }
      await ctx.close();
    }
  }
  await browser.close();
  console.log(`\nOutput: ${OUT}`);
})();
