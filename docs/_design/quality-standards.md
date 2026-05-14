# Quality-Standards — instantpage.at

> **Block D.13** aus `DESIGN-VISION.md`. Messbare Quality-Gates fuer Kundenseiten + Plattform. Enforced vom `design-reviewer` Subagent (siehe `project_dev_subagents_idea.md`).

**Stand:** 2026-05-14 — `[FERTIG]` Schwellen + Tooling + Pflicht-Checks final. Lebt mit dem Bau (Schwellen-Justierungen vierteljaehrlich, siehe § 9).

**Beschluss 2026-05-10:** Solo-Bau ohne externen Designer = strenge messbare Quality-Gates Pflicht. Manuell durch-„fuehlen" reicht nicht.

---

## 1. Performance (Lighthouse Mobile)

| Metrik | Mindest | Ziel | Messmethode |
|---|---|---|---|
| Performance-Score | ≥ 85 | ≥ 90 | Lighthouse-CI (real-mobile-throttle, 4G) |
| FCP (First Contentful Paint) | < 2.0s | < 1.8s | Lighthouse |
| LCP (Largest Contentful Paint) | < 3.0s | < 2.5s | Lighthouse |
| CLS (Cumulative Layout Shift) | < 0.15 | < 0.1 | Lighthouse |
| TBT (Total Blocking Time) | < 250ms | < 200ms | Lighthouse |
| Accessibility-Score | ≥ 90 | ≥ 95 | Lighthouse |
| Best Practices | ≥ 95 | 100 | Lighthouse |
| SEO | ≥ 95 | 100 | Lighthouse |

**Hard-Block:** Recipes mit Performance < 85 oder Accessibility < 90 duerfen nicht produktiv geschaltet werden.

**Tooling:** Lighthouse-CI in GitHub Actions auf 3 Sample-Recipes (Klassisch + Edel + Rustikal) pro PR. Siehe `DESIGN-VISION.md` § 14.5.

---

## 2. Accessibility (WCAG AA)

| Bereich | Regel |
|---|---|
| Color-Contrast | Body-Text ≥ 4.5:1, Large-Text (≥ 24px) ≥ 3.0:1 |
| Touch-Targets | Mobile ≥ 44px × 44px (interaktive Elemente) |
| Heading-Hierarchie | Strikt: H1 → H2 → H3 (kein H1 → H3 ohne H2) |
| ARIA | Icon-only-Buttons brauchen `aria-label`. Form-Inputs immer `<label>`. |
| Alt-Text | Alle `<img>` mit aussagekraeftigem `alt`-Attribut, dekorative mit `alt=""`. |
| Focus-Visible | Sichtbare Fokus-Ringe, nicht ausgeblendet |
| Reduced-Motion | `prefers-reduced-motion` respektiert (Animationen aus) |

**Tooling:** axe-core in Vitest + Playwright. Pre-Commit-Hook + CI-Gate.

**WCAG-AAA NICHT zwingend** auch fuer Recht/Medical — siehe DESIGN-VISION § 14.6 Begruendung (BGStG-marktueblich, punktuell AAA statt global).

---

## 3. Visual-Polish (design-reviewer Subagent)

| Bereich | Regel |
|---|---|
| Token-Konsistenz | Keine Hard-Coded Hex ausserhalb `themes.md`. Spacing nur via Spacing-Tokens. |
| Section-Komposition | Nur Sections aus `recipe-konfiguration.md` Section-Pool. Keine erfundenen Sektionen. |
| Anti-AI-Generic | Keine Pink-Lila-Gradient-BGs. Keine Stockfoto-Klischees. Keine 3+ Akzentfarben gleichzeitig. Verbotene Floskeln in `references/<berufsgruppe>.md`. |
| Mobile-Verhalten | Galerie horizontaler Scroll-Snap statt Grid. Hero ≤ 100vh. Tabellen scroll-faehig. |
| Reference-DNA-Match | Recipe muss zur Berufsgruppe-Visual-DNA passen (`references/<berufsgruppe>.md`) |
| Whitespace-Rhythmus | Section-Padding Tokens-konform, kein „eng-gepacktes" Layout |

**Tooling:** `design-reviewer` Subagent (siehe `project_dev_subagents_idea.md` Block 5). Setup im Live-Bau Phase 0.

---

## 4. Content-Density (KI-Output-Qualitaet)

Min/Max-Werte pro Section. Verletzung triggert Re-Generation oder leeres Feld bleibt sichtbar im Portal als TODO.

| Section | Min Wortzahl | Max Wortzahl | Bemerkung |
|---|---|---|---|
| Hero-H1 | 3 | 12 | Kernbotschaft, kein Firmenname |
| Hero-Sub | 12 | 30 | 80–160 Zeichen |
| Leistungen-Item-Titel | 1 | 5 | |
| Leistungen-Item-Text | 30 | 80 | Pro Item |
| Ueber | 80 | 250 | Pro Absatz, max 2 Absaetze |
| Bewertungen-Quote | 15 | 60 | Pro Zitat |
| FAQ-Frage | 5 | 15 | |
| FAQ-Antwort | 30 | 120 | |
| CTA-Block-Headline | 3 | 8 | |
| Standorte-Beschreibung | 20 | 80 | Pro Standort |
| Galerie-Bildunterschrift | 3 | 12 | Optional, leer = kein Hard-Block |
| Partner-Logo-Caption | 1 | 5 | Optional |
| Notdienst-Hinweis (wenn aktiv) | 8 | 30 | Branche-spezifisch (Anwalt/Medical) |
| Sprechzeiten (wenn aktiv) | 1 | 20 | Strukturierte Daten, freie Notizen optional |

