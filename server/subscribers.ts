import { neon } from '@neondatabase/serverless';

export interface Subscriber {
  email: string;
  consent: true;
  ip?: string | null;
  userAgent?: string | null;
  referrer?: string | null;
}

export type SubscriberQuery = (statement: string, values: (string | null)[]) => Promise<Record<string, unknown>[]>;

const DATABASE_TIMEOUT_MS = 8_000;

/** Successful duplicates never modify the original consent date or request metadata. */
export async function persistSubscriber(subscriber: Subscriber, query: SubscriberQuery): Promise<boolean> {
  const inserted = await query(
    `INSERT INTO public.subscribers (email, consent, ip, user_agent, referrer)
     VALUES ($1, true, $2::inet, $3, $4)
     ON CONFLICT (email) DO NOTHING
     RETURNING email, consent`,
    [subscriber.email, subscriber.ip ?? null, subscriber.userAgent ?? null, subscriber.referrer ?? null],
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
