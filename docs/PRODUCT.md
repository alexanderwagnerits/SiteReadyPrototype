# Produkt-Spec — instantpage.at

> **Skeleton.** Wird befüllt aus `_archive/PROJECT-STAND-MAERZ-2026.md` + Memory-Updates während Live-Bau.

**Stand:** 2026-05-04 (Skeleton)

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

| Plan | Monatlich (netto) | Jährlich (netto, pro Monat) | Status |
|---|---|---|---|
| Starter | 16 EUR | 14 EUR | aktiv |
| Professional | 29 EUR | 25 EUR | aktiv |
| Business | — | — | nur Teaser, noch nicht definiert |

**USt-Behandlung:** netto + USt-Hinweis (B2B-Standard). Anzeige: "16 € pro Monat zzgl. 20 % USt". Stripe rechnet brutto ab, Rechnung weist USt aus.
**Mindestlaufzeit Monatsabo:** monatlich kündbar.
**Mindestlaufzeit Jahresabo:** 12 Monate, danach monatlich kündbar.
**Custom-Domain-Kosten** (Pro): Cloudflare for SaaS gibt 100 Hostnames gratis, ab 101: $0.10/Hostname/Monat. In Pro-Pricing eingerechnet.

## 3.1 Trial-Setup

- **Trial-Dauer:** 7 Tage (wie Prototyp)
- **Trial-Modus:** Vollzugriff inkl. Live-Schaltung der Subdomain — Wow-Moment ist Verkaufsargument
- **Karten-Belastung:** Stripe `trial_period_days` — Karte wird erst nach Trial-Ende belastet
- **Trial-Reminder:** T-3 Tage vor Trial-Ende (Lifecycle-Mail, OPERATIONS § 2)

## 3.2 Cancellation + Datenretention

| Phase | Dauer | Was passiert |
|---|---|---|
| **Reaktivierung** | 30 Tage | Subdomain bleibt erreichbar (mit Hinweis "Site pausiert"), Daten + Bilder vollständig erhalten, Reaktivierung mit einem Klick im Portal |
| **Soft-Delete** | weitere 60 Tage | Subdomain offline, Daten in DB markiert als deleted_at, kein Self-Service-Zugriff. Reaktivierung nur via Support-Anfrage. |
| **Endgültige Löschung** | nach 90 Tagen total | Hard-Delete inkl. Storage. Activity-Log-Eintrag mit Hash-Bestätigung. |

