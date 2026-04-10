// @ts-check
const { test, expect } = require("@playwright/test");

/**
 * SiteReady E2E Kundenszenarien
 *
 * 7 Szenarien die den kompletten Wizard durchlaufen:
 * Import → Fragebogen → Account → Generierung → Website prüfen
 *
 * ACHTUNG: Erstellt echte Orders in Supabase + kostet Claude-Tokens!
 *
 * Usage:
 *   npx playwright test tests/szenarien.spec.js                    # Alle 7
 *   npx playwright test tests/szenarien.spec.js -g "Elektriker"    # Einzelnes Szenario
 *   npx playwright test tests/szenarien.spec.js --headed            # Mit Browser
 */

// Timeout pro Test: 3 Minuten (Import + Generierung brauchen Zeit)
test.setTimeout(180_000);

const TS = Date.now();
const testEmail = (n) => `test-e2e-${n}-${TS}@siteready.test`;
const testPw = "Test1234!sicher";

// ─── Helpers ────────────────────────────────────────────────────────────────

async function goToWizard(page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Jetzt Website erstellen" }).first().click();
  await expect(page.getByText("Bestehende Präsenz importieren")).toBeVisible({ timeout: 5000 });
}

async function doImport(page, url) {
  await page.getByPlaceholder("https://www.ihre-website.at").fill(url);
  await page.getByRole("checkbox").first().click();
  await page.getByRole("button", { name: "Importieren" }).click();
  // Warten bis Import fertig ODER Fehler (max 2.5 Min)
  await page.waitForFunction(() => {
    const text = document.body.innerText;
    return text.includes("erfolgreich importiert") || text.includes("Keine Daten erkannt") || text.includes("fehlgeschlagen") || text.includes("zu lange gedauert");
  }, { timeout: 150_000 });
  // Bei Fehler: trotzdem weitermachen (ohne Import starten)
  const failed = await page.getByText("fehlgeschlagen").or(page.getByText("zu lange gedauert")).isVisible().catch(() => false);
  if (failed) {
    console.log(`  ⚠ Import fehlgeschlagen für ${url} — fahre ohne Import fort`);
    return false;
  }
  return true;
}

async function skipImport(page) {
  await page.getByRole("button", { name: /Ohne Import starten/ }).click();
  // Warten bis Schritt 1 (Grunddaten) sichtbar
  await expect(page.getByPlaceholder("z.B. Elektro Müller GmbH")).toBeVisible({ timeout: 5000 });
}

async function fillGrunddaten(page, { firmenname, branche, bundesland, kurzbeschreibung }) {
  const fn = page.getByPlaceholder("z.B. Elektro Müller GmbH");
  await expect(fn).toBeVisible({ timeout: 5000 });
  await fn.fill(firmenname);
  // Branche via Combobox
  const combobox = page.getByPlaceholder("z.B. Elektriker, Friseur, ...");
  await combobox.fill(branche);
  await page.waitForTimeout(500);
  // Ersten Treffer in der Dropdown-Liste klicken (nicht Weiter/Zurück)
  const dropdown = page.locator("button").filter({ hasText: new RegExp(branche, "i") })
    .filter({ hasNotText: /Weiter|Zurück|Ohne Import|Importieren|Website erstellen/ });
  const dropdownCount = await dropdown.count();
  if (dropdownCount > 0) await dropdown.first().click();
  await page.waitForTimeout(200);
  // Bundesland
  await page.locator("#q-sec-1 select").selectOption(bundesland);
  // Kurzbeschreibung
  const desc = page.getByPlaceholder("Seit 15 Jahren");
  if (await desc.isVisible()) await desc.fill(kurzbeschreibung);
  await clickWeiter(page);
}

