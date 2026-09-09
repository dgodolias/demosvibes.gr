import { env } from 'node:process';

import { createSubscriptionHandler, subscriptionOrigins } from '../server/subscribe.js';
import { persistSubscriberInNeon } from '../server/subscribers.js';

// Vercel's Node runtime supports the Web Standard fetch export in /api/*.ts.
export default {
  fetch: createSubscriptionHandler({
    allowedOrigins: subscriptionOrigins(env),
    persist: (subscriber) => persistSubscriberInNeon(subscriber, env.DATABASE_URL),
    reportPersistenceFailure: () => console.error('subscribe_persistence_failed'),
  }),
};
