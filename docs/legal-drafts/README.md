# Legal-Drafts — Eigenarbeits-Volltexte vor Live-Schaltung

**Stand:** 2026-05-16
**Status:** Eigenarbeit nach Compliance-Pivot 2026-05-15 (`LIVE-COMPLIANCE.md` § 18). Anwalts-Audit Trigger-basiert spaeter.

Dieses Verzeichnis enthaelt die ausformulierten Volltexte der Plattform-Rechtstexte fuer instantpage.at. Quelle der Pflicht-Bausteine ist `LIVE-COMPLIANCE.md`:

| Dokument | Quelle Skeleton | Volltext |
|---|---|---|
| Datenschutzerklaerung | `LIVE-COMPLIANCE.md` § 8 | [`datenschutz-plattform.md`](datenschutz-plattform.md) |
| AVV (Hauptteil + Anhaenge) | `LIVE-COMPLIANCE.md` § 6 | [`avv-plattform.md`](avv-plattform.md) — Hauptteil als SCC-Verweis (EU 2021/915), Anhaenge I-IV ausformuliert |
| Impressum | `LIVE-COMPLIANCE.md` § 7 | [`impressum-plattform.md`](impressum-plattform.md) |
| AGB-Selbstcheck | `LIVE-COMPLIANCE.md` § 5 | [`agb-selbstcheck.md`](agb-selbstcheck.md) — 6 Eigenklauseln + Quer-Themen + Nachtrag §§ 16-18 (Plan-Portfolio-Erweiterung) |
| Marketing-AGB-Wording-Audit | FLAG § 6 aus agb-selbstcheck.md | [`marketing-agb-audit.md`](marketing-agb-audit.md) — „AT-Compliance integriert" vs § 6 Abs. 2; 3 Optionen, Option B empfohlen |

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