**Konsistent in:**
- AGB-Klausel "Vertragsende" innerhalb [`LIVE-COMPLIANCE.md` § 5 AGB-Skeleton](LIVE-COMPLIANCE.md#5-agb-skeleton-b2b-only)
- Datenschutzerklärung § Speicherdauer
- Stripe-Webhook `customer.subscription.deleted` triggert Phase 1

## 3.3 Re-Generation-Logik

Was triggert eine neue Text-Generierung im Live-Produkt:

| Auslöser | Re-Gen? | UX |
|---|---|---|
| Berufsbezeichnung im Portal geändert | **Ja** (auto) | Warnung "Texte werden neu generiert — vorhandene Anpassungen gehen verloren" |
| Anrede gewechselt (Sie ↔ Du) | **Ja** (auto) | Warnung wie oben |
| Look gewechselt (Recipe) | **Nein** | nur Optik, Texte bleiben |
| Akzentfarbe geändert | **Nein** | nur Optik |
| Logo getauscht | **Nein** | |
| Manueller "Neu generieren"-Button | **Ja** (User-Trigger) | Rate-Limit: 3x pro 30 Tage |

**Snapshot vor jedem Re-Gen:** automatisch in `order_snapshots` (Memory `project_production_refactor.md`), Auto-Delete nach 30 Tagen.

## 3.4 Quality-Score-Schwellenwerte

Auto Quality-Check nach jeder Generierung — Score 0-100 (Title, Meta-Description, OG-Tags, H1, Viewport, Lang, Kontaktformular, Impressum-Link, Telefon, Email).

| Score | Reaktion |
|---|---|
| **< 70** | Auto-Re-Gen (System versucht es nochmal, max 1x), bei zweitem Fail Admin-Alarm |
| **70-85** | Admin-Alarm im Dashboard, Site bleibt sichtbar, Kunde merkt nichts |
| **> 85** | OK, kein Eingriff |

→ siehe `LIVE-COMPLIANCE.md` § 1 Strategie-Entscheidungen für weitere offene Punkte.

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

## 5. Pre-Purchase-Onboarding (Fragebogen)

→ Vollständige Spezifikation in [`RECIPE-SYSTEM.md`](RECIPE-SYSTEM.md) Abschnitt "Onboarding-Flow". Diese Doku verweist nur, hält keine eigene Beschreibung — Drift-Schutz.

## 6. Trial + Cancellation

Strategie-Entscheidungen aus [`LIVE-COMPLIANCE.md` § 1](LIVE-COMPLIANCE.md#1-strategie-entscheidungen):

- **Trial-Setup:** Live-Schaltung erlaubt (Wow-Moment als Verkaufsargument) — `[ENTSCHIEDEN]` #5
- **Trial-Dauer:** 7 Tage — `[ENTSCHIEDEN]` #6
- **Mindestvertragslaufzeit:** Monatsabo monatlich kündbar / Jahresabo 12 Monate — `[ENTSCHIEDEN]` #7
- **Datenretention nach Kündigung:** 30 Tage Reaktivierung + 60 Tage Soft-Delete + danach Hard-Delete (90 Tage total) — `[ENTSCHIEDEN]` #9

## 7. Self-Service-Portal Funktionen

Aus Prototyp-Bestand + Live-Erweiterungen. Tab-Reihenfolge folgt Website-Reihenfolge (Memory `feedback_portal_design.md`).

### 7.1 Post-Purchase Status-Flow

Status-Maschine **nach** abgeschlossenem Kauf (Pre-Purchase-Fragebogen siehe § 5):

1. `status = paid` → Onboarding-Screen: Fotos hochladen (optional), "Website erstellen" klicken
2. `status = in_arbeit` → Build-Screen mit "Status aktualisieren"
3. `status = live` → Portal mit allen Tabs freigeschaltet
4. Pflicht-Bestätigungen beim ersten Login: AGB + AVV ([`LIVE-COMPLIANCE.md` § 1](LIVE-COMPLIANCE.md#1-strategie-entscheidungen) #20) + Bildrechte ([`LIVE-COMPLIANCE.md` § 5](LIVE-COMPLIANCE.md#5-agb-skeleton-b2b-only) AGB-§ 7)

### 7.2 Portal-Tabs (Sidebar-Gruppen)

**Gruppe "Inhalte meiner Website":**

| Tab | Funktionen |
|---|---|
| **Meine Website** | Status-Anzeige (Live-URL, HTTP-Status), Grunddaten (Firmenname, Branche, Kurzbeschreibung), Kontakt + Adresse, Öffnungszeiten, Social Media |
| **Leistungen** | Reihenfolge sortierbar, Beschreibungen pro Card, Pro-Service-Bilder mit Bildrechten-Bestätigung, "Zusätzliche Leistungen" Freitext |
| **Texte** | Über uns, Vorteile, Hero-Headline (auto-generiert, editierbar), Hero-Subline |
| **Bewertungen** | jsonb-Array CRUD: Name, Sterne, Text |
| **Galerie** | Multi-Upload mit Caption + Credit pro Bild, Anordnung |
| **Team** | jsonb-Array CRUD: Name, Titel, Bio, Foto, Foto-Credit |
| **FAQ** | jsonb-Array CRUD: Frage, Antwort. Alternativ: Auto-Generierung via `/api/generate-faq` (5 branchenspez.) |
| **Logo & Fotos** | Logo-Upload (Vorschau dunkel+hell), Hero-Bild, bis zu 5 Betriebsfotos. Bildrechten-Modal blockt bis Checkbox aktiviert. Audit-Trail mit IP. |
| **Section-Toggles** | sections_visible jsonb-Toggles: FAQ, Galerie, Fakten, Partner, Team an/aus |

**Gruppe "Einstellungen":**

| Tab | Funktionen |
|---|---|
| **Design** | Look wechseln (Recipe-Auswahl), Akzentfarbe ändern (Vorschläge + Custom Picker), Anrede umstellen (Sie/Du, triggert Re-Gen), Live-Preview rechts daneben |
| **Unternehmen & Impressum** | Read-only — Änderungen via Support (48h, da rechtlich relevant). Pflichtfelder rechtsformabhängig: Unternehmensform, UID, FB-Nummer, GISA, Kammer, etc. |
| **SEO & Google** | Indexierungs-Status (echt aus Search Console API — siehe Status-Echtheit-Prinzip), llms.txt-Status, robots.txt-Vorschau |
| **Custom Domain** (Pro) | DNS-Anleitung CNAME-Setup, Domain-Verifikations-Status (pending → verifying → active), 301-Redirect von Subdomain |
| **Statistiken** (Pro) | Cloudflare Web Analytics: Besucher, Geräte, Referrer (cookieless, kein Banner) |

**Gruppe "Konto":**

| Tab | Funktionen |
|---|---|
| **Mein Account** | Email, Mitglied seit, Passwort ändern, Email-Adresse ändern, 2FA-Opt-in (Live, ARCHITECTURE § 10) |
| **Rechnungen** | Stripe-Zahlungshistorie + Billing-Portal-Link (Plan ändern, Pause, Kündigung) |
| **Beta-Feedback** | Nur Beta-Phase, in Live entfernt |
| **Support** | FAQ + Support-Formular, "Etwas funktioniert nicht?"-Diagnostik (siehe OPERATIONS § 1) |

### 7.3 Live-Preview-Engine

Bei jeder Design-Änderung im Design-Tab:
- Section rendert direkt rechts daneben
- Stil-Wechsel ohne Re-Generation der Texte (serve-time CSS-Klasse)
- Anrede-Wechsel mit Warnung "Texte werden neu generiert"
- Look-Wechsel (Recipe-Wechsel) mit Vorschau bevor commit

### 7.4 Save-Pattern

- **Hybrid-Save:** Auto-Save bei Toggles + Sliders + Color-Picker; Save-Button bei Forms (Memory `feedback_portal_design.md`)
- Save-Indikator (Toast oder Inline-Status)
- Optimistic Updates wo möglich
- Undo pro Card (`[OFFEN]` Phase 2 Portal-Erweiterung)

### 7.5 Read-only-Bereiche (Änderung via Support)

- **Unternehmen & Impressum** — rechtlich kritisch, 48h Umsetzung via Support-Ticket
- **Subdomain** — nicht änderbar nach Live-Schaltung (Redirects + SEO-Folgen)
- **Plan-Wechsel** — nur via Stripe Billing Portal

### 7.6 Mobile-Portal

- Hamburger-Menü ab Tablet-Breite
- Card-Layout 1-spaltig auf Mobile
- Touch-optimierte Targets (min 44×44px)
- File-Upload via Camera-Capture-Hint

### 7.7 Empty-States

Pro Tab eigener Empty-State mit klarem CTA:
- "Noch keine Bewertungen — füge die erste hinzu"
- "Noch kein Logo — Upload bringt 30% mehr Conversion" etc.

### 7.8 Diagnostik-Button "Etwas funktioniert nicht?"

In jedem Tab unten: Auto-Check (Logo lädt? Mail eingestellt? Domain konfiguriert?) → konkrete Lösungs-Anleitung statt nur Fehlermeldung. Memory `project_production_refactor.md` "Customer-Support Layer 2".

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
