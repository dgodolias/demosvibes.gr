-- Evidence that a visitor read and accepted an article disclaimer before its
-- protected content was served. Additive: subscribers are untouched. Rows are
-- not linked to subscriber emails because the browser never stores the email.
CREATE TABLE IF NOT EXISTS public.disclaimer_acceptances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  disclaimer text NOT NULL,
  version text NOT NULL,
  accepted boolean NOT NULL CHECK (accepted = true),
  accepted_at timestamptz NOT NULL DEFAULT now(),
  ip inet,
  user_agent text,
  referrer text,
  CONSTRAINT disclaimer_acceptances_disclaimer_format CHECK (disclaimer ~ '^[a-z0-9-]{1,64}$'),
  CONSTRAINT disclaimer_acceptances_version_length CHECK (char_length(version) BETWEEN 1 AND 64),
  CONSTRAINT disclaimer_acceptances_ip_host_address
    CHECK (ip IS NULL OR masklen(ip) = CASE family(ip) WHEN 4 THEN 32 ELSE 128 END),
  CONSTRAINT disclaimer_acceptances_user_agent_length CHECK (user_agent IS NULL OR char_length(user_agent) <= 2048),
  CONSTRAINT disclaimer_acceptances_referrer_length CHECK (referrer IS NULL OR char_length(referrer) <= 4096)
);

CREATE INDEX IF NOT EXISTS disclaimer_acceptances_disclaimer_accepted_at
  ON public.disclaimer_acceptances (disclaimer, accepted_at);

REVOKE ALL ON TABLE public.disclaimer_acceptances FROM PUBLIC;

-- The runtime API records acceptances and later confirms a stored acceptance id.
-- It never updates, deletes or lists request metadata.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'demosvibes_api') THEN
    GRANT INSERT (disclaimer, version, accepted, ip, user_agent, referrer)
      ON public.disclaimer_acceptances TO demosvibes_api;
    GRANT SELECT (id, disclaimer, version) ON public.disclaimer_acceptances TO demosvibes_api;
  END IF;
END;
$$;