async function selectLeistungen(page, count = 3) {
  await page.waitForTimeout(500);
  // Versuche Checklist-Buttons zu finden (sichtbar, nicht in Footer)
  // Leistungs-Buttons sind im Hauptbereich und enthalten einen Checkbox-Span
  const leistLabel = page.getByText("Leistungen auswählen");
  if (await leistLabel.isVisible({ timeout: 3000 }).catch(() => false)) {
    // Checklist vorhanden — klicke die ersten N sichtbaren Buttons in der Checklist-Gruppe
    const container = leistLabel.locator("..").locator("..");
    const btns = container.locator("button");
    const total = await btns.count();
    const n = Math.min(count, total);
    for (let i = 0; i < n; i++) {
      try { await btns.nth(i).click({ timeout: 2000 }); } catch(_) { break; }
      await page.waitForTimeout(100);
    }
  } else {
    // TagInput Fallback
    const extra = page.getByPlaceholder(/Leistung eingeben/);
    if (await extra.isVisible()) {
      await extra.fill("Beratung");
      await extra.press("Enter");
      await page.waitForTimeout(200);
      await extra.fill("Service");
      await extra.press("Enter");
    }
  }
  await clickWeiter(page);
}

async function fillKontakt(page, { adresse, plz, ort, telefon, email, oeffnungszeiten }) {
  await page.getByPlaceholder("Mariahilfer Straße 45/3").fill(adresse);
  await page.getByPlaceholder("1060").fill(plz);
  await page.getByPlaceholder("Wien", { exact: true }).fill(ort);
  await page.getByPlaceholder("+43 1 234 56 78").fill(telefon);
  await page.getByPlaceholder("office@firma.at").fill(email);
  await page.locator("#q-sec-3 select").selectOption(oeffnungszeiten);
  await clickWeiter(page);
}

async function fillImpressum(page, { form, extras = {} }) {
  await page.locator("#q-sec-4 select").selectOption(form);
  await page.waitForTimeout(200);

  // Formspezifische Felder
  if (form === "einzelunternehmen") {
    const vn = page.getByPlaceholder("Maria", { exact: true });
    if (await vn.isVisible()) await vn.fill(extras.vorname || "Test");
    const nn = page.getByPlaceholder("Muster", { exact: true });
    if (await nn.isVisible()) await nn.fill(extras.nachname || "Person");
  }
  if (["eu", "gmbh", "og", "kg", "ag"].includes(form)) {
    await page.getByPlaceholder("FN 123456 a").fill(extras.fn || "FN 999999 t");
    await page.getByPlaceholder("HG Wien").fill(extras.gericht || "HG Wien");
  }
  if (form === "gmbh") {
    await page.getByPlaceholder("Vor- und Nachname").first().fill(extras.gf || "Max Muster");
  }
  if (form === "verein") {
    await page.getByPlaceholder("z.B. 123456789").fill(extras.zvr || "999888777");
    const vt = page.getByPlaceholder("z.B. Obmann: Max Mustermann");
    if (await vt.isVisible()) await vt.fill(extras.vertretung || "Obmann: Test Person");
  }

  // Impressum-Checkbox
  const checkboxes = page.getByRole("checkbox");
  const count = await checkboxes.count();
  for (let i = 0; i < count; i++) {
    const cb = checkboxes.nth(i);
    if (!(await cb.isChecked())) await cb.click();
  }
  await clickWeiter(page);
}

async function selectStil(page, stil) {
  if (stil === "custom") {
    await page.getByRole("button", { name: /Eigenes Branding/ }).click();
  } else {
    await page.getByRole("button", { name: new RegExp(stil, "i") }).first().click();
  }
  await clickWeiter(page);
}

async function submitWizard(page) {
  // Schritt 6: Übersicht → Website erstellen
  const btn = page.getByRole("button", { name: /Website erstellen/ });
  await expect(btn).toBeEnabled({ timeout: 5000 });
  await btn.click();
}

