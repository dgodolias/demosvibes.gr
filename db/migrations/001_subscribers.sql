-- Run once against the server-side Neon database before enabling /api/subscribe.
-- CSV imports normalize email with lower(btrim(email)), retain the earliest
-- created_at per address, and preserve that complete historical event.
CREATE TABLE IF NOT EXISTS public.subscribers (
  email text PRIMARY KEY,
  consent boolean NOT NULL CHECK (consent = true),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT subscribers_email_normalized CHECK (
    email = lower(btrim(email)) AND char_length(email) BETWEEN 3 AND 254
  )
);

-- No browser/data API receives table access. Only the server's database role
-- and authorized maintenance/import tooling may access this table.
REVOKE ALL ON TABLE public.subscribers FROM PUBLIC;
