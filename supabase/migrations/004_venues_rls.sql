-- ============================================================
-- FilmPost: Row Level Security for venues table
-- Run in Supabase SQL editor (Dashboard → SQL Editor → New query)
-- ============================================================
--
-- IMPORTANT — custom auth caveat:
-- This app uses custom email/password auth, not Supabase Auth.
-- Requests from the browser use the anon key with no active
-- Supabase session, so auth.uid() returns null for all of them.
--
-- These policies use auth.uid() to match the pattern on the
-- posts and users tables. If those tables are working correctly
-- with auth.uid()-based policies, then this will too.
--
-- If inserts or reads on venues start failing after running this,
-- check whether posts/users have RLS enabled in the Supabase
-- dashboard (Authentication → Policies). If those tables are
-- unrestricted (RLS off), this migration will lock venues
-- tighter than the other tables — which may not be what you want.
--
-- The safe alternative (matching truly unrestricted tables) is
-- to enable RLS but add a permissive anon policy:
--   USING (true) WITH CHECK (true)
-- and rely on application-level user_id filtering in queries.
-- ============================================================

ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

-- ── SELECT: users can only read their own venues ─────────────
CREATE POLICY "venues_select_own"
  ON venues
  FOR SELECT
  USING (user_id = auth.uid());

-- ── INSERT: users can only insert rows for themselves ────────
CREATE POLICY "venues_insert_own"
  ON venues
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ── UPDATE: users can only update their own venues ───────────
CREATE POLICY "venues_update_own"
  ON venues
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── DELETE: users can only delete their own venues ───────────
CREATE POLICY "venues_delete_own"
  ON venues
  FOR DELETE
  USING (user_id = auth.uid());