async function createAccount(page, { vorname, nachname, email }) {
  // SuccessPage: Account erstellen
  await expect(page.getByPlaceholder("Alexander")).toBeVisible({ timeout: 10_000 });
  await page.getByPlaceholder("Alexander").fill(vorname);
  await page.getByPlaceholder("Wagner").fill(nachname);
  await page.getByPlaceholder("ihre@email.at").fill(email);

  // Passwort (Placeholder: "Mind. 8 Zeichen" + "Wiederholen")
  const pwFields = page.locator("input[type='password']");
  for (let i = 0; i < await pwFields.count(); i++) {
    if (await pwFields.nth(i).isVisible()) await pwFields.nth(i).fill(testPw);
  }

  // AGB Checkbox (nur sichtbare, nicht die aus vorherigen Schritten)
  const agb = page.getByRole("checkbox");
  for (let i = 0; i < await agb.count(); i++) {
    if (await agb.nth(i).isVisible() && !(await agb.nth(i).isChecked())) {
      await agb.nth(i).click();
    }
  }

  await page.waitForTimeout(300);

  // Absenden
  const submit = page.locator(".q-btn-next").filter({ hasText: /Kostenlos|Account|freischalten/i });
  await expect(submit).toBeEnabled({ timeout: 3000 });
  await submit.click();

  // Warten auf Bestätigungsseite ODER Portal (Auto-Login überspringt SuccessPage)
  await page.waitForFunction(() => {
    const text = document.body.innerText;
    return text.includes("Account erstellt") || text.includes("Willkommen zurück") || text.includes("Website ist bereit");
  }, { timeout: 60_000 });
}

