# RechtGPT — Recherche-Anfragen (Bau-Phase)

Sammelort fuer Klausel-/Rechtsfragen waehrend des Bau-Bezugs der Compliance-Dokumente.

## Workflow

1. **Claude** traegt waehrend des Baus fokussierte Anfragen unten ein (1 Block pro Frage)
2. **User** kopiert die Frage einzeln in <https://rechtgpt.at> (Web-UI)
3. **User** kopiert die Antwort + Quellen zurueck in [`rechtgpt-answers.md`](rechtgpt-answers.md) unter passender ID
4. **Claude** liest Antworten und baut weiter

## Format pro Anfrage

```
### Q-XX — [Kurzer Titel]

**Kontext:** [Was wird gerade gebaut, welche Klausel/welches Dokument]

**Frage an RechtGPT:**
[Praezise Frage, gerne mit Klausel-Entwurf zum Pruefen]

**Gewuenschtes Output-Format:**
- Konkrete Bewertung (haltbar/heikel/nichtig)
- Relevante Paragrafen mit Quellenangabe
- OGH-Entscheidungen wenn vorhanden
- Verbesserungsvorschlag wenn noetig

**Status:** offen | beantwortet | obsolet
```

## Limit

- **Starter-Plan: 50 Queries/Monat** — wir budgetieren 10-20 grosse fokussierte Queries fuer den ganzen Bau
- Lieber **wenige fokussierte Queries** als viele Mikro-Fragen — bessere Antwortqualitaet, klarere Quellen

## Anfragen

<!-- Claude fuegt hier waehrend des Baus Anfragen ein, fortlaufend nummeriert Q-01, Q-02, ... -->
