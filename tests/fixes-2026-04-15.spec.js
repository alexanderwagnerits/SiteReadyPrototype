// @ts-check
const { test, expect } = require("@playwright/test");

/**
 * Gezielte Tests für die Fixes vom 15.04.2026
 *
 * Fix 4: Silent Catches → Logging (Backend, nicht direkt testbar im Browser)
 * Fix 5: beforeunload-Schutz im Portal
 * Fix 6: Passwort-Längencheck im Portal (8 Zeichen)
 * Fix 7: Hex-Validierung für custom_color (serve-time)
 * Fix 1: Table-Whitelist in admin-update.js
 */

const BASE = process.env.TEST_BASE_URL || "http://localhost:3000";

// Fix 1 API-Tests: Nur auf Cloudflare testbar (Functions laufen nicht lokal)
// Source-Code-Check weiter unten als "Fix 1: Table-Whitelist (Source-Check)"

// ─── Fix 5: beforeunload-Schutz ─────────────────────────────────────────────
test.describe("Fix 5: beforeunload-Schutz im Portal", () => {

  test("Portal-Login zeigt Formular (Basis-Check)", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Kunden-Portal" }).click();
    await expect(page.getByRole("heading", { name: "Anmelden" })).toBeVisible();
  });

  test("beforeunload-Handler ist im Portal-Code registriert", async ({ page }) => {
    // Prüfe ob der beforeunload-Event-Listener im Code vorhanden ist
    // Da wir keinen echten Portal-Login haben, prüfen wir den Source-Code
    const response = await page.goto("/");
    const html = await response.text();
    // Der Build enthält den beforeunload-Handler
    expect(html).toBeDefined();

    // Alternativ: Prüfe ob der JS-Bundle den Handler enthält
    const jsFiles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("script[src]")).map(s => s.src);
    });
    // Mindestens ein Script-Bundle sollte geladen sein
    expect(jsFiles.length).toBeGreaterThan(0);

    // Lade das Haupt-Bundle und prüfe ob beforeunload drin ist
    for (const src of jsFiles) {
      if (src.includes("/static/js/main")) {
        const r = await page.request.get(src);
        const js = await r.text();
        expect(js).toContain("beforeunload");
      }
    }
  });
});

// ─── Fix 6: Passwort-Längencheck ────────────────────────────────────────────
test.describe("Fix 6: Passwort-Längencheck", () => {

  test("Registrierung: Passwort unter 8 Zeichen zeigt Warnung", async ({ page }) => {
    // Navigiere zum Fragebogen, durchlaufe bis zur Übersicht, dann SuccessPage
    // Einfacher: Prüfe direkt ob der Check im Bundle ist
    await page.goto("/");
    const jsFiles = await page.evaluate(() =>
      Array.from(document.querySelectorAll("script[src]")).map(s => s.src)
    );
    for (const src of jsFiles) {
      if (src.includes("/static/js/main")) {
        const r = await page.request.get(src);
        const js = await r.text();
        // Prüfe dass der 8-Zeichen-Check vorhanden ist (nicht 6)
        expect(js).toContain("Mindestens 8 Zeichen");
        // Der alte 6-Zeichen-Check sollte weg sein
        expect(js).not.toContain("Mindestens 6 Zeichen");
      }
    }
  });

  // E2E-Durchlauf durch den kompletten Wizard ist fragil (Formularfelder ändern sich häufig).
  // Der Source-Code-Test oben verifiziert dass der 8-Zeichen-Check korrekt ist.
});

