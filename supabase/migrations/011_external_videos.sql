-- ============================================================
-- FilmPost: Add external_videos to posts table
-- Run in Supabase Dashboard → SQL Editor → New query
-- ============================================================

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS external_videos jsonb DEFAULT '[]'::jsonb;

-- Stores an array of { ytUrl, videoId, venueName, notes } objects
-- for YouTube videos added manually to roundup posts that are not
-- in the user's FilmPost history.
