# Legal-Drafts — Eigenarbeits-Volltexte vor Live-Schaltung

**Stand:** 2026-05-16
**Status:** Eigenarbeit nach Compliance-Pivot 2026-05-15 (`LIVE-COMPLIANCE.md` § 18). Anwalts-Audit Trigger-basiert spaeter.

Dieses Verzeichnis enthaelt die ausformulierten Volltexte der Plattform-Rechtstexte fuer instantpage.at. Quelle der Pflicht-Bausteine ist `LIVE-COMPLIANCE.md`:

| Dokument | Quelle Skeleton | Volltext |
|---|---|---|
| Datenschutzerklaerung | `LIVE-COMPLIANCE.md` § 8 | [`datenschutz-plattform.md`](datenschutz-plattform.md) |
| AGB | `LIVE-COMPLIANCE.md` § 5 | _(bereits Volltext in LIVE-COMPLIANCE — vor Live noch § 5 Selbstcheck-Pass)_ |
| AVV (Hauptteil + Anhaenge) | `LIVE-COMPLIANCE.md` § 6 | _(folgt — Anhang I-IV strukturiert vorhanden, Hauptteil = SCC Module Controller-Prozessor)_ |
| Impressum | `LIVE-COMPLIANCE.md` § 7 | _(Skeleton in § 7, Volltext mit Stammdaten ausfuellen + AT-Anwalt-Audit-Trigger)_ |

## Workflow

1. **Eigenarbeit** Volltext basierend auf Bausteinen aus LIVE-COMPLIANCE
2. **RechtGPT-Stuetze** fuer unsichere Klausel-Wordings (Tier 1.5, ~30 EUR einmalig)
3. **WKO-Vorlagen-Abgleich** wo zutreffend (B2B-Standardklauseln)
4. **Anwalts-Audit-Trigger** spaeter (typisch: 30 zahlende Kunden, erste Abmahnung, AI-Act-Stichtag 2026-08-02)

## Konventionen

- **Platzhalter:** `[FIRMENWORTLAUT]`, `[STAMMDATEN]` etc. — werden im Live-Generator aus `config/legal-values.ts` ersetzt (siehe `anwalt-briefing.md` § 3)
- **Echte Umlaute** in Texten (ae, oe, ue — auch in Code-Strings nur ASCII, hier UI-Text)
- **Versionierung:** Datum + Aenderungs-Log am Dateiende
- **Brand-Voice gilt nicht** — diese Texte sind defensive juristische Sprache (siehe `BRAND.md` § 8 + `feedback_keine_rechtliche_pflichten.md`: „rechtliche Pflichten" hier zulaessig, weil juristischer Kontext)
