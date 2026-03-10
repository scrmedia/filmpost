-- ============================================================
-- FilmPost schema additions
-- Run in Supabase SQL editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- ── users: content/publishing preferences ───────────────────
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS tone_of_voice  text,
  ADD COLUMN IF NOT EXISTS seo_plugin     varchar,   -- 'yoast' | 'rankmath' | 'aioseo' | null
  ADD COLUMN IF NOT EXISTS platform       varchar;   -- 'wordpress' | 'squarespace' | null

-- ── posts: SEO targeting ────────────────────────────────────
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS target_keyword  varchar,
  ADD COLUMN IF NOT EXISTS location        varchar;

-- ── venues: saved venue library ─────────────────────────────
CREATE TABLE IF NOT EXISTS venues (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  venue_name      varchar NOT NULL,
  location        varchar,
  style_notes     text,
  lighting_notes  text,
  prefill_data    jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Index for fast per-user lookups
CREATE INDEX IF NOT EXISTS venues_user_id_idx ON venues (user_id);
