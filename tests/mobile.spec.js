// @ts-check
const { test, expect } = require("@playwright/test");

/**
 * Mobile-Tests: iPhone 13 Viewport (390x844)
 * Prüft Responsive Design, Touch-Targets, Lesbarkeit
 */

const mobile = { viewport: { width: 390, height: 844 }, userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)" };
const tablet = { viewport: { width: 810, height: 1080 } };

// ─── iPhone: Landing Page ───────────────────────────────────────────────────
test.describe("Mobile iPhone: Landing Page", () => {
  test.use(mobile);

  test("Hero ist sichtbar und lesbar", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Ihre Website.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Jetzt starten" }).first()).toBeVisible();
  });

  test("CTA-Button ist groß genug zum Tippen (min 44px)", async ({ page }) => {
    await page.goto("/");
    const btn = page.getByRole("button", { name: "Jetzt starten" }).first();
    const box = await btn.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
  });

  test("Pricing-Section ist sichtbar", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await expect(page.getByText(/\/Monat|€.*\/Mo/i).first()).toBeVisible({ timeout: 3000 });
  });

  test("Footer ist vorhanden", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await expect(page.getByText(/SiteReady/i).last()).toBeVisible();
  });
});

// ─── iPhone: Fragebogen ─────────────────────────────────────────────────────
test.describe("Mobile iPhone: Fragebogen", () => {
  test.use(mobile);

  test("Import-Schritt ist bedienbar", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Jetzt starten" }).first().click();
    await expect(page.getByText("Bestehende Präsenz importieren")).toBeVisible({ timeout: 5000 });
    await expect(page.getByPlaceholder(/ihre-website/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Ohne Import starten" })).toBeVisible();
  });

  test("Eingabefelder sind breit genug", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Jetzt starten" }).first().click();
    await page.getByRole("button", { name: "Ohne Import starten" }).click();
    await expect(page.getByPlaceholder("z.B. Elektro Müller GmbH")).toBeVisible({ timeout: 5000 });
    const box = await page.getByPlaceholder("z.B. Elektro Müller GmbH").boundingBox();
    // Mindestens 250px breit auf 390px iPhone
    expect(box.width).toBeGreaterThan(250);
  });

  test("Weiter-Button ist erreichbar", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Jetzt starten" }).first().click();
    await page.getByRole("button", { name: "Ohne Import starten" }).click();
    await page.waitForTimeout(500);
    const btns = page.locator(".q-btn-next").filter({ hasText: /Weiter/ });
    let visible = false;
    for (let i = 0; i < await btns.count(); i++) {
      if (await btns.nth(i).isVisible()) { visible = true; break; }
    }
    expect(visible).toBeTruthy();
  });
});

// ─── iPhone: Portal Login ───────────────────────────────────────────────────
test.describe("Mobile iPhone: Portal Login", () => {
  test.use(mobile);

  test("Login-Formular ist benutzbar", async ({ page }) => {
    await page.goto("/");
    // Auf Mobile: Hamburger-Menü öffnen, dann Portal-Link
    const hamburger = page.locator(".lp-hamburger, [class*='hamburger'], button[aria-label*='Menü']").first();
    if (await hamburger.isVisible({ timeout: 2000 }).catch(() => false)) {
      await hamburger.click();
      await page.waitForTimeout(300);
    }
    await page.getByRole("button", { name: "Kunden-Portal" }).first().click();
    await expect(page.getByRole("heading", { name: "Anmelden" })).toBeVisible({ timeout: 5000 });
    const emailField = page.getByPlaceholder("ihre@email.at");
    await expect(emailField).toBeVisible();
    const box = await emailField.boundingBox();
    expect(box.width).toBeGreaterThan(250);
    expect(box.height).toBeGreaterThanOrEqual(40);
  });
});

// ─── iPad ───────────────────────────────────────────────────────────────────
test.describe("iPad: Layout", () => {
  test.use(tablet);

  test("Landing Page zeigt Hero korrekt", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Ihre Website.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Jetzt starten" }).first()).toBeVisible();
  });

  test("Fragebogen-Felder sind breit genug", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Jetzt starten" }).first().click();
    await page.getByRole("button", { name: "Ohne Import starten" }).click();
    await expect(page.getByPlaceholder("z.B. Elektro Müller GmbH")).toBeVisible({ timeout: 5000 });
    const box = await page.getByPlaceholder("z.B. Elektro Müller GmbH").boundingBox();
    expect(box.width).toBeGreaterThan(350);
  });
});
