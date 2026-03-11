-- ============================================================
-- FilmPost: Add blog_template column to users table
-- Run in Supabase Dashboard → SQL Editor → New query
-- ============================================================

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS blog_template varchar;  -- 'standard' | 'film_suppliers' | null (= standard)
