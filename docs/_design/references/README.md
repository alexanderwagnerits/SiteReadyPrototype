# Reference-Library — Top-Referenzen pro Berufsgruppe

> **Layer 0 für Design-Skills.** Pro Berufsgruppe ein File mit kuratierten Top-Referenzen + Negativ-Beispielen + Style-Notes. Diese Files sind **Input für Skills** (`ui-ux-pro-max` + `anthropic-web-frontend-design`) und für `design-reviewer` Subagent.

## Zweck

1. **Skill-Input**: Wenn wir ein Recipe oder Section-Spec bauen, gibt der Skill bessere Outputs wenn er mit konkreten Top-Referenzen gefüttert wird statt generisch zu "designen".
2. **Anti-AI-Generic**: Negativ-Beispiele dokumentieren explizit was wir **nicht** wollen ("dieses generische Hero-Layout", "diese AI-typischen Gradient-BGs").
3. **Konsistenz**: design-reviewer Subagent prüft Recipes gegen die Reference-Set-DNA.
4. **Onboarding**: Bei späteren Designern/Mitarbeitern als Style-Briefing.

## Format pro File

```markdown
# {Berufsgruppe} — Reference-Set

## Top-Referenzen (5-8)

| # | URL | Look | Was hier richtig ist |
|---|---|---|---|
| 1 | https://example.com | Hero-Editorial | Klare Foto-Sprache, Whitespace-Rhythmus |

## Visual-DNA (was alle Top-Referenzen teilen)

- **Foto-Sprache**: ...
- **Typografie**: ...
- **Whitespace**: ...
- **Trust-Signale**: ...
- **Mobile-Verhalten**: ...

## Negativ-Beispiele (anti-pattern)

| Was vermeiden | Warum |
|---|---|

## Look-Mapping pro Sub-Variante

(Falls Berufsgruppe Sub-Varianten hat — welche Referenz entspricht welchem Look?)
```

## Quellen für Recherche

- **Awwwards** — Awarded Sites pro Branche
- **SiteInspire** — kuratierte Showcase
- **Tilda Templates** — Editorial-Premium-Niveau
- **Framer Templates** — Modern + Animation-stark
- **Wix Best Templates** — Mainstream-Maßstab
- **Squarespace Showcase** — solide Mainstream
- **Behance / Dribbble** — Designer-Portfolios mit Branchen-Tags

## Status der 14 Files

| # | Berufsgruppe | File | Status |
|---|---|---|---|
| 1 | Handwerk | [handwerk.md](handwerk.md) | `[BEISPIEL]` voll ausgefüllt |
| 2 | Bau & Sanierung | bau-sanierung.md | `[STUB]` |
| 3 | Gastro | gastro.md | `[STUB]` |
| 4 | Gesundheit | gesundheit.md | `[STUB]` |
| 5 | Recht & Finanz | recht-finanz.md | `[STUB]` |
| 6 | Beratung & Coaching | beratung-coaching.md | `[STUB]` |
| 7 | Architektur & Planung | architektur-planung.md | `[STUB]` |
| 8 | IT & Digital | it-digital.md | `[STUB]` |
| 9 | Bildung | bildung.md | `[STUB]` |
| 10 | Tourismus | tourismus.md | `[STUB]` |
| 11 | Handel | handel.md | `[STUB]` |
| 12 | Mobilität | mobilitaet.md | `[STUB]` |
| 13 | Agrar | agrar.md | `[STUB]` |
| 14 | Industrie | industrie.md | `[STUB]` |
| 15 | Kosmetik | kosmetik.md | `[STUB]` |
| 16 | Kultur | kultur.md | `[STUB]` |
| 17 | Sport & Wellness | sport-wellness.md | `[STUB]` |

## Workflow

1. **Bei Recipe-Bau-Start** für eine Berufsgruppe: zugehöriges Reference-File füllen (1-2h Web-Recherche, mit `WebFetch` und Skill-Unterstützung)
2. **Pro Recipe-Mockup** dann: Skill-Prompt mit Reference-Set-Inhalten + Token-Vorgaben + Section-Specs
3. **design-reviewer Subagent** prüft gegen Reference-DNA
