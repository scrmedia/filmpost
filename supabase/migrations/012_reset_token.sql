-- ============================================================
-- FilmPost: Add password reset token columns to users table
-- Run in Supabase Dashboard → SQL Editor → New query
-- ============================================================

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS reset_token varchar,
  ADD COLUMN IF NOT EXISTS reset_token_created_at timestamptz;