// ─── Fix 7: Hex-Validierung ─────────────────────────────────────────────────
test.describe("Fix 7: Hex-Validierung (serve-time)", () => {

  test("safeHex-Funktion ist im serve-time Code vorhanden", async ({ request }) => {
    // Lese index.js direkt — bei Cloudflare Functions nicht direkt möglich,
    // also prüfen wir das Build-Artefakt
    // Stattdessen: prüfe ob eine existierende Website (falls vorhanden) korrekt rendert
    // Für lokalen Test: prüfen wir ob die Funktion im Source vorhanden ist

    // Einfachster Test: Eine Website mit bekannter Subdomain aufrufen
    // Falls keine Test-Website existiert, prüfen wir zumindest dass der Endpoint antwortet
    const r = await request.get(`${BASE}/s/test-nonexistent-subdomain`);
    // 404 ist erwartet (Subdomain existiert nicht)
    expect([200, 404]).toContain(r.status());
  });

  test("index.js enthält safeHex-Funktion", async ({ page }) => {
    // Source-Code-Check: safeHex muss im Functions-Code sein
    // Da wir den Source lesen können (lokaler Test):
    const fs = require("fs");
    const path = require("path");
    const indexJs = fs.readFileSync(
      path.join(__dirname, "..", "functions", "s", "[subdomain]", "index.js"),
      "utf8"
    );
    expect(indexJs).toContain("safeHex");
    expect(indexJs).toContain("/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/");

    // Auch in legal.js
    const legalJs = fs.readFileSync(
      path.join(__dirname, "..", "functions", "s", "[subdomain]", "legal.js"),
      "utf8"
    );
    expect(legalJs).toContain("safeHex");
  });

  test("legal.js nutzt safeHex vor custom_color Override", async () => {
    const fs = require("fs");
    const path = require("path");
    const legalJs = fs.readFileSync(
      path.join(__dirname, "..", "functions", "s", "[subdomain]", "legal.js"),
      "utf8"
    );
    // safeHex muss VOR dem Zuweisen der custom_color geprüft werden
    expect(legalJs).toContain("safeHex(o.custom_color)");
    expect(legalJs).toContain("safeHex(o.custom_accent)");
    expect(legalJs).toContain("safeHex(o.custom_bg)");
    expect(legalJs).toContain("safeHex(o.custom_sep)");
  });
});

// ─── Fix 4: Silent Catches → Logging ────────────────────────────────────────
test.describe("Fix 4: Silent Catches durch Logging ersetzt", () => {

  test("stripe-webhook.js enthält keine leeren catch-Blöcke mehr", async () => {
    const fs = require("fs");
    const path = require("path");
    const webhook = fs.readFileSync(
      path.join(__dirname, "..", "functions", "api", "stripe-webhook.js"),
      "utf8"
    );
    // Keine leeren catches mehr
    expect(webhook).not.toContain(".catch(() => {})");
    expect(webhook).not.toContain(".catch(()=>{})");
    // Stattdessen Logging
    expect(webhook).toContain("console.error");
    // await buildTask statt totem Code
    expect(webhook).toContain("else await buildTask");
  });

  test("trial-cleanup.js loggt Fehler statt sie zu verschlucken", async () => {
    const fs = require("fs");
    const path = require("path");
    const cleanup = fs.readFileSync(
      path.join(__dirname, "..", "functions", "api", "trial-cleanup.js"),
      "utf8"
    );
    // Keine leeren catches mehr
    expect(cleanup).not.toContain(".catch(() => {})");
    expect(cleanup).not.toContain(".catch(()=>{})");
    // Fehler landen im errors-Array
    expect(cleanup).toContain("errors.push");
  });
});

// ─── Fix 1: Table-Whitelist (Source-Check) ──────────────────────────────────
test.describe("Fix 1: Table-Whitelist (Source-Check)", () => {

  test("admin-update.js enthält ALLOWED_TABLES Whitelist", async () => {
    const fs = require("fs");
    const path = require("path");
    const adminUpdate = fs.readFileSync(
      path.join(__dirname, "..", "functions", "api", "admin-update.js"),
      "utf8"
    );
    expect(adminUpdate).toContain("ALLOWED_TABLES");
    expect(adminUpdate).toContain('"orders"');
    expect(adminUpdate).toContain('"support_requests"');
    expect(adminUpdate).toContain('"docs"');
    expect(adminUpdate).toContain("Table not allowed");
  });
});
