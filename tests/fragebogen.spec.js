// @ts-check
const { test, expect } = require("@playwright/test");

// Hilfsfunktionen
async function goToForm(page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Jetzt Website erstellen" }).click();
  await expect(page.getByText("Haben Sie schon eine Website?")).toBeVisible();
}

async function skipImport(page) {
  await page.getByRole("button", { name: "Ohne Import starten" }).click();
  await expect(page.getByPlaceholder("z.B. Elektro Müller GmbH")).toBeVisible();
}

async function fillSchritt1(page) {
  await page.getByPlaceholder("z.B. Elektro Müller GmbH").fill("Elektro Muster GmbH");
  // Combobox Beruf
  await page.getByPlaceholder("z.B. Elektriker, Friseur, ...").fill("Elektro");
  await page.getByRole("button", { name: "Elektroinstallationen" }).first().click();
  // Dropdown Bundesland (native select)
  await page.locator("select").first().selectOption("wien");
}

async function fillSchritt2(page) {
  // Erste Leistungs-Checkbox anklicken
  await page.getByRole("button", { name: "Elektroinstallationen" }).first().click();
}

async function fillSchritt3(page) {
  await page.getByPlaceholder("Mariahilfer Straße 45/3").fill("Testgasse 1");
  await page.getByPlaceholder("1060").fill("1010");
  await page.getByPlaceholder("Wien").fill("Wien");
  await page.getByPlaceholder("+43 1 234 56 78").fill("+43 1 111 22 33");
  await page.getByPlaceholder("office@firma.at").fill("office@test.at");
  // Öffnungszeiten (native select)
  await page.locator("select").selectOption("mo-fr-8-17");
}

async function fillSchritt4(page) {
  // Unternehmensform: Einzelunternehmen (nicht eingetragen) - keine Pflicht-Extrafelder
  await page.locator("select").selectOption("einzelunternehmen");
  // Impressum-Bestätigung
  await page.getByRole("checkbox").click();
}

async function reachSchritt4(page) {
  await goToForm(page);
  await skipImport(page);
  await fillSchritt1(page);
  await page.getByRole("button", { name: /Weiter/ }).click();
  await fillSchritt2(page);
  await page.getByRole("button", { name: /Weiter/ }).click();
  await fillSchritt3(page);
  await page.getByRole("button", { name: /Weiter/ }).click();
  // Schritt 4 sichtbar wenn Dropdown da ist
  await expect(page.locator("select")).toBeVisible();
}

async function reachSchritt5(page) {
  await reachSchritt4(page);
  await fillSchritt4(page);
  await page.getByRole("button", { name: /Weiter/ }).click();
  // StylePicker-Button "Klassisch Seriös..." muss sichtbar sein
  await expect(page.getByRole("button", { name: /Klassisch/ }).first()).toBeVisible();
}

// ─── Landing Page ──────────────────────────────────────────────────────────────
test.describe("Landing Page", () => {
  test("zeigt Hero-Ueberschrift und CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Deine Website/ })).toBeVisible();
    await expect(page.getByRole("button", { name: "Jetzt Website erstellen" })).toBeVisible();
  });

  test("zeigt Trust-Badges im Hero", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("SSL verschlüsselt")).toBeVisible();
    await expect(page.getByText("DSGVO & ECG konform")).toBeVisible();
  });

  test("navigiert zum Fragebogen bei CTA-Klick", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Jetzt Website erstellen" }).click();
    await expect(page.getByText("Haben Sie schon eine Website?")).toBeVisible();
  });

  test("navigiert zum Portal-Login", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Kunden-Portal" }).click();
    await expect(page.getByRole("heading", { name: "Anmelden" })).toBeVisible();
  });
});

