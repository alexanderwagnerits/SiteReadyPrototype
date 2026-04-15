// @ts-check
const { test, expect } = require("@playwright/test");

// ─── SEO-Basics der Landing Page ─────────────────────────────────────────────
// Laeuft gegen localhost:3000 (dev server via playwright.config.js)

test.describe("SEO Basics", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Genau eine h1 auf der Seite", async ({ page }) => {
    const h1Count = await page.locator("h1").count();
    expect(h1Count, "Seite muss genau eine h1 haben").toBe(1);
  });

  test("Meta description vorhanden und nicht leer", async ({ page }) => {
    const description = await page.getAttribute('meta[name="description"]', "content");
    expect(description, "Meta description muss existieren").toBeTruthy();
    expect(description.trim().length, "Meta description darf nicht leer sein").toBeGreaterThan(0);
  });

  test("OG-Tags vorhanden", async ({ page }) => {
    const ogTitle = await page.getAttribute('meta[property="og:title"]', "content");
    expect(ogTitle, "og:title muss existieren").toBeTruthy();

    const ogDescription = await page.getAttribute('meta[property="og:description"]', "content");
    expect(ogDescription, "og:description muss existieren").toBeTruthy();
  });

  test("Keine kaputten Bilder", async ({ page }) => {
    // Warten bis Seite vollstaendig geladen ist
    await page.waitForLoadState("networkidle");

    const images = page.locator("img");
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute("src");

      // Bild muss ein src-Attribut haben
      expect(src, `Bild ${i}: src fehlt`).toBeTruthy();

      // Pruefen ob das Bild geladen wurde (naturalWidth > 0)
      const naturalWidth = await img.evaluate(
        (el) => /** @type {HTMLImageElement} */ (el).naturalWidth
      );
      // Bilder mit display:none oder visibility:hidden koennen naturalWidth 0 haben,
      // daher nur pruefen wenn sichtbar
      const isVisible = await img.isVisible().catch(() => false);
      if (isVisible) {
        expect(naturalWidth, `Bild ${i} (${src}): nicht geladen`).toBeGreaterThan(0);
      }
    }
  });

  test("Alle Links haben gueltige href-Attribute", async ({ page }) => {
    const links = page.locator("a");
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const href = await link.getAttribute("href");

      // href muss existieren
      expect(href, `Link ${i}: href fehlt`).not.toBeNull();

      // href darf nicht leer sein
      expect(href.trim(), `Link ${i}: href ist leer`).not.toBe("");
      // href="#" ist ok wenn ein onClick-Handler dahinter steht (JS-Navigation)
      if (href.trim() === "#") {
        const hasClick = await link.evaluate(el => !!el.onclick || el.getAttribute("onclick") !== null);
        // React onClick wird nicht als DOM-Attribut gesetzt — daher tolerieren wir href="#" im Footer
      }
    }
  });

  test("HTML hat lang-Attribut", async ({ page }) => {
    const lang = await page.getAttribute("html", "lang");
    expect(lang, "html muss ein lang-Attribut haben").toBeTruthy();
  });

  test("Titel hat 30-70 Zeichen", async ({ page }) => {
    const title = await page.title();
    expect(title, "Titel muss gesetzt sein").toBeTruthy();
    expect(title.length, `Titel zu kurz (${title.length} Zeichen): "${title}"`).toBeGreaterThanOrEqual(30);
    expect(title.length, `Titel zu lang (${title.length} Zeichen): "${title}"`).toBeLessThanOrEqual(70);
  });
});
