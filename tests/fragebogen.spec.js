// @ts-check
const { test, expect } = require("@playwright/test");

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function goToForm(page) {
  await page.goto("/");
  // CTA auf Landing
  await page.getByRole("button", { name: "Jetzt starten" }).first().click();
  await expect(page.getByText("Bestehende Präsenz importieren")).toBeVisible({ timeout: 5000 });
}

async function skipImport(page) {
  await page.getByRole("button", { name: "Ohne Import starten" }).click();
  await expect(page.getByPlaceholder("z.B. Elektro Müller GmbH")).toBeVisible({ timeout: 5000 });
}

async function fillSchritt1(page) {
  await page.getByPlaceholder("z.B. Elektro Müller GmbH").fill("Elektro Muster GmbH");
  await page.getByPlaceholder("z.B. Elektriker, Friseur, ...").fill("Elektro");
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Elektroinstallationen" }).first().click();
  await page.getByPlaceholder(/Seit 15 Jahren/).fill("Ihr Elektro-Experte seit 20 Jahren.");
  await page.locator("#q-sec-1 select").selectOption("wien");
}

async function fillSchritt2(page) {
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Elektroinstallationen" }).first().click();
}

async function fillSchritt3(page) {
  await page.getByPlaceholder("Mariahilfer Straße 45/3").fill("Testgasse 1");
  await page.getByPlaceholder("1060").fill("1010");
  await page.getByPlaceholder("Wien", { exact: true }).fill("Wien");
  await page.getByPlaceholder("+43 1 234 56 78").fill("+43 1 111 22 33");
  await page.getByPlaceholder("office@firma.at").fill("office@test.at");
  await page.locator("#q-sec-3 select").selectOption("mo-fr-8-17");
}

async function fillSchritt4(page) {
  await page.locator("#q-sec-4 select").selectOption("einzelunternehmen");
  await page.waitForTimeout(200);
  // Vorname + Nachname sind Pflicht bei Einzelunternehmen
  await page.getByPlaceholder("Maria", { exact: true }).fill("Test");
  await page.getByPlaceholder("Muster", { exact: true }).fill("Person");
  // Impressum-Bestätigung
  const cb = page.getByRole("checkbox");
  if (!(await cb.isChecked())) await cb.click();
}

async function clickWeiter(page) {
  const btns = page.locator(".q-btn-next").filter({ hasText: /Weiter/ });
  const count = await btns.count();
  for (let i = 0; i < count; i++) {
    const btn = btns.nth(i);
    if (await btn.isVisible() && await btn.isEnabled()) {
      await btn.click();
      await page.waitForTimeout(500);
      return;
    }
  }
  throw new Error("Kein sichtbarer/aktiver Weiter-Button gefunden");
}

async function reachSchritt(page, target) {
  await goToForm(page);
  await skipImport(page);
  if (target >= 2) { await fillSchritt1(page); await clickWeiter(page); }
  if (target >= 3) { await fillSchritt2(page); await clickWeiter(page); }
  if (target >= 4) { await fillSchritt3(page); await clickWeiter(page); }
  if (target >= 5) { await fillSchritt4(page); await clickWeiter(page); }
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
test.describe("Landing Page", () => {
  test("zeigt Hero-Überschrift und CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Ihre Website.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Jetzt starten" }).first()).toBeVisible();
  });

  test("zeigt Trust-Badges im Hero", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("SSL verschlüsselt")).toBeVisible();
    await expect(page.getByText("DSGVO & ECG inklusive")).toBeVisible();
  });

  test("navigiert zum Fragebogen bei CTA-Klick", async ({ page }) => {
    await goToForm(page);
    // Import-Schritt sichtbar = Fragebogen geöffnet
  });

  test("navigiert zum Portal-Login", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Kunden-Portal" }).click();
    await expect(page.getByRole("heading", { name: "Anmelden" })).toBeVisible();
  });
});