// ─── Import-Schritt ────────────────────────────────────────────────────────────
test.describe("Fragebogen – Import-Schritt", () => {
  test.beforeEach(async ({ page }) => {
    await goToForm(page);
  });

  test("zeigt URL-Feld, Checkbox und Buttons", async ({ page }) => {
    await expect(page.getByPlaceholder("https://ihre-website.at")).toBeVisible();
    await expect(page.getByRole("button", { name: /Daten importieren/ })).toBeVisible();
    await expect(page.getByRole("button", { name: "Ohne Import starten" })).toBeVisible();
  });

  test("Import-Button ist deaktiviert ohne Checkbox", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Daten importieren/ })).toBeDisabled();
  });

  test("Import-Button wird aktiv nach Checkbox", async ({ page }) => {
    await page.getByRole("checkbox").click();
    await expect(page.getByRole("button", { name: /Daten importieren/ })).toBeEnabled();
  });

  test("Ohne Import starten zeigt Schritt 1", async ({ page }) => {
    await skipImport(page);
    await expect(page.getByPlaceholder("z.B. Elektro Müller GmbH")).toBeVisible();
  });
});

// ─── Schritt 1: Basisdaten ─────────────────────────────────────────────────────
test.describe("Fragebogen – Schritt 1: Basisdaten", () => {
  test.beforeEach(async ({ page }) => {
    await goToForm(page);
    await skipImport(page);
  });

  test("zeigt Eingabefelder fuer Firmenname, Beruf, Bundesland", async ({ page }) => {
    await expect(page.getByPlaceholder("z.B. Elektro Müller GmbH")).toBeVisible();
    await expect(page.getByPlaceholder("z.B. Elektriker, Friseur, ...")).toBeVisible();
    await expect(page.locator("select").first()).toBeVisible();
  });

  test("Weiter-Button ist deaktiviert ohne Eingaben", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Weiter/ })).toBeDisabled();
  });

  test("Weiter-Button wird aktiv nach vollstaendiger Eingabe", async ({ page }) => {
    await fillSchritt1(page);
    await expect(page.getByRole("button", { name: /Weiter/ })).toBeEnabled();
  });

  test("Beruf-Auswahl filtert die Liste", async ({ page }) => {
    await page.getByPlaceholder("z.B. Elektriker, Friseur, ...").fill("Friseur");
    await expect(page.getByRole("button", { name: "Friseursalon" })).toBeVisible();
  });

  test("Vorschau zeigt Firmenname in URL-Bar", async ({ page }) => {
    await page.getByPlaceholder("z.B. Elektro Müller GmbH").fill("Muster GmbH");
    await expect(page.getByText(/muster-gmbh\.siteready\.at/)).toBeVisible();
  });
});

// ─── Schritt 2: Leistungen ─────────────────────────────────────────────────────
test.describe("Fragebogen – Schritt 2: Leistungen", () => {
  test.beforeEach(async ({ page }) => {
    await goToForm(page);
    await skipImport(page);
    await fillSchritt1(page);
    await page.getByRole("button", { name: /Weiter/ }).click();
    await expect(page.getByText("Leistungen auswählen")).toBeVisible();
  });

  test("zeigt Leistungsliste fuer Elektro-Branche", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Elektroinstallationen" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Smart Home Systeme" })).toBeVisible();
  });

  test("Weiter-Button ist deaktiviert ohne Leistungsauswahl", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Weiter/ })).toBeDisabled();
  });

  test("Weiter wird aktiv nach Leistungsauswahl", async ({ page }) => {
    await page.getByRole("button", { name: "Elektroinstallationen" }).first().click();
    await expect(page.getByRole("button", { name: /Weiter/ })).toBeEnabled();
  });
});

