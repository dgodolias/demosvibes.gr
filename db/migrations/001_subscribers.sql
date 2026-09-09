-- Run once against the server-side Neon database before enabling /api/subscribe.
-- CSV imports normalize email with lower(btrim(email)), retain the earliest
-- created_at per address, and use source = 'netlify-import'.
CREATE TABLE IF NOT EXISTS public.subscribers (
  email text PRIMARY KEY,
  consent boolean NOT NULL CHECK (consent = true),
  created_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL DEFAULT 'website',
  source_path text,
  CONSTRAINT subscribers_email_normalized CHECK (
    email = lower(btrim(email)) AND char_length(email) BETWEEN 3 AND 254
  ),
  CONSTRAINT subscribers_source_length CHECK (char_length(source) BETWEEN 1 AND 40),
  CONSTRAINT subscribers_source_path CHECK (
    source_path IS NULL OR (
      char_length(source_path) <= 500
      AND source_path LIKE '/%'
      AND source_path NOT LIKE '//%'
      AND position('?' IN source_path) = 0
      AND position('#' IN source_path) = 0
    )
  )
);

-- No browser/data API receives table access. Only the server's database role
-- and authorized maintenance/import tooling may access this table.
REVOKE ALL ON TABLE public.subscribers FROM PUBLIC;
