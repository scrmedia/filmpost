-- ============================================================
-- FilmPost: add missing columns to posts table
-- Run in Supabase SQL editor (Dashboard → SQL Editor → New query)
-- ============================================================

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS blog_content    text,
  ADD COLUMN IF NOT EXISTS yt_description  text,
  ADD COLUMN IF NOT EXISTS yt_url          varchar,
  ADD COLUMN IF NOT EXISTS status          varchar DEFAULT 'draft';