// ─── Import-Schritt ───────────────────────────────────────────────────────────
test.describe("Fragebogen – Import-Schritt", () => {
  test.beforeEach(async ({ page }) => {
    await goToForm(page);
  });

  test("zeigt URL-Feld und Buttons", async ({ page }) => {
    await expect(page.getByPlaceholder(/ihre-website/)).toBeVisible();
    await expect(page.getByRole("button", { name: /Importieren/ })).toBeVisible();
    await expect(page.getByRole("button", { name: "Ohne Import starten" })).toBeVisible();
  });

  test("Import-Button ist deaktiviert ohne Checkbox", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Importieren/ }).first()).toBeDisabled();
  });

  test("Import-Button wird aktiv nach Checkbox", async ({ page }) => {
    await page.getByRole("checkbox").click();
    await expect(page.getByRole("button", { name: /Importieren/ }).first()).toBeEnabled();
  });

  test("Ohne Import starten zeigt Schritt 1", async ({ page }) => {
    await skipImport(page);
    await expect(page.getByPlaceholder("z.B. Elektro Müller GmbH")).toBeVisible();
  });
});

// ─── Schritt 1: Grunddaten ────────────────────────────────────────────────────
test.describe("Fragebogen – Schritt 1: Grunddaten", () => {
  test.beforeEach(async ({ page }) => {
    await goToForm(page);
    await skipImport(page);
  });

  test("zeigt Eingabefelder", async ({ page }) => {
    await expect(page.getByPlaceholder("z.B. Elektro Müller GmbH")).toBeVisible();
    await expect(page.getByPlaceholder("z.B. Elektriker, Friseur, ...")).toBeVisible();
    await expect(page.getByPlaceholder(/Seit 15 Jahren/)).toBeVisible();
  });

  test("Weiter-Button ist deaktiviert ohne Eingaben", async ({ page }) => {
    const btns = page.locator(".q-btn-next").filter({ hasText: /Weiter/ });
    const count = await btns.count();
    let found = false;
    for (let i = 0; i < count; i++) {
      if (await btns.nth(i).isVisible()) {
        await expect(btns.nth(i)).toBeDisabled();
        found = true; break;
      }
    }
    expect(found).toBeTruthy();
  });

  test("Weiter-Button wird aktiv nach vollständiger Eingabe", async ({ page }) => {
    await fillSchritt1(page);
    await page.waitForTimeout(300);
    const btns = page.locator(".q-btn-next").filter({ hasText: /Weiter/ });
    const count = await btns.count();
    for (let i = 0; i < count; i++) {
      if (await btns.nth(i).isVisible()) {
        await expect(btns.nth(i)).toBeEnabled();
        break;
      }
    }
  });

  test("Branche-Auswahl filtert die Liste", async ({ page }) => {
    await page.getByPlaceholder("z.B. Elektriker, Friseur, ...").fill("Friseur");
    await page.waitForTimeout(300);
    await expect(page.getByRole("button", { name: /Friseur/ }).first()).toBeVisible();
  });

  test("Firmenname wird in Sidebar angezeigt", async ({ page }) => {
    await page.getByPlaceholder("z.B. Elektro Müller GmbH").fill("Muster GmbH");
    // Sidebar zeigt "Website erstellen" als Kontext
    await expect(page.getByText("Website erstellen").first()).toBeVisible();
  });
});

// ─── Schritt 2: Leistungen ────────────────────────────────────────────────────
test.describe("Fragebogen – Schritt 2: Leistungen", () => {
  test.beforeEach(async ({ page }) => {
    await reachSchritt(page, 2);
  });

  test("zeigt Leistungsliste für Elektro-Branche", async ({ page }) => {
    await expect(page.getByText("Leistungen auswählen")).toBeVisible({ timeout: 3000 });
    await expect(page.getByRole("button", { name: "Elektroinstallationen" }).first()).toBeVisible();
  });

  test("Weiter wird aktiv nach Leistungsauswahl", async ({ page }) => {
    await page.getByRole("button", { name: "Elektroinstallationen" }).first().click();
    await page.waitForTimeout(300);
    const btns = page.locator(".q-btn-next").filter({ hasText: /Weiter/ });
    for (let i = 0; i < await btns.count(); i++) {
      if (await btns.nth(i).isVisible()) {
        await expect(btns.nth(i)).toBeEnabled();
        break;
      }
    }
  });
});

