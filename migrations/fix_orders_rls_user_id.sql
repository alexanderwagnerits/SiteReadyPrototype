-- Fix: RLS-Policies auf orders von auth.email() = email auf auth.uid() = user_id umstellen
--
-- Grund: Wenn Login-E-Mail (Auth) != Firmen-E-Mail (Fragebogen), blockierte die bisherige
-- Policy (auth.email() = email) das SELECT/UPDATE — User landete in endlosem
-- "Bestellung wird geladen..." im Portal, obwohl die Order existierte und user_id
-- korrekt gesetzt war.
--
-- Fix: auth.uid() = user_id matcht garantiert, da user_id beim Insert aus dem
-- signUp-Response stammt. Backfill stellt sicher, dass alte Orders ohne user_id
-- nicht verwaist sind.
--
-- WICHTIG: Vor dem Ausfuehren im Supabase SQL-Editor pruefen, ob die alten
-- Policy-Namen mit denen hier uebereinstimmen. Falls nicht, die DROP-Statements
-- entsprechend anpassen.

-- 1. Backfill: user_id aus auth.users via email setzen (falls noch null)
UPDATE orders o
SET user_id = u.id
FROM auth.users u
WHERE o.user_id IS NULL
  AND o.email IS NOT NULL
  AND lower(o.email) = lower(u.email);

-- 2. Alte Policies loeschen (beide Namensvarianten abdecken)
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "select_own_orders" ON orders;
DROP POLICY IF EXISTS "update_own_orders" ON orders;
DROP POLICY IF EXISTS "insert_own_orders" ON orders;
DROP POLICY IF EXISTS "Enable read access for own email" ON orders;
DROP POLICY IF EXISTS "Enable update for own email" ON orders;
DROP POLICY IF EXISTS "Enable insert for own email" ON orders;

-- 3. Neue Policies auf user_id basierend
CREATE POLICY "select_own_orders" ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "update_own_orders" ON orders
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- INSERT: user_id muss auf den aktuell angemeldeten User zeigen
CREATE POLICY "insert_own_orders" ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
