// @ts-check
// Cross-Browser-Tests: Landing Page, Fragebogen, Portal Login, JS-Fehler
// Läuft mit eigener Config: npx playwright test --config=tests/multi-browser.config.js
// Oder mit Standard-Chromium: npx playwright test tests/multi-browser.spec.js

const { test, expect } = require("@playwright/test");

// ─── Landing Page ────────────────────────────────────────────────────────────

test.describe("Landing Page — Cross-Browser", () => {
  test("Hero-Bereich ist sichtbar", async ({ page }) => {
    await page.goto("/");
    // Hero-Heading prüfen
    const hero = page.locator("h1").first();
    await expect(hero).toBeVisible({ timeout: 10000 });
    await expect(hero).not.toBeEmpty();
  });

  test("CTA 'Jetzt starten' ist sichtbar und klickbar", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByRole("button", { name: "Jetzt starten" }).first();
    await expect(cta).toBeVisible({ timeout: 10000 });
    await expect(cta).toBeEnabled();
  });

  test("Keine JavaScript-Fehler auf der Landing Page", async ({ page }) => {
    const jsErrors = [];
    page.on("pageerror", (error) => {
      jsErrors.push(error.message);
    });

    await page.goto("/");
    // Kurz warten, damit eventuelle asynchrone Fehler auftauchen
    await page.waitForTimeout(2000);

    expect(jsErrors).toEqual([]);
  });
});

// ─── Fragebogen Einstieg ─────────────────────────────────────────────────────

test.describe("Fragebogen — Cross-Browser", () => {
  test("'Ohne Import starten' zeigt Schritt 1 Felder", async ({ page }) => {
    await page.goto("/");
    // Zum Fragebogen navigieren
    await page.getByRole("button", { name: "Jetzt starten" }).first().click();
    await expect(
      page.getByText("Bestehende Präsenz importieren")
    ).toBeVisible({ timeout: 5000 });

    // Import überspringen
    await page.getByRole("button", { name: "Ohne Import starten" }).click();

    // Schritt 1: Firmenname und Branche müssen sichtbar sein
    await expect(
      page.getByPlaceholder("z.B. Elektro Müller GmbH")
    ).toBeVisible({ timeout: 5000 });
    await expect(
      page.getByPlaceholder("z.B. Elektriker, Friseur, ...")
    ).toBeVisible();
  });
});

// ─── Portal Login ────────────────────────────────────────────────────────────

test.describe("Portal Login — Cross-Browser", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Kunden-Portal" }).click();
    await expect(
      page.getByRole("heading", { name: "Anmelden" })
    ).toBeVisible({ timeout: 5000 });
  });

  test("Login-Formular ist sichtbar mit E-Mail und Passwort", async ({
    page,
  }) => {
    await expect(page.getByPlaceholder("ihre@email.at")).toBeVisible();
    await expect(page.getByPlaceholder("Ihr Passwort")).toBeVisible();
    const loginBtn = page.getByRole("button", { name: /Anmelden/ });
    await expect(loginBtn).toBeVisible();
  });

  test("Passwort-Vergessen Link ist sichtbar", async ({ page }) => {
    const link = page.getByText("Passwort vergessen?");
    await expect(link).toBeVisible();
  });
});
