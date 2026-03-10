-- ============================================================
-- FilmPost: blog post version history
-- Run in Supabase SQL editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- ── posts: blog version history ─────────────────────────────
-- Stores an ordered array of accepted versions:
-- [{ "v": 1, "content": "<html>...", "saved_at": "ISO8601" }, ...]
-- blog_content remains the currently active version.
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS blog_versions jsonb NOT NULL DEFAULT '[]'::jsonb;
