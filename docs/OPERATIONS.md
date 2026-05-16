# Operations — instantpage.at

> **Skeleton.** Wird befüllt während Phase 3 + 4 des Live-Bau (siehe `MIGRATION-PLAN.md`).

**Stand:** 2026-05-06

---

## Status

`[TEIL-FERTIG]` — Incident-Response (§1), Activity-Log (§1.5), Notice-and-Takedown (§4), Datenpannen-Meldeprozess (§5), **Backup-Restore vollständig (§6)**, Self-Check (§7), **Kunden-Onboarding-Playbook vollständig (§8)**, **Monitoring-Setup vollständig (§9)** — alle Live-Day-1-relevanten Punkte gefüllt.

**Noch `[OFFEN]`** (entstehen vor / nach Live-Schaltung iterativ):
- §2 Email-Templates: Tabelle steht, einzelne Markdown-Vorlagen vor Resend-Setup
- §3 Support-FAQ: Top 10 Fragen ohne Antworten, weitere 10 aus realen Anfragen

---

## Inhalt

1. Incident-Response-Runbook
2. Email-Templates (Lifecycle) — `[OFFEN]` (vor Live-Schaltung)
3. Support-FAQ (Top 20) — `[OFFEN]` (iterativ aus Anfragen)
4. Notice-and-Takedown-Prozess
5. Datenpannen-Meldeprozess
6. Backup-Restore-Verfahren — Strategy + Restore + Test-Schedule + RPO/RTO + Verantwortlichkeit
7. Self-Check vierteljährlich
8. Kunden-Onboarding-Playbook — Mindestdaten, reglementierte Berufe, Stuck-States, Re-Generate vs Edit
9. Monitoring-Setup — Was, Logs, Dashboards, Alert-Routing, Deploy-Checks

---

## 1. Incident-Response-Runbook

`[SKELETON]` — typische Incidents + Reaktion:

| Incident | Erste Reaktion | Eskalation |
|---|---|---|
| Supabase down | Status-Page prüfen, Backup-DB starten | Cloudflare-Status-Banner |
| Stripe-Webhook hängt | Webhook-Logs prüfen, Retry triggern | Manuelle Status-Korrektur in DB |
| Anthropic-API-Quota erreicht | Top-up Console, Generate-Endpoint pausieren | Status-Banner für Kunden |
| Subdomain-Konflikt | Auto-Suffix oder manueller Eingriff | DB-Constraint hinzufügen |
| Subdomain stuck in `pending` | `start-build` re-trigger oder Cron starten | Manueller Generate-Aufruf im Admin |
| DDoS / Abuse | Cloudflare WAF Rules anpassen | IP-Block + Notice an Abuse-Adresse |
| Datenpanne | siehe Abschnitt 5 + `LIVE-COMPLIANCE.md` § 12.2 | DSB-Meldung 72h |
| Health-Monitor erkennt Site-Down | Auto-Support-Ticket erstellt, Admin-Alert | Manueller Re-Deploy |

### 1.5 Activity-Log Action-Types (vollständig)

Alle Aktionen die in `activity_log.action` geloggt werden. Aus Prototyp + Live-Erweiterungen:

**Build / Generierung:**
- `build_start` (actor: system) — start-build aufgerufen
- `build_success` (actor: system) — Generate erfolgreich
- `build_failed` (actor: system) — Generate fehlgeschlagen, last_error gesetzt
- `website_generated` (actor: admin/system) — initiale Generierung
- `website_regenerated` (actor: admin/user) — Re-Generierung
- `partial_regen_leistungen` (actor: user) — Partial-Regen Leistungen-Section
- `quality_check_failed` (actor: system) — Quality-Score < Schwellwert

**Status-Wechsel:**
- `status_changed` (actor: admin/system) — z.B. trial → live
- `online` (actor: admin) — Status auf live gesetzt
- `offline` (actor: admin) — Status auf offline gesetzt
- `subdomain_changed` (actor: admin) — Subdomain umbenannt
- `stil_changed` / `look_changed` (actor: admin/user) — **serve-time-Update** (CSS-Klasse + Akzentfarbe)
- `recipe_changed` (actor: admin/user, Live) — **serve-time-Update** (Recipe-Konfig-Lookup: Layout + Section-Reihenfolge + Toggles + Bewertungs-Variante). Texte bleiben.
- `anrede_changed` (actor: user, Live) — **serve-time-Update** (kein Re-Gen) ab Live-Bau, Voraussetzung: Anrede-Platzhalter im Generierungs-Prompt
- `firmenname_changed` (actor: user, Live) — **serve-time-Update** via `{{FIRMENNAME}}`-Placeholder
- `admin_berufsgruppe_reset` (actor: admin, Live) — bei Falsch-Eingabe-Korrektur via Support: Site-Reset oder Daten-Übernahme in neue Site

