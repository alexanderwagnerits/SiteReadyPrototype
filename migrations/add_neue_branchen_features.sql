-- 2026-04-17: Neue Branchen-Features fuer Tourismus/Handel/Agrar
-- Zugehoerig zu Branchen-Ausbau in data.js (FT_TOURISMUS, FT_HANDEL, FT_AGRAR)
--
-- Ausfuehrung: Supabase Dashboard -> SQL Editor -> Query ausfuehren

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS fruehstueck BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS wlan BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS haustiere BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS online_shop BOOLEAN DEFAULT false;

-- Kurzbeschreibung fuer das Portal (Toggle-Labels):
-- fruehstueck: "Frühstück inklusive"
-- wlan:        "WLAN kostenlos"
-- haustiere:   "Haustiere willkommen"
-- online_shop: "Online-Shop verfügbar"