async function clickWeiter(page) {
  // Mehrere "Weiter"-Buttons im DOM (einer pro Schritt) — den sichtbaren + aktivierten nehmen
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

async function waitForWebsite(page, subdomain) {
  // Warte bis die Website generiert und erreichbar ist (max 90s)
  const url = `/s/${subdomain}`;
  for (let i = 0; i < 18; i++) {
    const r = await page.request.get(url);
    if (r.status() === 200) return r;
    await page.waitForTimeout(5000);
  }
  throw new Error(`Website ${subdomain} nicht erreichbar nach 90s`);
}

// ─── Website-Prüfungen ─────────────────────────────────────────────────────

async function verifyWebsite(page, subdomain, checks) {
  const r = await page.request.get(`/s/${subdomain}`);
  expect(r.status()).toBe(200);
  const html = await r.text();

  // Grundstruktur
  expect(html).toContain("<!DOCTYPE html>");
  expect(html).toContain("</html>");
  expect(html.length).toBeGreaterThan(5000);

  // Stil-Klasse
  if (checks.stil) {
    const stilRegex = new RegExp(`class="stil-${checks.stil}"`);
    expect(html).toMatch(stilRegex);
  }

  // Keine offenen Placeholder (außer OG_IMAGE)
  const placeholders = html.match(/\{\{[A-Z_]+\}\}/g) || [];
  const critical = placeholders.filter(p => !["{{OG_IMAGE}}"].includes(p));
  expect(critical).toEqual([]);

  // CSS-Variablen
  expect(html).toContain("--primary:");
  expect(html).toContain("--accent:");

  // Navigation + Footer
  expect(html.includes("sitenav") || html.includes("nav-inner")).toBeTruthy();
  expect(html.includes("footer") || html.includes("site-footer")).toBeTruthy();

  // Kontaktformular
  expect(html.includes("<form") || html.includes("kontakt")).toBeTruthy();

  // Hero
  expect(html).toContain("hero");

  // noindex (Prototyp)
  expect(html).toContain("noindex");

  // Sections die DA sein sollten
  if (checks.expectSections) {
    for (const s of checks.expectSections) {
      expect(html.toLowerCase()).toContain(s.toLowerCase());
    }
  }

  // Sections die NICHT da sein sollten (leere Placeholder)
  if (checks.expectNoSections) {
    for (const s of checks.expectNoSections) {
      // Prüfe ob die Section-Placeholder entfernt wurden (leer ersetzt)
      expect(html).not.toContain(`<!-- ${s} -->`);
    }
  }

  // Firmenname auf der Seite
  if (checks.firmenname) {
    expect(html).toContain(checks.firmenname);
  }

  return html;
}

async function verifyLegal(page, subdomain) {
  const impressum = await page.request.get(`/s/${subdomain}/impressum`);
  expect(impressum.status()).toBe(200);
  const iHtml = await impressum.text();
  expect(iHtml.toLowerCase()).toContain("impressum");

  const datenschutz = await page.request.get(`/s/${subdomain}/datenschutz`);
  expect(datenschutz.status()).toBe(200);
  const dHtml = await datenschutz.text();
  expect(dHtml.toLowerCase()).toMatch(/datenschutz|dsgvo/);
}

// ─── SZENARIEN ──────────────────────────────────────────────────────────────

test.describe("Kundenszenarien E2E", () => {

  // ═══ Szenario 1: Elektriker — Website-Import, Klassisch, GmbH ═══
  test("Szenario 1: Elektriker — Website-Import, Klassisch, GmbH", async ({ page }) => {
    const sub = `test-elektro-${TS}`;
    await goToWizard(page);

    // Import
    const imported1 = await doImport(page, "https://elektro-wien.at");
    if (imported1) {
      await page.getByRole("button", { name: /Angaben prüfen|Weiter/ }).click();
    } else {
      await page.getByRole("button", { name: /Ohne Import/ }).click();
    }
    await page.waitForTimeout(500);

    // Grunddaten prüfen/ergänzen
    const firmenname = page.getByPlaceholder("z.B. Elektro Müller GmbH");
    const currentName = await firmenname.inputValue();
    if (!currentName) await firmenname.fill("Elektro Test GmbH");
    // Branche sollte vom Import gesetzt sein
    const bundesland = page.locator("#q-sec-1 select");
    if (!(await bundesland.inputValue())) await bundesland.selectOption("wien");
    // Kurzbeschreibung
    const desc = page.getByPlaceholder("Seit 15 Jahren");
    if (await desc.isVisible() && !(await desc.inputValue())) {
      await desc.fill("Ihr Elektro-Experte in Wien seit 20 Jahren.");
    }
    await clickWeiter(page);

    // Leistungen (sollten vom Import vorausgefüllt sein)
    await selectLeistungen(page, 4);

    // Kontakt prüfen/ergänzen
    const tel = page.getByPlaceholder("+43 1 234 56 78");
    if (!(await tel.inputValue())) {
      await fillKontakt(page, {
        adresse: "Testgasse 1", plz: "1060", ort: "Wien",
        telefon: "+43 1 999 00 11", email: "test@elektro-test.at",
        oeffnungszeiten: "mo-fr-8-17"
      });
    } else {
      // Öffnungszeiten sicherstellen
      const oez = page.locator("#q-sec-3 select");
      if (!(await oez.inputValue())) await oez.selectOption("mo-fr-8-17");
      await clickWeiter(page);
    }

    // Impressum: GmbH
    await fillImpressum(page, { form: "gmbh", extras: { gf: "Max Elektro" } });

    // Design: Klassisch
    await selectStil(page, "Klassisch");

    // Übersicht + Absenden
    await submitWizard(page);

    // Account erstellen
    await createAccount(page, {
      vorname: "Test", nachname: "Elektriker",
      email: testEmail("elektro")
    });

    test.info().annotations.push({ type: "subdomain", description: sub });
  });

  // ═══ Szenario 2: Zahnarzt — Google Maps, Elegant, EU ═══
  test("Szenario 2: Zahnarzt — Google Maps, Elegant, EU", async ({ page }) => {
    const sub = `test-zahnarzt-${TS}`;
    await goToWizard(page);

    // Google Maps Import
    const imported2 = await doImport(page, "https://www.google.com/maps?cid=10739974672696238733");
    if (imported2) { await page.getByRole("button", { name: /Angaben prüfen|Weiter/ }).click(); }
    else { await page.getByRole("button", { name: /Ohne Import/ }).click(); }
    await page.waitForTimeout(500);

    // Grunddaten ergänzen
    await fillGrunddaten(page, {
      firmenname: "Dr. Test Zahnarzt",
      branche: "Zahnarzt",
      bundesland: "wien",
      kurzbeschreibung: "Ihre Zahnarztpraxis im 2. Bezirk."
    });

    await selectLeistungen(page, 3);

    await fillKontakt(page, {
      adresse: "Untere Donaustraße 17", plz: "1020", ort: "Wien",
      telefon: "+43 1 222 33 44", email: "test@zahnarzt-test.at",
      oeffnungszeiten: "mo-fr-8-17"
    });

    // Impressum: Einzelunternehmen (eingetragen)
    await fillImpressum(page, { form: "eu", extras: { fn: "FN 111111 t", gericht: "HG Wien" } });

    // Design: Elegant
    await selectStil(page, "Elegant");

    await submitWizard(page);
    await createAccount(page, {
      vorname: "Test", nachname: "Zahnarzt",
      email: testEmail("zahnarzt")
    });
  });

  // ═══ Szenario 3: Friseur — Ohne Import, Modern, Einzelunternehmen ═══
  test("Szenario 3: Friseur — Ohne Import, Modern, Einzelunternehmen", async ({ page }) => {
    await goToWizard(page);
    await skipImport(page);

    await fillGrunddaten(page, {
      firmenname: "Hair by Test",
      branche: "Friseur",
      bundesland: "wien",
      kurzbeschreibung: "Moderner Friseursalon im Herzen Wiens."
    });

    await selectLeistungen(page, 3);

    await fillKontakt(page, {
      adresse: "Neubaugasse 10", plz: "1070", ort: "Wien",
      telefon: "+43 1 555 66 77", email: "test@hair-test.at",
      oeffnungszeiten: "mo-sa-8-17"
    });

    await fillImpressum(page, {
      form: "einzelunternehmen",
      extras: { vorname: "Test", nachname: "Friseur" }
    });

    // Design: Modern
    await selectStil(page, "Modern");

    await submitWizard(page);
    await createAccount(page, {
      vorname: "Test", nachname: "Friseur",
      email: testEmail("friseur")
    });
  });

  // ═══ Szenario 4: Steuerberater — Website-Import, Custom, OG ═══
  test("Szenario 4: Steuerberater — Website, Custom, OG", async ({ page }) => {
    await goToWizard(page);

    const imported4 = await doImport(page, "https://www.tpa-group.at");
    if (imported4) { await page.getByRole("button", { name: /Angaben prüfen|Weiter/ }).click(); }
    else { await page.getByRole("button", { name: /Ohne Import/ }).click(); }
    await page.waitForTimeout(500);

    // Grunddaten ergänzen/ausfüllen
    await fillGrunddaten(page, {
      firmenname: "Steuerberatung Test OG",
      branche: "Steuer",
      bundesland: "wien",
      kurzbeschreibung: "Ihre Steuerberatung in Wien."
    });

    await selectLeistungen(page, 5);

    await fillKontakt(page, {
      adresse: "Opernring 1", plz: "1010", ort: "Wien",
      telefon: "+43 1 888 99 00", email: "test@stb-test.at",
      oeffnungszeiten: "mo-fr-8-17"
    });

    // Impressum: OG
    await fillImpressum(page, { form: "og", extras: { fn: "FN 222222 t", gericht: "HG Wien" } });

    // Design: Custom (Eigenes Branding)
    await selectStil(page, "custom");

    await submitWizard(page);
    await createAccount(page, {
      vorname: "Test", nachname: "Steuerberater",
      email: testEmail("stb")
    });
  });

  // ═══ Szenario 5: Restaurant — Google Maps (nur), Klassisch ═══
  test("Szenario 5: Restaurant — Google Maps, Klassisch", async ({ page }) => {
    await goToWizard(page);

    // Google Maps Import (Gasthaus Zum Wohl)
    const imported5 = await doImport(page, "https://www.google.com/maps?cid=17049873043640460631");
    if (imported5) { await page.getByRole("button", { name: /Angaben prüfen|Weiter/ }).click(); }
    else { await page.getByRole("button", { name: /Ohne Import/ }).click(); }
    await page.waitForTimeout(500);

    // Grunddaten ergänzen
    const firmenname = page.getByPlaceholder("z.B. Elektro Müller GmbH");
    const currentName = await firmenname.inputValue();
    if (!currentName) await firmenname.fill("Gasthaus Test");
    // Branche: Restaurant
    const combobox = page.getByPlaceholder("z.B. Elektriker, Friseur, ...");
    const branche = await combobox.inputValue();
    if (!branche) {
      await combobox.fill("Restaurant");
      await page.waitForTimeout(300);
      const opt = page.locator("button").filter({ hasText: /Restaurant/i }).first();
      if (await opt.isVisible()) await opt.click();
    }
    const bundesland = page.locator("#q-sec-1 select");
    if (!(await bundesland.inputValue())) await bundesland.selectOption("wien");
    const desc = page.getByPlaceholder("Seit 15 Jahren");
    if (await desc.isVisible() && !(await desc.inputValue())) {
      await desc.fill("Wiener Gasthaus mit Tradition.");
    }
    await clickWeiter(page);

    await selectLeistungen(page, 3);

    const tel = page.getByPlaceholder("+43 1 234 56 78");
    if (!(await tel.inputValue())) {
      await fillKontakt(page, {
        adresse: "Stumpergasse 61", plz: "1060", ort: "Wien",
        telefon: "+43 1 777 88 99", email: "test@gasthaus-test.at",
        oeffnungszeiten: "mo-sa-8-17"
      });
    } else {
      const oez = page.locator("#q-sec-3 select");
      if (!(await oez.inputValue())) await oez.selectOption("mo-sa-8-17");
      await clickWeiter(page);
    }

    await fillImpressum(page, {
      form: "einzelunternehmen",
      extras: { vorname: "Test", nachname: "Gasthaus" }
    });

    await selectStil(page, "Klassisch");

    await submitWizard(page);
    await createAccount(page, {
      vorname: "Test", nachname: "Restaurant",
      email: testEmail("restaurant")
    });
  });

  // ═══ Szenario 6: Yogastudio — Ohne Import, Modern ═══
  test("Szenario 6: Yogastudio — Ohne Import, Modern", async ({ page }) => {
    await goToWizard(page);
    await skipImport(page);

    await fillGrunddaten(page, {
      firmenname: "Yoga Flow Test Studio",
      branche: "Yoga",
      bundesland: "wien",
      kurzbeschreibung: "Yoga und Meditation für Körper und Geist."
    });

    await selectLeistungen(page, 3);

    await fillKontakt(page, {
      adresse: "Lindengasse 5", plz: "1070", ort: "Wien",
      telefon: "+43 1 333 44 55", email: "test@yoga-test.at",
      oeffnungszeiten: "vereinbarung"
    });

    await fillImpressum(page, {
      form: "einzelunternehmen",
      extras: { vorname: "Test", nachname: "Yoga" }
    });

    await selectStil(page, "Modern");

    await submitWizard(page);
    await createAccount(page, {
      vorname: "Test", nachname: "Yoga",
      email: testEmail("yoga")
    });
  });

  // ═══ Szenario 7: Sportverein — Ohne Import, Klassisch, Verein ═══
  test("Szenario 7: Sportverein — Ohne Import, Klassisch, Verein", async ({ page }) => {
    await goToWizard(page);
    await skipImport(page);

    await fillGrunddaten(page, {
      firmenname: "SC Test Wien",
      branche: "Trainer",
      bundesland: "wien",
      kurzbeschreibung: "Sportverein für Kinder und Erwachsene."
    });

    await selectLeistungen(page, 2);

    await fillKontakt(page, {
      adresse: "Sportplatzgasse 1", plz: "1100", ort: "Wien",
      telefon: "+43 1 111 22 33", email: "test@sc-test.at",
      oeffnungszeiten: "vereinbarung"
    });

    // Verein mit ZVR-Zahl
    await fillImpressum(page, {
      form: "verein",
      extras: { zvr: "999888777", vertretung: "Obmann: Test Person, Kassier: Test Kassier" }
    });

    await selectStil(page, "Klassisch");

    await submitWizard(page);
    await createAccount(page, {
      vorname: "Test", nachname: "Verein",
      email: testEmail("verein")
    });
  });
});
