// @ts-check
const { test, expect } = require("@playwright/test");

// ─── Produktion-Tests gegen die deployed Seite ──────────────────────────────
// Diese Tests laufen gegen die echte Cloudflare Pages URL, nicht localhost.

const BASE = "https://sitereadyprototype.pages.dev";
const SUPABASE_URL = "https://brulvtqeazkgcxkimdve.supabase.co/rest/v1";
const SUPABASE_KEY = "sb_publishable_u1yaQuqOp0qNhJHdiOU7Tw_hzTr0-MG";

test.describe("Landing Page", () => {
  test("Seite laedt erfolgreich (Status 200, enthaelt SiteReady)", async ({ page }) => {
    const response = await page.goto(BASE);
    expect(response.status()).toBe(200);
    await expect(page.locator("body")).toContainText("SiteReady");
  });

  test("robots.txt ist erreichbar", async ({ request }) => {
    const response = await request.get(BASE + "/robots.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    const valid = body.includes("Sitemap") || body.includes("User-agent");
    expect(valid).toBeTruthy();
  });
});

test.describe("Fragebogen", () => {
  test("Fragebogen oeffnet ueber CTA", async ({ page }) => {
    await page.goto(BASE);
    await page.getByRole("button", { name: "Jetzt starten" }).first().click();
    await expect(page.getByText("Bestehende Präsenz importieren")).toBeVisible({
      timeout: 10000,
    });
  });
});

test.describe("Portal Login", () => {
  test("Login-Seite ist erreichbar", async ({ page }) => {
    await page.goto(BASE + "/portal");
    await expect(page.getByRole("heading", { name: "Anmelden" })).toBeVisible({
      timeout: 10000,
    });
  });
});

test.describe("API", () => {
  test("ext-status mit ungueltigem Key gibt 401", async ({ request }) => {
    const response = await request.get(BASE + "/api/ext-status?key=INVALID");
    expect(response.status()).toBe(401);
  });
});

test.describe("Kunden-Websites", () => {
  /** @type {Array<{subdomain: string, status: string, stil: string}>} */
  let orders = [];

  test.beforeAll(async ({ request }) => {
    // Subdomains aus Supabase laden
    try {
      const response = await request.get(
        SUPABASE_URL + "/orders?select=subdomain,status,stil&status=in.(trial,live)&limit=5",
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: "Bearer " + SUPABASE_KEY,
          },
        }
      );
      if (response.ok()) {
        orders = await response.json();
      }
    } catch (e) {
      console.warn("Supabase-Abfrage fehlgeschlagen:", e.message);
    }
  });

  test("Mindestens eine Kunden-Website existiert", () => {
    expect(orders.length).toBeGreaterThan(0);
  });

  test("Kunden-Websites rendern korrekt", async ({ request }) => {
    test.skip(orders.length === 0, "Keine Subdomains gefunden");

    for (const order of orders) {
      const url = BASE + "/s/" + order.subdomain;

      // Hauptseite pruefen
      const response = await request.get(url);
      expect(response.status(), `${order.subdomain}: Status 200`).toBe(200);

      const html = await response.text();

      // Keine offenen Placeholder
      expect(html, `${order.subdomain}: Keine {{ Placeholder`).not.toContain("{{");

      // Vollstaendiges HTML
      expect(html, `${order.subdomain}: Enthaelt </html>`).toContain("</html>");

      // noindex fuer Prototyp
      expect(html.toLowerCase(), `${order.subdomain}: noindex vorhanden`).toContain("noindex");
    }
  });

  test("Impressum ist erreichbar", async ({ request }) => {
    test.skip(orders.length === 0, "Keine Subdomains gefunden");

    for (const order of orders) {
      const response = await request.get(BASE + "/s/" + order.subdomain + "/impressum");
      expect(response.status(), `${order.subdomain}/impressum: Status 200`).toBe(200);

      const html = await response.text();
      expect(html, `${order.subdomain}/impressum: Enthaelt Impressum`).toContain("Impressum");
    }
  });

  test("Datenschutz ist erreichbar", async ({ request }) => {
    test.skip(orders.length === 0, "Keine Subdomains gefunden");

    for (const order of orders) {
      const response = await request.get(BASE + "/s/" + order.subdomain + "/datenschutz");
      expect(response.status(), `${order.subdomain}/datenschutz: Status 200`).toBe(200);

      const html = await response.text();
      const valid = html.includes("Datenschutz") || html.includes("DSGVO");
      expect(valid, `${order.subdomain}/datenschutz: Enthaelt Datenschutz/DSGVO`).toBeTruthy();
    }
  });
});
