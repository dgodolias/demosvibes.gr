import { env } from 'node:process';

import { acceptanceExistsInNeon, createDisclaimerHandler, recordAcceptanceInNeon } from '../server/disclaimers.js';
import { subscriptionOrigins } from '../server/subscribe.js';

export default {
  fetch: createDisclaimerHandler({
    allowedOrigins: subscriptionOrigins(env),
    trustVercelHeaders: env.VERCEL === '1',
    record: (acceptance) => recordAcceptanceInNeon(acceptance, env.DATABASE_URL),
    verify: (id, disclaimer, version) => acceptanceExistsInNeon(id, disclaimer, version, env.DATABASE_URL),
    reportPersistenceFailure: () => console.error('disclaimer_persistence_failed'),
  }),
};