**Hard-Block:** Hero-H1 leer = Recipe nicht produktiv schaltbar.

**Soft-Trigger:** Wenn 2+ Sections unter Min-Wortzahl → KI-Re-Generation mit angepasstem Prompt (max 2 Retries).

---

## 5. Quality-Score (KI-Generation)

Bestehender `quality_score` 0–100 im Prototyp wird auf Live uebernommen mit definierten Schwellen:

| Score | Verhalten |
|---|---|
| ≥ 80 | Recipe produktiv schalten — alles OK |
| 70–79 | Soft-Warning, Admin-Review wenn ≥ 3 Faelle pro Tag |
| 50–69 | Auto-Retry mit angepasstem Prompt (max 2 Retries) |
| < 50 | Hard-Block, Admin-Alarm + Onboarding-Recovery-Email |

**Berechnung:** Memory `project_recipe_system_v1.md` und `PRODUCT.md` § 3.4 — Score-Formel kombiniert Content-Density-Erfuellung + Anti-AI-Generic-Pruefungen + Schema-Konsistenz.

---

## 6. Branchen-spezifische Profile

Manche Berufsgruppen brauchen strengere Schwellen:

| Berufsgruppe | Score-Min | Begruendung |
|---|---|---|
| Recht & Finanz | ≥ 85 | Reglementiert, Wording kritisch (siehe LIVE-COMPLIANCE § 10) |
| Gesundheit (Medical) | ≥ 85 | Heilberufe, kein Heilversprechen |
| Architektur & Planung | ≥ 80 | Premium-Anspruch |
| Bestattung *(Phase 2)* | ≥ 85 | Sensitiver Tonalitaets-Bereich |
| Sonstige | ≥ 70 | Default |

---

## 7. Pflicht-Checks vor Live-Recipe-Release

Pro neuem oder geaendertem Recipe vor produktiver Schaltung:

1. ✅ Lighthouse mobile ≥ 90 in 4 Kategorien
2. ✅ Accessibility WCAG AA via axe-core
3. ✅ design-reviewer-Subagent PASS
4. ✅ Cross-Browser-Test (Safari + Chrome + Firefox)
5. ✅ Beta-Test mit ≥ 3 echten Kunden der Berufsgruppe (oder Test-Sites)
6. ✅ Reference-Library-File fuer Berufsgruppe existiert + ist gefuellt
7. ✅ Skill-Prompt + Reference-Set-Input nachvollziehbar (in PR oder Code-Kommentar)

---

## 8. Eskalations-Pfad (temporaere Underperformance)

Wenn eine Live-Recipe nach Schaltung unter eine Schwelle faellt (z.B. Performance < 85 nach Library-Update):

| Underperformance | Reaktion | Frist |
|---|---|---|
| Performance 80–84 | Soft-Warning im Admin-Dashboard, Fix bei naechster Release-Iteration | 2 Wochen |
| Performance 70–79 | Hard-Warning + Inhaber-Mail, neue Site-Generations dieser Recipe gestoppt | 1 Woche |
| Performance < 70 | Sofort: Recipe deaktiviert fuer neue Sites, Bestands-Sites bleiben live mit Hinweis | sofort |
| Accessibility < 90 | Sofort: Hard-Block fuer neue Generations, Bestands-Sites mit Banner-Hinweis im Admin | 1 Woche |

**Entscheidungs-Verantwortlich:** Inhaber. design-reviewer-Subagent loggt, Auto-Deaktivierung nur bei < 70.

---

## 9. Review-Cadence

Quality-Standards-Doku wird **quartalsweise** reviewed (Self-Check vierteljaehrlich, siehe `OPERATIONS.md` § 7):

- Schwellen-Justierungen wenn Lighthouse-Verbesserungen den Markt-Standard heben
- WCAG-Version-Updates (aktuell WCAG 2.2, naechste Major-Version 3.0 wird Bewertungsmodell aendern)
- Branchen-Profile bei neuen reglementierten Branchen oder LIVE-COMPLIANCE-Updates
- Content-Density-Tabelle bei neuen Section-Typen

Erste Review: Q1/2027 (3 Monate nach Live-Schaltung).

---

## 10. Connection

- `DESIGN-VISION.md` § 13 — Pointer hierher
- `DESIGN-VISION.md` § 14 — Tool-Stack (Lighthouse-CI, axe-core, Chromatic, Storybook)
- `LIVE-COMPLIANCE.md` § 10 — Reglementierte Berufe (Branchen-Profile)
- `OPERATIONS.md` § 7 — Self-Check vierteljaehrlich (Review-Cadence)
- `PRODUCT.md` § 3.4 — Quality-Score-Schwellen
- `project_dev_subagents_idea.md` — design-reviewer Subagent-Spec
- `recipe-konfiguration.md` — Section-Pool (Visual-Polish-Regel)
- `references/<berufsgruppe>.md` — Reference-DNA-Match
