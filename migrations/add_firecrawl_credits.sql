-- Firecrawl Credits Tracking
-- Speichert wie viele Firecrawl-Credits pro Import verbraucht wurden
ALTER TABLE orders ADD COLUMN IF NOT EXISTS firecrawl_credits INTEGER DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS import_cost_eur NUMERIC(6,4) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS import_tokens_in INTEGER DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS import_tokens_out INTEGER DEFAULT 0;