**Trial / Subscription:**
- `trial_started` (actor: system) — trial_expires_at gesetzt
- `trial_extended` (actor: admin) — +7d / +14d (Kulanz-Verlaengerung bei technischen Problemen waehrend Trial; nicht im AGB als Kunden-Recht zugesichert, ausschliesslich Admin-getrieben)
- `trial_expired_cleanup` (actor: system) — Cron-Job-Cleanup
- `checkout_completed` (actor: system, "via Stripe") — Stripe-Webhook
- `payment_succeeded` (actor: system, "via Stripe")
- `payment_failed` (actor: system, "via Stripe")
- `subscription_canceled` (actor: system/user)
- `subscription_renewed` (actor: system, Live)

**Portal-Aktionen (User):**
- `logo_uploaded`, `foto_uploaded`, `foto_removed`
- `team_member_added`, `team_member_removed`
- `bewertung_added`, `bewertung_removed`
- `faq_added`, `faq_removed`
- `galerie_uploaded`
- `bildrechte_bestaetigt` — mit IP-Hash
- `impressum_updated`, `datenschutz_acknowledged`
- `section_toggled` — mit section-name + visible-state
- `accent_color_changed` (Live)
- `domain_added` (Pro), `domain_verified`, `domain_removed`

**Support / Admin:**
- `ticket_created` (actor: user/system)
- `ticket_answered` (actor: admin)
- `ticket_closed` (actor: admin/system)
- `notiz_updated` (actor: admin)
- `manual_intervention` (actor: admin) — generische Admin-Aktion

**Compliance / Legal (Live):**
- `dsgvo_export_requested` (actor: user) — Datenauskunft Art. 15
- `dsgvo_delete_requested` (actor: user) — Recht auf Löschung Art. 17
- `dsgvo_delete_executed` (actor: system) — nach Grace-Period
- `abuse_report_received` (actor: system) — Notice eingegangen
- `content_suspended` (actor: admin) — Kunden-Site offline wegen Verdacht
- `consent_recorded` (actor: user) — AGB/AVV-Akzeptanz beim Login

**System:**
- `health_check_failed` (actor: system) — Health-Monitor Cron erkennt Down
- `cron_executed` (actor: system) — z.B. trial-cleanup
- `email_sent` (actor: system) — pro Lifecycle-Email mit template-name
- `email_bounced` (actor: system) — Email-Provider Bounce-Webhook

## 2. Email-Templates (Lifecycle)

