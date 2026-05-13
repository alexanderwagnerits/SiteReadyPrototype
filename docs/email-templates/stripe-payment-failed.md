# Stripe Payment Failed — Card-Failed-Retry-Flow

**Trigger:** Stripe-Webhook `invoice.payment_failed` (Retry-Attempts-Counter in Stripe konfigurierbar)
**Absender:** rechnung@instantpage.at
**Reply-To:** rechnung@instantpage.at
**Versand:** Sofort nach Webhook-Eingang
**Retry-Flow:** Stripe versucht standardmaessig 4 Retries ueber 3 Wochen (Smart Retries). Diese Mail bei jedem Failed-Versuch, mit unterschiedlichem Ton je nach Retry-Nummer.

---

## Variablen

`{{ANREDE}}`, `{{FIRMENNAME}}`, `{{PLAN_NAME}}`, `{{BETRAG_BRUTTO}}`, `{{STRIPE_PORTAL_URL}}`, `{{NEXT_RETRY_DATE}}`, `{{RETRY_ATTEMPT}}`

---

## Subject (je nach Retry-Nummer)

**Retry 1 (erste fehlgeschlagene Zahlung):**
```
Zahlung fuer {{FIRMENNAME}} fehlgeschlagen
```

**Retry 2–3 (mittlere Versuche):**
```
Zahlung weiterhin offen — bitte Zahlungsmethode pruefen
```

**Retry 4 (letzter Versuch):**
```
Letzter Zahlungsversuch — Site droht zu pausieren
```

---

## Body (Plain) — Retry 1

```
{{ANREDE}},

die Abbuchung fuer {{FIRMENNAME}} (Plan {{PLAN_NAME}}, {{BETRAG_BRUTTO}})
ist fehlgeschlagen. Das passiert haeufiger als man denkt — meist eine
abgelaufene Karte oder ein temporaeres Limit der Bank.

Was zu tun ist:

  - Zahlungsmethode pruefen oder erneuern: {{STRIPE_PORTAL_URL}}
  - Wir versuchen die Abbuchung am {{NEXT_RETRY_DATE}} erneut

Bis dahin laeuft Ihre Site normal weiter. Erst wenn alle Retry-Versuche
fehlschlagen, pausieren wir die Site und melden uns nochmal persoenlich.

Fragen zur Rechnung: rechnung@instantpage.at

Beste Gruesse
Alexander Wagner
Wagner IT-Solutions e.U.

---
Rechnungs-Support: rechnung@instantpage.at
Portal: {{PORTAL_URL}}

Wagner IT-Solutions e.U. · FN 609574h · 1220 Wien · instantpage.at
Sie erhalten diese E-Mail als aktiver Kunde von instantpage.at.
Abmelden von Lifecycle-Mails ist nicht moeglich (Vertragsbestandteil).
Newsletter abmelden: news@instantpage.at
```

---

## Body (Plain) — Retry 4 (letzter Versuch)

```
{{ANREDE}},

dies ist der letzte automatische Versuch — die {{RETRY_ATTEMPT}}.
fehlgeschlagene Abbuchung fuer {{FIRMENNAME}} ({{BETRAG_BRUTTO}}).

Wenn die naechste Abbuchung am {{NEXT_RETRY_DATE}} ebenfalls fehlschlaegt,
pausieren wir die Site. Daten bleiben 30 Tage erhalten — die Site geht
sofort wieder online, sobald eine gueltige Zahlungsmethode hinterlegt ist.

Zahlungsmethode aktualisieren: {{STRIPE_PORTAL_URL}}

Falls es ein Problem gibt, das wir loesen koennen (z. B. SEPA-Lastschrift
statt Karte): einfach auf diese Mail antworten.

Beste Gruesse
Alexander Wagner
Wagner IT-Solutions e.U.

---
Rechnungs-Support: rechnung@instantpage.at
Portal: {{PORTAL_URL}}

Wagner IT-Solutions e.U. · FN 609574h · 1220 Wien · instantpage.at
Sie erhalten diese E-Mail als aktiver Kunde von instantpage.at.
Abmelden von Lifecycle-Mails ist nicht moeglich (Vertragsbestandteil).
Newsletter abmelden: news@instantpage.at
```

---

## Anmerkungen

- **„Passiert haeufiger als man denkt"** im Retry 1 — entdramatisiert, Kunde fuehlt sich nicht peinlich beruehrt.
- **Stripe Smart Retries:** Standardmaessig 4 Versuche ueber 3 Wochen. Bei Live-Setup in Stripe konfigurieren, ob Days 1, 3, 5, 7 oder Smart-Retries (Stripe-Algorithmus). Empfehlung: **Smart Retries** — Stripe weiss aufgrund Card-Issuer-Patterns, wann die Erfolgsrate am hoechsten ist.
- **„Letzter Versuch"-Mail** persoenlicher Ton, weil Kunde bereits 3x ignoriert hat — direkte Ansprache + Loesungs-Angebot (SEPA-Lastschrift) bringt Conversion zurueck.
- **Pausierung folgt der gleichen Grace-Logik** wie Trial-End (siehe `trial-end-grace.md`) — 30 Tage Reaktivierung, dann Soft-Delete.
- **Anwalt-Audit-Punkt:** Wording „pausieren" vs „kuendigen" — FAGG-relevant. Empfehlung: „pausieren" ist neutraler und gibt Kunden Reaktivierungs-Chance, AGB sollte das so abbilden.