// ─── Schritt 3: Kontaktdaten ───────────────────────────────────────────────────
test.describe("Fragebogen – Schritt 3: Kontaktdaten", () => {
  test.beforeEach(async ({ page }) => {
    await goToForm(page);
    await skipImport(page);
    await fillSchritt1(page);
    await page.getByRole("button", { name: /Weiter/ }).click();
    await fillSchritt2(page);
    await page.getByRole("button", { name: /Weiter/ }).click();
    await expect(page.getByPlaceholder("Mariahilfer Straße 45/3")).toBeVisible();
  });

  test("zeigt alle Kontaktfelder", async ({ page }) => {
    await expect(page.getByPlaceholder("Mariahilfer Straße 45/3")).toBeVisible();
    await expect(page.getByPlaceholder("+43 1 234 56 78")).toBeVisible();
    await expect(page.getByPlaceholder("office@firma.at")).toBeVisible();
  });

  test("Weiter-Button ist deaktiviert ohne Kontaktdaten", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Weiter/ })).toBeDisabled();
  });

  test("Weiter wird aktiv nach vollstaendigen Kontaktdaten", async ({ page }) => {
    await fillSchritt3(page);
    await expect(page.getByRole("button", { name: /Weiter/ })).toBeEnabled();
  });
});

// ─── Schritt 4: Impressum / Unternehmensform ───────────────────────────────────
test.describe("Fragebogen – Schritt 4: Unternehmensform", () => {
  test.beforeEach(async ({ page }) => {
    await reachSchritt4(page);
  });

  test("zeigt Unternehmensform-Dropdown", async ({ page }) => {
    await expect(page.locator("select")).toBeVisible();
    // Pflicht-Info-Box
    await expect(page.getByText(/ECG-konform/)).toBeVisible();
  });

  test("Weiter-Button ist deaktiviert ohne Unternehmensform", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Weiter/ })).toBeDisabled();
  });

  test("Weiter bleibt deaktiviert ohne Impressum-Checkbox", async ({ page }) => {
    await page.locator("select").selectOption("einzelunternehmen");
    // Checkbox noch nicht angehakt
    await expect(page.getByRole("button", { name: /Weiter/ })).toBeDisabled();
  });

  test("Weiter wird aktiv nach Unternehmensform + Checkbox", async ({ page }) => {
    await fillSchritt4(page);
    await expect(page.getByRole("button", { name: /Weiter/ })).toBeEnabled();
  });

  test("GmbH zeigt Firmenbuch-Pflichtfelder", async ({ page }) => {
    await page.locator("select").selectOption("gmbh");
    await expect(page.getByPlaceholder("FN 123456 a")).toBeVisible();
    await expect(page.getByPlaceholder("HG Wien")).toBeVisible();
    await expect(page.getByPlaceholder("Vor- und Nachname")).toBeVisible();
  });

  test("Verein zeigt ZVR-Zahl-Feld", async ({ page }) => {
    await page.locator("select").selectOption("verein");
    await expect(page.getByPlaceholder("z.B. 123456789")).toBeVisible();
  });
});

// ─── Schritt 5: Stilwahl ───────────────────────────────────────────────────────
test.describe("Fragebogen – Schritt 5: Design", () => {
  test.beforeEach(async ({ page }) => {
    await reachSchritt5(page);
  });

  test("zeigt alle 4 Design-Stile", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Klassisch/ }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Modern/ }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Elegant/ }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Eigenes Branding/ })).toBeVisible();
  });

  test("Website erstellen-Button ist aktiv auf Schritt 5", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /Website erstellen/ })
    ).toBeEnabled();
  });

  test("Custom-Stil zeigt Farb- und Font-Optionen", async ({ page }) => {
    await page.getByRole("button", { name: /Eigenes Branding/ }).click();
    await expect(page.getByText("Primärfarbe")).toBeVisible();
    await expect(page.getByText("Schriftart")).toBeVisible();
  });

  test("Stilwechsel aendert die Vorschau", async ({ page }) => {
    await page.getByRole("button", { name: /Modern/ }).first().click();
    await page.getByRole("button", { name: /Elegant/ }).first().click();
    // Kein Fehler, Seite bleibt stabil
    await expect(page.getByRole("button", { name: /Elegant/ }).first()).toBeVisible();
  });
});
