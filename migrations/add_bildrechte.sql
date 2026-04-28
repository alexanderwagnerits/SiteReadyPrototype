-- Bildrechte-Bestaetigung
-- Ausfuehren in Supabase SQL Editor

ALTER TABLE orders ADD COLUMN IF NOT EXISTS rechte_bestaetigt_at timestamptz DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS rechte_bestaetigt_ip text DEFAULT NULL;

-- rechte_bestaetigt_at: Timestamp der einmaligen Rechtsbestaetigung beim ersten Bild-Event.
--   NULL = noch nicht bestaetigt. Modal blockt Upload bis Klick.
-- rechte_bestaetigt_ip: IP-Adresse zum Zeitpunkt der Bestaetigung (Audit-Trail fuer §5 ECG / UrhG).
--
-- Pro-Bild-Credits werden additiv in bestehenden JSON-Strukturen ergaenzt (kein Schema-Change):
--   galerie[].credit            (pro Galerie-Bild)
--   team_members[].foto_credit  (pro Team-Person)
--   leistungen_fotos_credits    (neue jsonb-Map: leistung_name -> credit-text)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS leistungen_fotos_credits jsonb DEFAULT NULL;
