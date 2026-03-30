// @ts-check
const { test, expect } = require("@playwright/test");

test.describe("Portal Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Kunden-Portal" }).click();
    await expect(page.getByRole("heading", { name: "Anmelden" })).toBeVisible();
  });

  test("zeigt Login-Formular mit E-Mail und Passwort", async ({ page }) => {
    await expect(page.getByPlaceholder("ihre@email.at")).toBeVisible();
    await expect(page.getByPlaceholder("Ihr Passwort")).toBeVisible();
  });

  test("Anmelden-Button ist klickbar wenn Felder ausgefuellt", async ({ page }) => {
    await page.getByPlaceholder("ihre@email.at").fill("test@test.at");
    await page.getByPlaceholder("Ihr Passwort").fill("irgendeinpasswort");
    const btn = page.getByRole("button", { name: /Anmelden/ });
    await expect(btn).toBeEnabled();
    await btn.click();
    // Button sollte nach Klick nicht verschwinden (kein Redirect ohne Auth)
    await expect(page.getByRole("heading", { name: "Anmelden" })).toBeVisible();
  });

  test("zeigt Passwort-Vergessen-Link", async ({ page }) => {
    await expect(page.getByText("Passwort vergessen?")).toBeVisible();
  });

  test("Passwort-Vergessen oeffnet Reset-Formular", async ({ page }) => {
    await page.getByText("Passwort vergessen?").click();
    await expect(page.getByText("Passwort zurücksetzen")).toBeVisible();
    await expect(page.getByRole("button", { name: "Abbrechen" })).toBeVisible();
  });

  test("Abbrechen im Reset kehrt zum Login zurueck", async ({ page }) => {
    await page.getByText("Passwort vergessen?").click();
    await page.getByRole("button", { name: "Abbrechen" }).click();
    await expect(page.getByRole("heading", { name: "Anmelden" })).toBeVisible();
  });
});
