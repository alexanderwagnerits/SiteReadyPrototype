// @ts-check
const { test, expect } = require("@playwright/test");

// ─── Admin Dashboard Basis-Tests ─────────────────────────────────────────────
// Laeuft gegen localhost:3000

test.describe("Admin Zugangsschutz", () => {
  test("Admin ohne Key zeigt kein Dashboard", async ({ page }) => {
    await page.goto("/admin");

    // Seite sollte nicht crashen (kein Error-Overlay)
    await page.waitForTimeout(2000);

    // Es darf KEIN Admin-Dashboard sichtbar sein ohne Key
    // Typische Admin-Elemente die NICHT sichtbar sein duerfen
    const dashboardVisible = await page.locator("text=Dashboard").isVisible().catch(() => false);
    const ordersVisible = await page.locator("text=Bestellungen").isVisible().catch(() => false);
    const docsVisible = await page.locator("text=Dokumentation").isVisible().catch(() => false);

    // Mindestens sicherstellen, dass nicht alle Admin-Inhalte frei sichtbar sind
    const allVisible = dashboardVisible && ordersVisible && docsVisible;
    expect(allVisible, "Admin-Dashboard darf ohne Key nicht vollstaendig sichtbar sein").toBe(false);
  });

  test("App crasht nicht bei /admin Aufruf", async ({ page }) => {
    // Kein unbehandelter Fehler soll auftreten
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));

    const response = await page.goto("/admin");

    // Seite muss laden (kein 500er)
    expect(response.status()).toBeLessThan(500);

    // Kurz warten um JS-Fehler abzufangen
    await page.waitForTimeout(2000);

    // Keine kritischen JS-Fehler
    const criticalErrors = errors.filter(
      (e) => !e.includes("ResizeObserver") && !e.includes("Non-Error promise rejection")
    );
    expect(criticalErrors, "Keine kritischen JS-Fehler auf /admin").toHaveLength(0);
  });

  test("Admin-Code ist im Bundle (Strings pruefen)", async ({ page }) => {
    // Seite laden damit JS-Bundles geladen werden
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Alle geladenen Script-URLs sammeln
    const scripts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("script[src]")).map(
        (s) => /** @type {HTMLScriptElement} */ (s).src
      );
    });

    // Mindestens ein JS-Bundle sollte vorhanden sein
    expect(scripts.length, "Mindestens ein Script-Bundle muss geladen sein").toBeGreaterThan(0);

    // Pruefen ob "admin" in irgendeinem Bundle vorkommt
    let adminFound = false;
    for (const src of scripts) {
      try {
        const response = await page.request.get(src);
        if (response.ok()) {
          const text = await response.text();
          if (text.toLowerCase().includes("admin")) {
            adminFound = true;
            break;
          }
        }
      } catch {
        // Script konnte nicht geladen werden — weiter
      }
    }

    expect(adminFound, "Admin-Code sollte im JS-Bundle enthalten sein").toBe(true);
  });
});
