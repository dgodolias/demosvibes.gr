-- Apply only after the deployed API and maintenance importer no longer use
-- these columns. Capture the authorized private backup before applying.
ALTER TABLE public.subscribers
  DROP COLUMN IF EXISTS source,
  DROP COLUMN IF EXISTS source_path;
