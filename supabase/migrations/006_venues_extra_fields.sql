-- ============================================================
-- FilmPost: Add extra fields to venues table
-- Run in Supabase Dashboard → SQL Editor → New query
-- ============================================================

ALTER TABLE venues
  ADD COLUMN IF NOT EXISTS venue_type       varchar,
  ADD COLUMN IF NOT EXISTS capacity         varchar,
  ADD COLUMN IF NOT EXISTS indoor_outdoor   varchar DEFAULT 'both',
  ADD COLUMN IF NOT EXISTS filming_highlights text,
  ADD COLUMN IF NOT EXISTS general_notes    text,
  ADD COLUMN IF NOT EXISTS website_url      varchar;
