-- ============================================================
-- FilmPost: Add video_source to posts table
-- Run in Supabase Dashboard → SQL Editor → New query
-- ============================================================

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS video_source varchar DEFAULT 'uploaded';  -- 'uploaded' | 'existing'
