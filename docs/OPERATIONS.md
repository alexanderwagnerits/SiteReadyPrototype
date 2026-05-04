# Operations — instantpage.at

> **Skeleton.** Wird befüllt während Phase 3 + 4 des Live-Bau (siehe `MIGRATION-PLAN.md`).

**Stand:** 2026-05-04 (Skeleton)

---

## Status

`[SKELETON]` — Inhaltsverzeichnis steht. Operative Prozesse, Email-Templates und Support-FAQ werden parallel zum Live-Bau angelegt.

---

## Inhalt (geplant)

1. Incident-Response-Runbook
2. Email-Templates (Lifecycle)
3. Support-FAQ (Top 20)
4. Notice-and-Takedown-Prozess
5. Datenpannen-Meldeprozess
6. Backup-Restore-Verfahren
7. Self-Check vierteljährlich
8. Kunden-Onboarding-Playbook

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
- `stil_changed` / `look_changed` (actor: admin/user) — Design gewechselt
- `recipe_changed` (actor: admin/user, Live) — Recipe gewechselt
- `anrede_changed` (actor: user, Live) — triggert Re-Gen mit Warnung

**Trial / Subscription:**
- `trial_started` (actor: system) — trial_expires_at gesetzt
- `trial_extended` (actor: admin) — +7d / +14d
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

`[OFFEN]` — vor Live-Schaltung als Markdown-Vorlagen erstellen. Provider: Resend / Postmark (`[OFFEN]`).

| Template | Trigger | Inhalt |
|---|---|---|
| **Welcome** | nach erstem Login | Begrüßung, Portal-Link, Erste-Schritte-Tipps |
| **Trial-Reminder** | T-3 Tage vor Trial-Ende | "Dein Trial läuft in 3 Tagen ab — Plan wählen" |
| **Trial-Expired** | bei Trial-Ende ohne Plan | "Trial beendet — Plan jetzt wählen oder Daten in 30 Tagen gelöscht" |
| **Payment-Confirmation** | nach Stripe-Webhook `invoice.paid` | Rechnung beigefügt, nächster Abrechnungstermin |
| **Payment-Failed** | nach Stripe-Webhook `invoice.payment_failed` | Hinweis + Stripe-Customer-Portal-Link |
| **Cancellation-Confirmation** | nach Self-Service-Kündigung | Kündigungsbestätigung, Grace-Period-Hinweis, Daten-Export-Link |
| **Cancellation-Final** | T-1 Tag vor Daten-Löschung | Letzte Erinnerung Daten zu exportieren |
| **Domain-Setup-Anleitung** | bei Custom-Domain-Aktivierung (Pro) | DNS-Konfiguration Step-by-Step |
| **Datenpanne-Information** | bei DSGVO Art 34 Pflicht | Sachverhalt, betroffene Daten, getroffene Maßnahmen |
| **Beta-Cutover-Mail** | T-7 vor Live-Schaltung | "Wir sind umgezogen — Promo-Code für X Monate kostenlos" |

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

`[OFFEN]` — siehe `ARCHITECTURE.md` § 9 Backup + Recovery.

Konkrete Restore-Anleitung:

```bash
# 1. Letztes Backup aus R2 holen
wrangler r2 object get backups-instantpage/db-YYYY-MM-DD.sql.gz ./

# 2. In Staging-DB einspielen
gunzip db-YYYY-MM-DD.sql.gz
psql $STAGING_DB_URL < db-YYYY-MM-DD.sql

# 3. Smoke-Test
playwright test smoke

# 4. Wenn ok: in Production einspielen (vorsichtig!)
```

## 7. Self-Check vierteljährlich

→ vollständig in `LIVE-COMPLIANCE.md` § 19.

Erinnerung: per `/schedule`-Trigger automatisierbar.

## 8. Kunden-Onboarding-Playbook

`[OFFEN]` — interner Leitfaden bei manuellem Onboarding-Bedarf:

- Welche Daten der Kunde mindestens braucht
- Welche Branchen-Pflichtfelder bei reglementiertem Beruf
- Erste-Hilfe bei Stuck-Pending
- Wann Re-Generierung sinnvoll

---

## Verbindung zu anderen Dokumenten

- `LIVE-COMPLIANCE.md` — Notice-and-Takedown, Datenpannen, Self-Check (Detail)
- `ARCHITECTURE.md` — Backup-Setup
- `MIGRATION-PLAN.md` — wann was gebaut wird

## Verbindung zu Memory

- `project_production_refactor.md` — Customer-Support-Layer-Plan
- `project_naechste_session_agenda.md` — operative TODOs
