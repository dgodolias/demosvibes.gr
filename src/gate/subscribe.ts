const SUBSCRIBE_TIMEOUT_MS = 15_000;

export interface SubscriptionRequest {
  email: string;
  consent: true;
  honeypot: string;
}

/** Only the API's explicit acknowledgement confirms a durably saved subscription. */
export async function subscribeEmail(request: SubscriptionRequest): Promise<void> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), SUBSCRIBE_TIMEOUT_MS);
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(request),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Subscription request failed: ${response.status}`);

    const acknowledgement: unknown = await response.json();
    if (typeof acknowledgement !== 'object' || acknowledgement === null
      || !('ok' in acknowledgement) || acknowledgement.ok !== true) {
      throw new Error('Subscription service did not confirm saving.');
    }
  } finally {
    window.clearTimeout(timeout);
  }
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
