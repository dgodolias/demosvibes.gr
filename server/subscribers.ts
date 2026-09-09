import { neon } from '@neondatabase/serverless';

export interface Subscriber {
  email: string;
  consent: true;
  sourcePath: string | null;
}

export type SubscriberQuery = (statement: string, values: (string | null)[]) => Promise<Record<string, unknown>[]>;

const DATABASE_TIMEOUT_MS = 8_000;

/** Successful duplicates never modify the original consent date or provenance. */
export async function persistSubscriber(subscriber: Subscriber, query: SubscriberQuery): Promise<boolean> {
  const inserted = await query(
    `INSERT INTO public.subscribers (email, consent, source, source_path)
     VALUES ($1, true, 'website', $2)
     ON CONFLICT (email) DO NOTHING
     RETURNING email, consent`,
    [subscriber.email, subscriber.sourcePath],
  );
  if (inserted.length > 0) {
    return inserted.length === 1 && inserted[0].email === subscriber.email && inserted[0].consent === true;
  }

  // A separate statement sees a concurrently committed conflicting insert.
  // A single INSERT/SELECT CTE could use an earlier snapshot and miss that row.
  const existing = await query(
    'SELECT email, consent FROM public.subscribers WHERE email = $1 LIMIT 1',
    [subscriber.email],
  );
  return existing.length === 1 && existing[0].email === subscriber.email && existing[0].consent === true;
}

export async function persistSubscriberInNeon(subscriber: Subscriber, databaseUrl: string | undefined): Promise<boolean> {
  if (!databaseUrl) throw new Error('subscription_database_unavailable');
  const sql = neon(databaseUrl, { fetchOptions: { signal: AbortSignal.timeout(DATABASE_TIMEOUT_MS) } });
  return persistSubscriber(subscriber, async (statement, values) => sql.query(statement, values));
}
