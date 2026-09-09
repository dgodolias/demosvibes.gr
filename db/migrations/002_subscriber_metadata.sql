-- Preserve the historical Netlify metadata and capture the same fields for new
-- subscriptions. Nullable columns also support older or incomplete source rows.
ALTER TABLE public.subscribers
  ADD COLUMN IF NOT EXISTS ip inet,
  ADD COLUMN IF NOT EXISTS user_agent text,
  ADD COLUMN IF NOT EXISTS referrer text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.subscribers'::regclass
      AND conname = 'subscribers_ip_host_address'
  ) THEN
    ALTER TABLE public.subscribers ADD CONSTRAINT subscribers_ip_host_address
      CHECK (ip IS NULL OR masklen(ip) = CASE family(ip) WHEN 4 THEN 32 ELSE 128 END);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.subscribers'::regclass
      AND conname = 'subscribers_user_agent_length'
  ) THEN
    ALTER TABLE public.subscribers ADD CONSTRAINT subscribers_user_agent_length
      CHECK (user_agent IS NULL OR char_length(user_agent) <= 2048);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.subscribers'::regclass
      AND conname = 'subscribers_referrer_length'
  ) THEN
    ALTER TABLE public.subscribers ADD CONSTRAINT subscribers_referrer_length
      CHECK (referrer IS NULL OR char_length(referrer) <= 4096);
  END IF;
END;
$$;

-- Provision runtime INSERT privileges for these columns separately. Historical
-- metadata backfills use owner maintenance access, never the runtime API role.
