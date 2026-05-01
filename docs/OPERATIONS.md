# Operations — instantpage.at

> **Skeleton.** Wird befüllt während Phase 3 + 4 des Live-Bau (siehe `MIGRATION-PLAN.md`).

**Stand:** 2026-05-01 (Skeleton)

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
