-- ============================================================
-- FilmPost: Add featured_post_ids to posts table
-- Stores the UUIDs of posts featured in an area roundup post.
-- Run in Supabase Dashboard → SQL Editor → New query
-- ============================================================

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS featured_post_ids uuid[];
