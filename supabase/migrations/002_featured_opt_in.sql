-- ============================================================
-- FilmPost: featured opt-in for homepage background video
-- Run in Supabase SQL editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- ── users: community visibility opt-in ──────────────────────
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS featured_opt_in boolean NOT NULL DEFAULT false;
