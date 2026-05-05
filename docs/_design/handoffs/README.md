# Claude Design — Handoff-Bundles

Hier landen die exportierten Handoff-Bundles aus Claude Design.

## Ordner-Konvention

`{projekt-slug}-iteration-{N}/`

Beispiele:
- `landing-iteration-1/`
- `landing-iteration-2/`
- `pricing-page-iteration-1/`
- `portal-dashboard-iteration-1/`

## Workflow

1. In Claude Design Iteration abschliessen
2. **Export → "Send to Claude Code"** (oder Download als .zip)
3. Bundle in einen neuen Ordner unter diesem Pfad legen
4. Mir Bescheid geben mit Pfad — ich lese Bundle, pruefe gegen Briefing + system-preview, setze in Production-Code um

## Was im Bundle erwartet wird

- `spec.json` oder aehnliches (component-tree, design-tokens, layout-spec)
- Asset-Files (Bilder, Icons)
- HTML-Preview falls vorhanden
- Implementation-Notes von Claude Design

## Nach erfolgreichem Production-Bau

Bundle bleibt im Repo als Referenz / fuer spaetere Iterationen.
Kann nach 30 Tagen archiviert werden in `_archive/handoffs/`.