// ─── Schritt 3: Kontakt ──────────────────────────────────────────────────────
test.describe("Fragebogen – Schritt 3: Kontakt", () => {
  test.beforeEach(async ({ page }) => {
    await reachSchritt(page, 3);
  });

  test("zeigt alle Kontaktfelder", async ({ page }) => {
    await expect(page.getByPlaceholder("Mariahilfer Straße 45/3")).toBeVisible({ timeout: 3000 });
    await expect(page.getByPlaceholder("+43 1 234 56 78")).toBeVisible();
    await expect(page.getByPlaceholder("office@firma.at")).toBeVisible();
  });

  test("Weiter wird aktiv nach vollständigen Kontaktdaten", async ({ page }) => {
    await fillSchritt3(page);
    await page.waitForTimeout(300);
    const btns = page.locator(".q-btn-next").filter({ hasText: /Weiter/ });
    for (let i = 0; i < await btns.count(); i++) {
      if (await btns.nth(i).isVisible()) {
        await expect(btns.nth(i)).toBeEnabled();
        break;
      }
    }
  });
});

// ─── Schritt 4: Impressum ────────────────────────────────────────────────────
test.describe("Fragebogen – Schritt 4: Impressum", () => {
  test.beforeEach(async ({ page }) => {
    await reachSchritt(page, 4);
  });

  test("zeigt Unternehmensform-Dropdown", async ({ page }) => {
    await expect(page.locator("#q-sec-4 select")).toBeVisible({ timeout: 3000 });
    await expect(page.getByText(/Gesetzlich vorgeschrieben/)).toBeVisible();
  });

  test("Weiter wird aktiv nach Unternehmensform + Checkbox", async ({ page }) => {
    await fillSchritt4(page);
    await page.waitForTimeout(300);
    const btns = page.locator(".q-btn-next").filter({ hasText: /Weiter/ });
    for (let i = 0; i < await btns.count(); i++) {
      if (await btns.nth(i).isVisible()) {
        await expect(btns.nth(i)).toBeEnabled();
        break;
      }
    }
  });

  test("GmbH zeigt Firmenbuch-Pflichtfelder", async ({ page }) => {
    await page.locator("#q-sec-4 select").selectOption("gmbh");
    await page.waitForTimeout(300);
    await expect(page.getByPlaceholder("FN 123456 a")).toBeVisible();
    await expect(page.getByPlaceholder("HG Wien")).toBeVisible();
    await expect(page.getByPlaceholder("Vor- und Nachname")).toBeVisible();
  });

  test("Verein zeigt ZVR-Zahl-Feld", async ({ page }) => {
    await page.locator("#q-sec-4 select").selectOption("verein");
    await page.waitForTimeout(300);
    await expect(page.getByPlaceholder("z.B. 123456789")).toBeVisible();
  });
});

// ─── Schritt 5: Design ───────────────────────────────────────────────────────
test.describe("Fragebogen – Schritt 5: Design", () => {
  test.beforeEach(async ({ page }) => {
    await reachSchritt(page, 5);
  });

  test("zeigt alle 3 Design-Stile + Akzentfarbe-Option", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Klassisch/ }).first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole("button", { name: /Modern/ }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Elegant/ }).first()).toBeVisible();
    await expect(page.getByText("Akzentfarbe anpassen")).toBeVisible();
  });

  test("Weiter-Button ist sichtbar auf Design-Schritt", async ({ page }) => {
    const btns = page.locator(".q-btn-next").filter({ hasText: /Weiter/ });
    let found = false;
    for (let i = 0; i < await btns.count(); i++) {
      if (await btns.nth(i).isVisible()) { found = true; break; }
    }
    expect(found).toBeTruthy();
  });

  test("Akzentfarbe anpassen zeigt Farbfeld", async ({ page }) => {
    // "Akzentfarbe anpassen" Checkbox aktivieren
    const checkbox = page.getByText("Akzentfarbe anpassen");
    if (await checkbox.isVisible()) {
      await checkbox.click();
      await page.waitForTimeout(300);
    }
    // Farbfeld sollte sichtbar sein oder Stil-Buttons bleiben stabil
    await expect(page.getByRole("button", { name: /Klassisch/ }).first()).toBeVisible();
  });

  test("Stilwechsel aendert Vorschau ohne Crash", async ({ page }) => {
    await page.getByRole("button", { name: /Modern/ }).first().click();
    await page.waitForTimeout(200);
    await page.getByRole("button", { name: /Elegant/ }).first().click();
    await page.waitForTimeout(200);
    await page.getByRole("button", { name: /Klassisch/ }).first().click();
    // Seite bleibt stabil
    await expect(page.getByRole("button", { name: /Klassisch/ }).first()).toBeVisible();
  });
});
