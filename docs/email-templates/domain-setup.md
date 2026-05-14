# Domain-Setup — eigene Domain einrichten

**Trigger:** Pro-Plan-Kunde traegt im Portal eine eigene Domain ein (z.B. `tischlerei-pichler.at`). Mail versendet die DNS-Anleitung. Verifikation laeuft danach automatisch per Cron (`docs/OPERATIONS.md` § 9).
**Absender:** info@instantpage.at
**Reply-To:** support@instantpage.at
**Versand:** Sofort nach Domain-Eintrag im Portal

---

## Variablen

`{{VORNAME}}`, `{{NACHNAME}}`, `{{FIRMENNAME}}`, `{{CUSTOM_DOMAIN}}`, `{{SUBDOMAIN}}`, `{{SITE_URL}}`, `{{PORTAL_URL}}`

**Datums-Logik:**
- `{{CUSTOM_DOMAIN}}` = vom Kunden im Portal eingetragene Domain (z.B. `tischlerei-pichler.at`)
- `{{SUBDOMAIN}}` = Subdomain ohne `.instantpage.at`-Suffix (z.B. `tischlerei-pichler`)
- `{{SITE_URL}}` = bestehende Subdomain-URL, bleibt parallel erreichbar

---

## Subject

```
Eigene Domain einrichten: {{CUSTOM_DOMAIN}}
```

---

## Body (Plain)

```
Guten Tag {{VORNAME}} {{NACHNAME}},

Sie moechten {{CUSTOM_DOMAIN}} mit Ihrer Website verbinden. Bitte
hinterlegen Sie dazu die folgenden DNS-Eintraege bei Ihrem
Domain-Provider:

  Typ:    CNAME
  Name:   www
  Wert:   {{SUBDOMAIN}}.instantpage.at

  Typ:    A
  Name:   @  (oder leer fuer die Hauptdomain)
  Werte:  104.21.0.0
          172.67.0.0

Sobald die DNS-Eintraege aktiv sind, verifizieren wir die Domain
automatisch und schalten sie frei. Das dauert in der Regel 1 bis
24 Stunden, abhaengig von Ihrem Domain-Provider.

Sie sehen den aktuellen Status im Portal:
  {{PORTAL_URL}}/domain

Bis zur Aktivierung ist Ihre Website weiterhin unter {{SITE_URL}}
erreichbar.

Bei Fragen zur DNS-Konfiguration erreichen Sie uns unter
support@instantpage.at. Eine bezahlte Einrichtungs-Hilfe koennen
Sie ueber {{PORTAL_URL}}/domain optional dazubuchen.

Mit freundlichen Gruessen
Ihr Instantpage.at-Team

---
Instantpage.at · support@instantpage.at
Impressum: instantpage.at/impressum · Datenschutz: instantpage.at/datenschutz
```

---

## Anmerkungen

- **DNS-Verantwortung beim Kunden** — entspricht der Entscheidung in `LIVE-COMPLIANCE.md` § 1 #12 („DNS allein Kunde + ausfuehrliche Anleitung"). Mail ist Anleitung, kein aktiver Eingriff.
- **A-Record-Werte sind Platzhalter** — die echten Cloudflare-Custom-Hostname-IPs werden im Live-Bau anhand der Cloudflare-for-SaaS-Doku eingetragen (`docs/MIGRATION-PLAN.md` § 4 Custom Hostnames). Vor Live-Schaltung verifizieren.
- **CNAME `www` + A-Record `@`** statt nur CNAME, weil viele AT-Domain-Provider (z.B. easyname, World4You) CNAME auf Apex-Domains nicht erlauben. A-Record ist universell.
- **Verifikation automatisch** — Cron prueft DNS-Records (`OPERATIONS.md` § 9, Status `[BAU]` fuer Live). Kein manueller Support-Eingriff noetig im Normalfall.
- **Site-URL bleibt parallel** — Subdomain wird beim Custom-Domain-Wechsel **nicht** abgeschaltet (301-Redirect-Logik im Live-Bau). Schuetzt vor Linkrot in der Uebergangsphase.
- **Optionaler Einrichtungs-Service als Addon** — siehe `LIVE-COMPLIANCE.md` § 1 #12. Nicht aktiv beworben, nur als Notausgang verlinkt.
- **Anwalts-Audit-Punkt (gering):** keine Garantie-Aussage zur Verfuegbarkeit der Domain. „In der Regel 1 bis 24 Stunden" ist defensiv formuliert.
