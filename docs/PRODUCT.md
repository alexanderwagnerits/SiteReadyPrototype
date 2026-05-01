# Produkt-Spec — instantpage.at

> **Skeleton.** Wird befüllt aus `_archive/PROJECT-STAND-MAERZ-2026.md` + Memory-Updates während Live-Bau.

**Stand:** 2026-05-01 (Skeleton)

---

## Status

`[SKELETON]` — Inhaltsverzeichnis steht, Inhalte werden inkrementell aus folgenden Quellen migriert:

- `_archive/PROJECT-STAND-MAERZ-2026.md` — historischer Stand (Pricing, Funktionsumfang, Status-Pipeline)
- Memory `feedback_preise_plan.md` — aktuelles Pricing
- Memory `feedback_pricing_features.md` — Feature-Auswahl pro Plan
- Memory `project_production_refactor.md` — Custom Domains, Pro-Plan-Features
- Memory `project_recipe_system_v1.md` — Onboarding-Flow, Markt-Positionierung

---

## Inhalt (geplant)

1. Vision + Kernversprechen
2. Zielgruppe + Markt
3. Pricing + Pläne
4. Feature-Matrix pro Plan
5. Onboarding-Flow
6. Trial + Cancellation
7. Self-Service-Portal Funktionen
8. Markt-Positionierung
9. Roadmap (Public + Internal)
10. Produkt-Prinzipien

---

## 0. Produkt-Prinzipien (nicht verhandelbar)

### Status-Echtheit

Alle Status-Anzeigen im Portal müssen **echte Live-Werte** zeigen — niemals Platzhalter, "Coming Soon", oder vorgegaukelte Zustände.

Konkret betroffen:
- **Indexierung:** "Bei Google indexiert" nur wenn Google Search Console API das tatsächlich bestätigt
- **Custom Domain:** "Verbunden" nur wenn DNS auflöst + SSL aktiv
- **Live-Status:** "Online" nur wenn Health-Check < 5 Min alt erfolgreich
- **Mailing:** "Konfiguriert" nur wenn SPF/DKIM/DMARC validiert
- **Statistiken:** echte Zahlen aus Cloudflare Web Analytics, kein Demo-Content

**Why:** Vertrauensverlust bei KMU passiert sofort, wenn ein Status lügt. Lieber "Wird geprüft …" oder "Noch nicht verfügbar" als ein falsches "✓".

**How to apply:** Jedes Status-Feld im Portal muss eine identifizierbare Datenquelle haben. Bei UI-Reviews aktiv prüfen: woher kommt dieser Wert? Wenn die Antwort "Platzhalter" oder "Mock" lautet → entweder echt machen oder weglassen.

---

## 1. Vision + Kernversprechen

`[OFFEN]` — aus `_archive/PROJECT-STAND-MAERZ-2026.md` migrieren + an instantpage.at-Brand anpassen.

Kernversprechen (Vorabentwurf):
> Sag uns wer du bist und was du machst. Wir bauen die Website, die zu deiner Branche passt — automatisch.

## 2. Zielgruppe + Markt

`[OFFEN]` — aus `_archive/PROJECT-STAND-MAERZ-2026.md` "Zielgruppe & Markt" + Memory `project_recipe_system_v1.md` "Markt-Positionierung".

## 3. Pricing + Pläne

`[OFFEN]` — aktueller Stand laut Memory `feedback_preise_plan.md`:

| Plan | Monatlich | Jährlich | Status |
|---|---|---|---|
| Starter | 16 EUR | 14 EUR | aktiv |
| Professional | 29 EUR | 25 EUR | aktiv |
| Business | — | — | nur Teaser, noch nicht definiert |

USt-Behandlung: `[OFFEN]` netto + USt empfohlen (B2B-Standard).
Mindestlaufzeit: `[OFFEN]`.
Kündigungsfrist: `[OFFEN]`.

→ siehe `LIVE-COMPLIANCE.md` § 1 Strategie-Entscheidungen für offene Punkte.

## 4. Feature-Matrix pro Plan

`[OFFEN]` — aus Memory `feedback_pricing_features.md` + `project_production_refactor.md` "Abo-Pläne".

Vorabskizze:

| Feature | Starter | Professional |
|---|---|---|
| AI-generierte Website | ✓ | ✓ |
| Recipe-System (Berufsgruppen + Looks) | ✓ | ✓ |
| Self-Service-Portal | ✓ | ✓ |
| Subdomain (`firma.instantpage.at`) | ✓ | ✓ |
| Custom Domain (`www.firma.at`) | — | ✓ |
| Ohne instantpage-Branding | — | ✓ |
| Cloudflare Web Analytics (cookieless) | — | ✓ |
| Monatlicher Website-Report | — | ✓ |
| AI-Sichtbarkeit (llms.txt, robots.txt für AI-Crawler) | — | ✓ |
| Suchmaschinen-Indexierung (IndexNow) | — | ✓ |

## 5. Onboarding-Flow

`[OFFEN]` — siehe `RECIPE-SYSTEM.md` Onboarding-Flow + `_archive/PROJECT-STAND-MAERZ-2026.md` "Fragebogen Schritt 0–5".

## 6. Trial + Cancellation

`[OFFEN]` — Strategie-Entscheidung in `LIVE-COMPLIANCE.md` § 1:

- Trial-Setup (nur Vorschau / Live-Schaltung) — aktuell Default-Empfehlung: nur Vorschau
- Trial-Dauer (7 / 14 / 30 Tage) — aktuell Default-Empfehlung: 14 Tage
- Datenretention nach Kündigung — aktuell Default-Empfehlung: 90 Tage Grace

## 7. Self-Service-Portal Funktionen

`[OFFEN]` — aus `_archive/PROJECT-STAND-MAERZ-2026.md` "Kunden-Portal (Self-Service)" + Memory `project_agenda_2026-04-20.md` (Section-Toggles, Galerie-Upload, etc.).

## 8. Markt-Positionierung

→ siehe `RECIPE-SYSTEM.md` "Markt-Positionierung".

## 9. Roadmap

`[OFFEN]` — Public- vs. Internal-Roadmap noch zu definieren. Quartalsweise Major-Releases laut Memory `project_production_refactor.md` "Release-Rhythmus".

---

## Verbindung zu anderen Dokumenten

- `MIGRATION-PLAN.md` — wann welche Phase
- `RECIPE-SYSTEM.md` — Architektur Kundenwebsites
- `LIVE-COMPLIANCE.md` — rechtliche Constraints für Pricing, Trial, Cancellation
- `BRAND.md` — Voice & Tone für Marketing-Texte
- `business-case-kosten.md` — Wirtschaftlichkeit pro Plan
