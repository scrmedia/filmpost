-- ============================================================
-- FilmPost: Add post_type and target_keyword to posts table
-- Run in Supabase Dashboard → SQL Editor → New query
-- ============================================================

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS post_type varchar DEFAULT 'standard',  -- 'standard' | 'roundup'
  ADD COLUMN IF NOT EXISTS target_keyword varchar;
