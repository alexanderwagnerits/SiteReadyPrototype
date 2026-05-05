# instantpage.at — Design System Preview

Dieser Ordner ist der Code-Upload fuer Claude Design "Set up your design system".

## Inhalt

| Datei | Zweck |
|---|---|
| `tokens.css` | Single Source of Truth — Farben, Typo, Spacing, Shapes, Motion |
| `index.html` | Visueller Showcase — Color Swatches, Type Specimens, Buttons, Cards, Hero-Beispiel |
| `README.md` | diese Datei |

## Verwendung in Claude Design

1. Im Setup unter "Link code from your computer" → **diesen Ordner** (`docs/_design/system-preview/`) draggen oder via "browse" auswaehlen
2. Claude Design parsed `index.html` + `tokens.css` und versteht damit Farben, Typo, Komponenten-Konventionen
3. Spaetere Projekte erben dieses System automatisch

## Stand

- 2026-05-05 — Greenfield-Vorschlag, Claude Design darf Akzentfarben-Varianten vorschlagen
- Nicht aus Prototyp uebernommen (Prototyp-Aesthetik bewusst nicht weitergetragen)
