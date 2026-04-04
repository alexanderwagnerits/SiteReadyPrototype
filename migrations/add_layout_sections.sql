-- Section-Varianten & neue Sections
-- Ausfuehren in Supabase SQL Editor

ALTER TABLE orders ADD COLUMN IF NOT EXISTS layout text DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS faq jsonb DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS galerie jsonb DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS fakten jsonb DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS partner jsonb DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS sections_visible jsonb DEFAULT NULL;

-- layout: "standard" | "kompakt" | "ausfuehrlich" (null = standard)
-- faq: [{frage: "...", antwort: "..."}]
-- galerie: [{url: "...", caption: "..."}]
-- fakten: [{zahl: "15+", label: "Jahre Erfahrung"}]
-- partner: [{url_logo: "...", name: "..."}]
-- sections_visible: {faq: true, galerie: false, fakten: false, partner: false}
