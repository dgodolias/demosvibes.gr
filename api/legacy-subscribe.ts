import { env } from 'node:process';

import { createLegacySubscriptionHandler } from '../server/legacy-subscribe.js';
import { subscriptionOrigins } from '../server/subscribe.js';
import { persistSubscriberInNeon } from '../server/subscribers.js';

export default {
  fetch: createLegacySubscriptionHandler({
    allowedOrigins: subscriptionOrigins(env),
    trustVercelHeaders: env.VERCEL === '1',
    persist: (subscriber) => persistSubscriberInNeon(subscriber, env.DATABASE_URL),
    reportPersistenceFailure: () => console.error('legacy_subscribe_persistence_failed'),
  }),
};
