# Doku — instantpage.at (Live-Produkt)

> **Index aller Repo-Dokus.** Living Documents — werden laufend ergänzt während Live-Bau.

**Stand:** 2026-05-01

---

## Wo was liegt

| Datei | Inhalt | Status |
|---|---|---|
| [README.md](README.md) | dieser Doku-Index | aktuell |
| [MIGRATION-PLAN.md](MIGRATION-PLAN.md) | **Master-Plan für Live-Bau in neuer Umgebung** — Setup, Übernahme, Phasen, Cutover | aktuell |
| [LIVE-COMPLIANCE.md](LIVE-COMPLIANCE.md) | Recht / Compliance — AGB, AVV, Datenschutz, Branchen-Pflichten, Anwalt-Trigger | aktuell |
| [RECIPE-SYSTEM.md](RECIPE-SYSTEM.md) | Kundenseiten-Architektur Live — 4 Themes + 24 Recipes + Section-Library | aktuell |
| [DESIGN-VISION.md](DESIGN-VISION.md) | **Visual-/UX-/Quality-Specs** für Premium-Anspruch — 14 Lücken in 4 Blöcken (~10-12 Wochen Phase vor Code-Setup) | aktuell |
| [PRODUCT.md](PRODUCT.md) | Produkt-Spec — Vision, Pricing, Features pro Plan | Skeleton |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Tech-Stack, DB-Schema, Deployment, Subprozessoren | Skeleton |
| [OPERATIONS.md](OPERATIONS.md) | Runbook, Email-Templates, Support-FAQ | Skeleton |
| [BRAND.md](BRAND.md) | Voice & Tone, Logo, Slogans, Tonalität | Skeleton |
| [business-case-kosten.md](business-case-kosten.md) | Wirtschaftlichkeit, Margen | aktuell (April) |
| [_archive/](_archive/) | Snapshots überholter Dokumente | Referenz |

---

## Wo was NICHT liegt

| Wo | Was | Warum |
|---|---|---|
| Memory-System (`~/.claude/projects/.../memory/`) | Lebendige Strategie-Notizen, Session-Logs, Konventionen | Memory ist für persistierte Notizen, nicht versionierte Wahrheit |
| Code-Kommentare | Implementations-Details | Bleiben im Code |
| Supabase docs-Tabelle | _historisch_ Projekt-Doku | wird beim Live-Bau eingestellt; Snapshot in `_archive/` |
| Customer-Help-Seiten | Kunden-Hilfe (instantpage.at/hilfe) | gehört auf die Live-Plattform, nicht ins Repo |
| Tutorial-Videos | Onboarding-Hilfe | Loom oder YouTube |

---

## Workflow

### Wann welche Doku konsultieren

| Du arbeitest an … | Lies zuerst |
|---|---|
| Compliance, Datenschutz, AGB, AVV, neuer Subprozessor | LIVE-COMPLIANCE.md |
| Kundenseiten, Themes, Recipes, Sections | RECIPE-SYSTEM.md |
| Stack, Deployment, DB-Schema | ARCHITECTURE.md |
| Pricing, Features, Plan-Gating | PRODUCT.md |
| Logo, Slogans, Marketing-Texte | BRAND.md |
| Incident-Response, Backup-Restore, Email-Vorlagen | OPERATIONS.md |
| Live-Bau planen, Phase-Übergang | MIGRATION-PLAN.md |

### Compliance-Pflicht (Trigger-basiert)

Vor Code-Änderungen die folgende Bereiche betreffen, ZUERST `LIVE-COMPLIANCE.md` konsultieren:

- Neue oder geänderte Datenverarbeitung (DB-Spalten, API-Endpoints, Subprozessoren)
- AGB-, AVV- oder Datenschutz-Texte
- Branchen-Pflichtfelder, Impressum-Generator, DSGVO-Generator
- Trial-, Cancellation- oder Datenrückgabe-Logik
- UI-Pflichtbestätigungen (Checkboxen, Disclaimer)
- Mailing, Kontaktformular, Endkunden-Daten
- AI-Act-Kennzeichnungen

### Doku-Updates

- **Strategie-Wechsel** → Memory aktualisieren + Doku ergänzen
- **Konkrete Texte (AGB, Vorlagen)** → direkt im Repo committen
- **Stand-Daten in Doku** → bei jeder größeren Änderung Stand-Datum oben aktualisieren
- **Veraltete Sektionen** → mit `[VERALTET — siehe X]` markieren statt löschen

---

## Verbindung zu Memory

Memory-Einträge die für Doku-Pflege relevant sind:

- `project_live_compliance.md` — Pointer auf LIVE-COMPLIANCE.md
- `project_production_refactor.md` — Live-Roadmap
- `project_recipe_system_v1.md` — Quelle für RECIPE-SYSTEM.md
- `project_kundenseiten_roadmap_2026-04-17.md` — Kundenseiten-Qualitäts-Items
- `project_design_references_live.md` — Design-Referenzen für Themes

---

*Pflegen bei jeder größeren Änderung. Doku-Drift vermeiden.*