`[SPEC-FERTIG 2026-05-14, ERWEITERT 2026-05-16]` — 11 Templates als Markdown-Drafts in [`docs/email-templates/`](email-templates/). HTML-Templates fuer Resend werden im Live-Bau Phase 0 daraus abgeleitet. Provider: **Resend** (`[ENTSCHIEDEN]` 2026-05-04, siehe `LIVE-COMPLIANCE.md` § 1 #13).

### Lifecycle (automatisiert)

| Template | Trigger | Spec-File |
|---|---|---|
| **Welcome** | Site-Generation (`status = live`) | [welcome.md](email-templates/welcome.md) |
| **Trial-Reminder** | T+4 (T-3 vor Trial-Ende), einmalig | [trial-reminder.md](email-templates/trial-reminder.md) |
| **Trial-End / Grace** | T+8 (Trial abgelaufen, Site pausiert) | [trial-end-grace.md](email-templates/trial-end-grace.md) |
| **Payment-Failed** | Stripe-Webhook `invoice.payment_failed`, einmalig | [payment-failed.md](email-templates/payment-failed.md) |
| **Cancellation-Confirmation** | Stripe-Webhook `customer.subscription.deleted` | [cancellation-confirmation.md](email-templates/cancellation-confirmation.md) |
| **Cancellation-Final** | Cron T-1 vor Hard-Delete (T+89) | [cancellation-final.md](email-templates/cancellation-final.md) |
| **Support-Confirmation** | Auto-Reply bei Support-Anfrage | [support-confirmation.md](email-templates/support-confirmation.md) |
| **Domain-Setup** | Pro-Plan: Kunde traegt Custom-Domain im Portal ein | [domain-setup.md](email-templates/domain-setup.md) |
| **Aktionsrabatt-Ende** | Cron 14 Tage vor Newcomer-Rabatt-Ablauf (`coupon NEWCOMER-20-FIRSTYEAR`) | [aktionsrabatt-ende.md](email-templates/aktionsrabatt-ende.md) |

### Manuell / On-Demand

| Template | Trigger | Spec-File |
|---|---|---|
| **Datenpanne** | Manueller Versand nach DSB-Meldung (Art. 34 DSGVO, bei hohem Risiko) | [datenpanne.md](email-templates/datenpanne.md) |
| **Beta-Cutover** | Einmaliger Batch-Versand T-7 vor Live-Schaltung | [beta-cutover.md](email-templates/beta-cutover.md) |

**Bewusst gestrichen** (etablierte SaaS-Anbieter machen das nicht, im AT-Vertrauensprodukt-Kontext aufdringlich): doppelter Trial-Reminder, Win-Back-Mail, Welcome-Pro-Mail.

**Payment-Confirmation / Rechnung:** Stripe-Default-Receipt mit AT-Custom-Fields, Tax-Exempt, KU-Klausel als Custom-Field. **Kein eigenes Markdown-Template** — Konfiguration im Stripe-Dashboard. Setup in Live-Bau Phase 1:
- Stripe → Settings → Emails → Subscription receipts aktivieren
- Custom-Footer-Text: *„Kleinunternehmer im Sinne des § 6 Abs 1 Z 27 UStG, daher keine USt ausgewiesen."*
- Custom-Fields auf Invoice: Firmenbuchnummer (FN 609574h), HG Wien, Bankverbindung Erste Bank

Voice + Variablen-Konvention + Master-Footer + Fallback-Anrede: siehe [README in `docs/email-templates/`](email-templates/README.md).

## 3. Support-FAQ (Top 20)

`[OFFEN]` — entsteht aus realen Anfragen. Erste Top-10-Annahmen:

1. Wie ändere ich mein Logo?
2. Wie aktiviere ich eine eigene Domain (Pro-Plan)?
3. Wie kündige ich?
4. Wie exportiere ich meine Daten?
5. Wie ändere ich mein Pricing-Plan?
6. Was bedeutet "reglementierter Beruf" im Onboarding?
7. Wie aktiviere ich das Kontaktformular?
8. Wie verwalte ich Bewertungen?
9. Wo sehe ich Besucher-Statistiken? (Pro-Plan)
10. Wie funktioniert der Trial?

`[OFFEN]` — weitere 10 nach realen Anfragen ergänzen.

## 4. Notice-and-Takedown-Prozess

→ vollständig in `LIVE-COMPLIANCE.md` § 12.1.

Kurzfassung:

| Schritt | Verantwortlich | SLA |
|---|---|---|
| Eingang Meldung an abuse@instantpage.at | E-Mail-System | sofort |
| Sichtung + Erst-Bewertung | Inhaber | innerhalb 24h |
| Bei begründetem Verdacht: Inhalt sperren | Inhaber | innerhalb 24h |
| Information an Kunden mit 7-Tage-Frist | Inhaber | innerhalb 24h |
| Endgültige Entscheidung | Inhaber | innerhalb 14 Tage |

## 5. Datenpannen-Meldeprozess

→ vollständig in `LIVE-COMPLIANCE.md` § 12.2.

Vorlage für interne Bewertung:
- Welche Daten betroffen?
- Wie viele Betroffene?
- Risiko für Betroffene?
- Eingrenzungs-Maßnahmen?
- DSB-Meldung nötig (72h)?
- Kommunikation an Betroffene nötig?

## 6. Backup-Restore-Verfahren

→ Architektur-Detail in `ARCHITECTURE.md` § 9 Backup + Recovery.

### 6.1 Backup-Strategy

**Voraussetzung:** Live läuft auf **Supabase Pro** (~25 USD/Mo) — wegen PITR (Point-in-Time Recovery 7 Tage) + höherer DB-Limits. Beta läuft auf Free.

| Datenklasse | Quelle | Frequenz | Ziel | Retention |
|---|---|---|---|---|
| **Datenbank PITR** | Supabase Pro | continuous | Supabase-intern | 7 Tage (Pro-Tier-Default) |
| **Datenbank (Daily-Backup)** | Supabase Pro | täglich 03:00 UTC | Supabase + Mirror nach R2 `backups-instantpage/db-YYYY-MM-DD.sql.gz` | 30 Tage rolling |
| **Datenbank (Wochen-Snapshot)** | Supabase | sonntags 03:00 UTC | R2 `backups-instantpage/db-YYYY-WW.sql.gz` | 12 Wochen |
| **Datenbank (Monats-Snapshot)** | Supabase | 1. des Monats | R2 `backups-instantpage/db-YYYY-MM.sql.gz` | 12 Monate |
| **Storage (Logos, Fotos, Galerie)** | Supabase Storage | täglich (Object-Sync) | R2 `backups-instantpage-storage/` | 30 Tage rolling |
| **Code-Repository** | GitHub | bei jedem Push | GitHub-eigene Backups + lokales `git clone` Inhaber | unbegrenzt |
| **Cloudflare-Konfiguration** | Cloudflare | manuell vor jeder Änderung | `wrangler config export` in privates Repo | unbegrenzt |
| **Stripe-Daten** | Stripe | nicht repliziert | Stripe ist Source of Truth, eigene Backups | n/a |
| **Activity-Log (Audit)** | Postgres-Tabelle | im DB-Backup enthalten | siehe oben | 12 Monate (DSGVO-konform für Audit-Pflichten) |

**R2-Kosten-Schätzung:** bei 50-200 GB Storage-Volumen ~3-5 €/Monat — überschaubar.

**Trigger:** Cron-Job `functions/cron/backup-mirror.js` läuft täglich 03:30 UTC, holt Supabase-Backup ab und mirror't nach R2. **`[BAU im Live-Migration]`** — siehe `MIGRATION-PLAN.md` Phase 3.

### 6.2 Restore-Anleitung (technisch)

```bash
# 1. Letztes Backup aus R2 holen
wrangler r2 object get backups-instantpage/db-YYYY-MM-DD.sql.gz ./

# 2. In Staging-DB einspielen
gunzip db-YYYY-MM-DD.sql.gz
psql $STAGING_DB_URL < db-YYYY-MM-DD.sql

# 3. Smoke-Test
playwright test smoke

# 4. Wenn ok: in Production einspielen (vorsichtig!)
psql $PRODUCTION_DB_URL < db-YYYY-MM-DD.sql
```

### 6.3 Test-Schedule (Restore-Drill)

| Was | Wann | Verantwortlich | Erfolgskriterium |
|---|---|---|---|
| Restore-Drill (Daily-Backup → Staging) | quartalsweise | Inhaber | Smoke-Test grün, Anmeldung funktioniert, eine Demo-Kunden-Site rendert |
| Restore-Drill (Wochen-Snapshot) | jährlich (Self-Check Q4) | Inhaber | wie oben + Activity-Log-Daten konsistent |
| Storage-Restore (Logos + Fotos) | jährlich (Self-Check Q4) | Inhaber | 5 zufällige Subdomains rendern mit Original-Bildern |

Restore-Drill-Termine im `/schedule`-Cron eingetragen, Reminder per E-Mail an Inhaber.

### 6.4 RPO + RTO

Gestuft nach Plan, da Trial-Kunden keine harten Garantien erhalten:

| Plan | RPO (max. Datenverlust) | RTO (max. Wiederherstellungszeit) | Mechanismus |
|---|---|---|---|
| **Trial** | 24 Stunden | 4 Stunden | Daily-Backup-basiert |
| **Starter / Professional** | 1 Stunde | 4 Stunden | PITR-basiert (Supabase Pro) |
| **Business** (Teaser) | 1 Stunde | 2 Stunden | PITR + priorisierter Restore |

**Im AGB:** "best effort, keine harte SLA-Zusicherung" (KMU-Vertrauensprodukt, kein Enterprise-Vertrag). RPO/RTO als interne Zielwerte, nicht als rechtsverbindliche Versprechen — Argument: Cloudflare/Supabase haben selbst keine 100%-SLA.

**Status-Banner:** Bei laufendem Restore Erwartungs-Management auf instantpage.at (Status-Page). Trial-User bekommen E-Mail mit ETA.

### 6.5 Verantwortlichkeit

| Aufgabe | Wer | Backup wenn |
|---|---|---|
| Backup-Cron-Health überwachen | Auto-Health-Monitor | Bei 2 fehlgeschlagenen Backups → E-Mail an Inhaber |
| Quartalsweiser Restore-Drill | Inhaber | n/a (Eigentümer-Aufgabe) |
| Storage-Sync-Health | Cron-Health-Monitor | Bei Sync-Fehler → Slack/E-Mail-Alert |
| Manuelle Restore-Entscheidung | Inhaber | Bei längerer Abwesenheit Vertretung benennen (Datenpannen-Pflicht) |



## 7. Self-Check vierteljährlich

→ vollständig in `LIVE-COMPLIANCE.md` § 19.

Erinnerung: per `/schedule`-Trigger automatisierbar.

**Versicherungs-Re-Evaluation (Phase 2)** — bei jedem Self-Check prüfen:

- Aktive Live-Kunden ≥ **50**?
- Jahresumsatz (ARR) ≥ **30.000 €**?
- Beinahe-Vorfall im Quartal (Phishing, kompromittierter Login, DDoS, Datenpanne)?
- Rechtliche Streitigkeit eingelangt?
- Vertraglicher Druck von Kunden (Versicherungsnachweis verlangt)?

→ Bei "ja" zu einer Frage: Cyber-Versicherung + Berufsrechtsschutz erneut bei Aon anfragen (Martin Zainzinger, +43 5 7800-528). Detail in `LIVE-COMPLIANCE.md` § 3.5.

## 8. Kunden-Onboarding-Playbook

Interner Leitfaden für manuellen Onboarding-Bedarf — wenn ein Kunde im Self-Service-Flow stecken bleibt oder spezielle Hilfe braucht.

### 8.1 Mindestdaten für eine generierbare Site

Bevor `start-build` aufgerufen werden kann, müssen folgende Felder befüllt sein:

| Feld | Pflicht | Quelle | Fallback wenn leer |
|---|---|---|---|
| `firmenname` | ja | User-Eingabe | n/a — ohne Name kein Build |
| `bezeichnung` | ja | User-Freitext (z.B. "Tischlerei", "Anwaltskanzlei") | n/a |
| `berufsgruppe` | ja | Dropdown (12 Gruppen) | n/a |
| `look_variante` | ja | Dropdown abhängig von Berufsgruppe | Default-Variante aus `recipe-konfiguration.md` |
| `stil` | nein | aus Recipe-Default abgeleitet | aus Recipe-Konfig |
| `primary` + `accent` | nein | aus Logo-Extraktion oder Recipe-Default | Recipe-Default |
| `tel` ODER `email` | ja (eines davon) | User-Eingabe | n/a — Kontakt ohne Daten = Site nicht hilfreich |
| `adresse_voll` | nein | User-Eingabe oder leer | Sektion ausgeblendet |
| `kurzbeschreibung` | nein | Claude generiert oder User-Edit | Claude generiert aus berufsgruppe + bezeichnung |

**Regel:** Wenn Pflichtfelder fehlen, bleibt Status auf `incomplete`. Build wird nicht ausgelöst.

### 8.2 Reglementierte Berufe — Zusatz-Pflichtfelder

→ **Source of Truth: `LIVE-COMPLIANCE.md` § 10 "Reglementierte Berufe — Sonderbehandlung"**. Dort ist die definitive Tabelle mit ~35 reglementierten Branchen, ihren Kammer-Defaults, Aufsichtsbehörden und Berufsrecht-Quellen.

**Operationelle Konsequenzen für Onboarding:**
- Bei Branchen-Wahl mit `reglementiert: true` (Flag in `src/data.js` `BRANCHEN`-Array) zeigt das Portal eine **Warnung** mit Zusatz-Pflichtfeldern.
- Pflichtfelder pro Berufsgruppe sind in `BRANCHE_PFLICHT`-Map in `functions/s/[subdomain]/legal.js` codiert.
- Generierungs-Prompts in `functions/_lib/generate.js` aktivieren bei reglementierten Berufen einen **Defensiv-Block** (verbietet Heils-Versprechen, vergleichende Werbung etc.).
- Build wird **blockiert**, wenn Pflichtfelder fehlen — Status bleibt `incomplete`.

**Quick-Referenz für die Top-5 reglementierten Berufsgruppen** (Detail in LIVE-COMPLIANCE.md § 10):

| Berufsgruppe | Beispiele | Pflicht-Zusatzfelder |
|---|---|---|
| Gesundheit | Arzt, Zahnarzt, Apotheke, Heilmasseur | Kammer + Aufsicht + Berufsrecht-Quelle |
| Rechtsberatung | Anwalt, Notar, Patentanwalt | Kammer + RAO/Notariatsordnung |
| Wirtschaftsberatung | Steuerberater, WP, Gewerbliche Buchhalter | KSW + WTBG |
| Reglementiertes Gewerbe | Tischler, Elektriker, Installateur, Baumeister | Gewerbeschein + Innung + GewO |
| Konzessions-Gewerbe | Taxi, Mietwagen, Detektiv | Konzessions-Nr + Aufsichtsbehörde |

### 8.3 Erste-Hilfe bei Stuck-States

| Status | Diagnose | Aktion |
|---|---|---|
| `pending` länger als 5 Min | Build-Cron hängt oder Anthropic-API-Fehler | Activity-Log prüfen → `last_error` lesen → ggf. manueller Re-Trigger via Admin |
| `incomplete` aber alle Pflichtfelder befüllt | Validierungs-Bug oder DB-Cache | Page-Reload, dann manueller `start-build`-Trigger im Admin |
| `failed` mit `quality_check_failed` | Generierter Content unter Schwellwert | Re-Generate mit anderen Inputs (z.B. längere `kurzbeschreibung`) |
| `failed` mit `last_error: anthropic_quota` | API-Limit erreicht | Top-up Anthropic-Konsole, dann Re-Trigger |
| `bereit` länger als 7 Tage (kein Freigabe-Klick) | Kunde hat Vorschau-Modus gewählt aber nicht live-geschaltet — siehe LIVE-COMPLIANCE § 1 #24 | Reminder-Mail T-3/T-7 (siehe § 2 Email-Templates). Trial-Zähler startet erst bei Live-Schaltung, kein Datenverlust. Bei Inaktivität >30 Tage Support-Outreach. |
| `bereit` aber Akzept-Checkbox nicht aktivierbar (UI-Bug) | Frontend-Validierungs-Bug | Reload, ggf. Admin-Override mit manueller `live_freigaben`-Row + Status-Switch |
| `live` aber Site rendert nicht | Subdomain-DNS oder Worker-Fehler | Cloudflare-Status prüfen, ggf. Worker neu deployen |
| Subdomain-Konflikt beim Anlegen | Auto-Suffix nicht angesprungen | Manuell anderen Subdomain-Namen vorschlagen |

### 8.4 Wann Re-Generierung nötig ist (vs. Serve-Time / Portal-Edit)

**Architektur-Prinzip 2026-05-06:** **Serve-Time-Maximum.** Re-Generierung kostet Anthropic-Tokens und ist langsam — was serve-time ersetzt werden kann, wird serve-time ersetzt. Re-Gen bleibt **nur** für initiale Generierung + manuellen Admin-Trigger.

| Situation | Mechanismus | Voraussetzung |
|---|---|---|
| Stil/Look gewechselt | serve-time (CSS-Klasse) | bereits implementiert |
| Akzentfarbe geändert | serve-time (CSS-Token) | bereits implementiert |
| Foto austauschen | serve-time (Image-Replace) | bereits implementiert |
| Bewertung hinzufügen | serve-time (DB-Read + HTML-Inject) | bereits implementiert |
| Leistung-Beschreibung anpassen | serve-time (DB-Read + HTML-Inject) | bereits implementiert |
| **Firmenname geändert** | **serve-time** | Generierungs-Prompts mit `{{FIRMENNAME}}`-Placeholder. Live-Bau-Aufgabe. |
| **Anrede gewechselt (du/Sie)** | **serve-time** | Anrede-Platzhalter (`{anrede_pron|Sie/du}` etc.). Live-Bau-Aufgabe. |
| **Look-Variante-Wechsel innerhalb Berufsgruppe** | **serve-time** | Andere CSS-Klasse + Akzentfarbe + Layout (standard/kompakt/ausfuehrlich) + Section-Reihenfolge + Section-Toggles + Bewertungs-Variante — alles serve-time aus Recipe-Konfig-Lookup. **Texte bleiben dieselben** (gleiche Berufsgruppe → gleicher Tonfall). Live-Bau-Aufgabe. |
| Bezeichnung geändert ("Tischlerei" → "Möbelmanufaktur") | **serve-time** | Wenn als Placeholder generiert (`{{BEZEICHNUNG}}`). Sonst manueller Re-Gen via Admin auf Wunsch. |
| **Berufsgruppe-Wechsel** | **NICHT möglich** im Portal | Inhalt komplett anders (Tonfall, Begriffe, Recipe). Bei Falsch-Eingabe → Support-Anfrage → Admin macht Site-Reset oder neue Site mit Daten-Übernahme. **Berufsgruppe ist nach Onboarding read-only im Portal.** |

**Re-Gen-Auslöser-Liste (final, nur 2 Fälle):**
1. **Initiale Generierung** beim Onboarding
2. **Manueller Re-Gen via Admin/Portal** — auf Wunsch wenn Kunde Tonalität komplett ändern will

**Konsequenz für Portal-UX:**
- Berufsgruppe-Feld nach Onboarding **read-only** anzeigen mit Hinweis "Berufsgruppe-Änderung über Support"
- Look-Variante-Wechsel **ohne Warnung** (kein "Re-Gen wird teuer"-Banner mehr)
- Anrede-Wechsel **ohne Warnung** (serve-time)
- Stil-Wechsel **ohne Warnung** (serve-time)

**Im Activity-Log umzubauen** (`§1.5`):
- ~~`anrede_changed → triggert Re-Gen mit Warnung`~~ → `anrede_changed → serve-time-Update`
- ~~`look_changed/recipe_changed → triggert Re-Gen`~~ → `look_changed → serve-time-Update aus Recipe-Konfig-Lookup`
- ~~`firmenname_changed → triggert Re-Gen`~~ → `firmenname_changed → serve-time-Update`
- `berufsgruppe_changed` als Activity-Type entfernen (im User-Portal nicht möglich); falls über Admin → eigener Action-Type `admin_berufsgruppe_reset` mit Site-Reset-Folge

### 8.5 Onboarding-Begleit-E-Mails (manuell, vor Live-Schaltung)

Aktuell im Beta noch manuell. Bei Live-Schaltung als Resend-Templates (siehe § 2):
- T+0: Welcome-Mail nach erstem Login
- T+1: "Wie war der erste Tag?" — Reply-on-this-Mail wenn was hängt
- T+5: Erste-Hilfe-Tipps wenn Site noch `incomplete`
- T-3 (vor Trial-Ende): Plan-Wahl-Reminder

---

## 9. Monitoring-Setup

Live-Day-1-relevant. Cloudflare + Supabase + Stripe sind die drei Komponenten, die überwacht werden müssen.

### 9.1 Was wird überwacht

**Tool-Stack** (minimaler Setup für Einzelinhaber):
- **Primary:** Cloudflare Health-Check (gratis, eingebaut)
- **Backup:** UptimeRobot Free-Tier (50 Monitors gratis, hat eigene Push-App für Alerts)
- **SMS-Provider:** **Twilio** mit AT-Nummer (~1 USD/Mo + 0.05 USD/SMS, ~5-10 €/Mo realistisch) — **nur für Critical-Alerts** wo alle Sites down sind und Inhaber sofort reagieren muss
- **Kein Slack** — Einzelinhaber-Setup, E-Mail + UptimeRobot-Push reichen für Important+Info. Bei Skalierung (Team ≥2) später Slack/PagerDuty hinzufügbar.

| Was | Tool | Alert-Schwelle | Empfänger |
|---|---|---|---|
| **Plattform-Uptime (instantpage.at)** | Cloudflare Health-Check + UptimeRobot Free | 2 Min Down | E-Mail + UptimeRobot-Push (App) |
| **Worker-Errors** (Generate, Webhooks) | Cloudflare Workers Logs | >5% Error-Rate über 10 Min | E-Mail Inhaber |
| **Subdomain-Health** (Kunden-Sites) | Eigener Cron `health-monitor.js` `[BAU]` | HTTP ≠ 2xx oder Render-Fehler | Activity-Log + auto-Ticket |
| **Supabase-DB** | Supabase Status-Page-Webhook | Down >5 Min | E-Mail Inhaber |
| **Anthropic-API-Quota** | eigener Counter in DB-Tabelle `[BAU]` | <20% verbleibend | E-Mail Inhaber, Generate-Endpoint pausieren |
| **Stripe-Webhooks** | Stripe-Dashboard + eigener Logger | Webhook-Fail >2x | E-Mail Inhaber |
| **Backup-Cron** | eigene Cron-Tabelle mit `last_success_at` | >30h kein Erfolg | E-Mail Inhaber |
| **Email-Versand (Resend)** | Resend-Bounce-Webhook | Bounce-Rate >2% | E-Mail Inhaber |
| **DNS für Custom-Domains** (Pro-Plan) | Cron prüft DNS-Records `[BAU]` | Domain unreachable | Auto-Mail an Kunden + Inhaber |

**`[BAU]`-Markierungen** = Cron-Jobs in `functions/cron/` müssen im Live-Bau angelegt werden (siehe `MIGRATION-PLAN.md` Phase 3).

### 9.2 Logs

| Log | Quelle | Retention | Zugriff |
|---|---|---|---|
| **Cloudflare Workers Logs** | CF-Dashboard + Logpush nach R2 | 30 Tage Logpush | Inhaber via Dashboard |
| **Activity-Log** (App-Events) | Postgres-Tabelle `activity_log` | 24 Monate (DSGVO) | Inhaber via Admin-UI |
| **Supabase DB-Logs** | Supabase-Dashboard | 7 Tage Free / 30 Tage Pro | Inhaber via Dashboard |
| **Stripe-Logs** | Stripe-Dashboard | unbegrenzt (Stripe-Side) | Inhaber via Dashboard |
| **Resend-Logs** | Resend-Dashboard | 90 Tage | Inhaber via Dashboard |
| **Webhook-Failures** (eigene Tabelle) | Postgres `webhook_log` | 90 Tage | Auto-Retry + Admin-UI |

**Logging-Konvention:** Keine PII (Klarnamen, E-Mails, Telefonnummern) im Cloudflare-Worker-Log — diese gehören in `activity_log` mit User-ID statt Klartext (Datenschutz).

### 9.3 Dashboards

Ein einziges **Admin-Dashboard** (`/admin?key=...`) bündelt:
- Aktive Subdomains (Status-Verteilung: trial / live / offline / failed)
- Letzte 50 Activity-Log-Einträge
- Health-Monitor-Status pro Kunde
- Backup-Cron-Status (last_success, retention)
- Anthropic-API-Quota-Counter
- Offene Support-Tickets

→ existiert teilweise im Beta-Prototyp, wird im Live-Bau erweitert.

### 9.4 Alert-Routing

```
CRITICAL — alle Sites down, Inhaber muss SOFORT reagieren
  Trigger: Plattform-Uptime >2 Min Down · Supabase-DB Down >5 Min ·
           Backup-Cron >48h kein Erfolg · Anthropic-Quota <10%
  → SMS an Inhaber-Privatnummer (via Twilio)
  → E-Mail an Inhaber-Geschäftsadresse
  → UptimeRobot-Push-Notification (Smartphone)
  → Status-Banner auf instantpage.at automatisch

IMPORTANT — Funktion beeinträchtigt, Reaktion innerhalb Werktag
  Trigger: Worker-Errors >5% · Stripe-Webhook-Fail >2x · Custom-Domain-Down ·
           Anthropic-Quota <20% · Backup-Cron >30h
  → E-Mail an Inhaber-Geschäftsadresse
  → UptimeRobot-Push-Notification

INFO — einzelne Vorfälle, tägliche Sichtung reicht
  Trigger: einzelne Subdomain-Failures · Bounce-Spike · Auth-Fehler
  → Auto-Ticket in Activity-Log
  → tägliche Zusammenfassung per E-Mail (07:00)
```

**Schwellwert-Logik für SMS:** SMS nur wenn **alle Sites betroffen** sind (Plattform-Layer). Einzelne Subdomain-Failures lösen KEINE SMS aus — die kommen oft (Custom-Domain DNS, Foto-Upload-Konflikt) und würden den Inbox-Wert untergraben.

**Skalierungs-Pfad:** Bei Wachstum (Team ≥2 Personen) Migration auf PagerDuty oder Slack-#ops mit On-Call-Rotation. SMS-Routing dann an Pikett-Person.

### 9.5 Pflicht-Checks vor jedem Deploy

Vor `wrangler pages deploy` zur Production:
1. **Build-Test grün** (`CI=true npm run build`)
2. **Smoke-Test grün** (Login + 1 Demo-Site rendern)
3. **Migrations-Diff geprüft** (keine destruktiven DB-Änderungen)
4. **Manueller Cloudflare-Deploy-Schritt** (kein Auto-Deploy aus `main` ohne Approval)
5. **Rollback-Plan** (vorherige Version-ID notiert für `wrangler rollback`)

---

## Verbindung zu anderen Dokumenten

- `LIVE-COMPLIANCE.md` — Notice-and-Takedown, Datenpannen, Self-Check (Detail)
- `ARCHITECTURE.md` — Backup-Setup
- `MIGRATION-PLAN.md` — wann was gebaut wird

## Verbindung zu Memory

- `project_production_refactor.md` — Customer-Support-Layer-Plan
- `project_naechste_session_agenda.md` — operative TODOs
