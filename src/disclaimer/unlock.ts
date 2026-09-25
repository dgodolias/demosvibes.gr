import type { ContentBlock } from '../data/types';

const UNLOCK_TIMEOUT_MS = 15_000;
const STORAGE_KEY = 'dv_disclaimers_v1';

export type UnlockRequest =
  | { disclaimer: string; version: string; accepted: true }
  | { disclaimer: string; version: string; acceptance: string };

export interface Unlocked {
  acceptance: string;
  blocks: ContentBlock[];
}

/** The server refused this request for a reason a retry will not fix. */
export class UnlockRejected extends Error {
  constructor(readonly reason: 'outdated' | 'acceptance_required') {
    super(reason);
  }
}

/** Only an explicit `{ ok: true }` response with content unlocks the article. */
export async function unlockContent(request: UnlockRequest): Promise<Unlocked> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), UNLOCK_TIMEOUT_MS);
  try {
    const response = await fetch('/api/disclaimer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(request),
      signal: controller.signal,
    });
    if (response.status === 409) throw new UnlockRejected('outdated');
    if (response.status === 403 && 'acceptance' in request) throw new UnlockRejected('acceptance_required');
    if (!response.ok) throw new Error(`Disclaimer request failed: ${response.status}`);
    const body: unknown = await response.json();
    if (typeof body !== 'object' || body === null || !('ok' in body) || body.ok !== true
      || !('acceptance' in body) || typeof body.acceptance !== 'string'
      || !('blocks' in body) || !Array.isArray(body.blocks)) {
      throw new Error('Disclaimer service did not return the content.');
    }
    return { acceptance: body.acceptance, blocks: body.blocks as ContentBlock[] };
  } finally {
    window.clearTimeout(timeout);
  }
}

type StoredAcceptances = Record<string, { version: string; acceptance: string }>;

function readAll(): StoredAcceptances {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as StoredAcceptances : {};
  } catch {
    return {};
  }
}

/** The acceptance id this browser received for the current version, if any. */
export function storedAcceptance(disclaimer: string, version: string): string | null {
  const entry = readAll()[disclaimer];
  return entry?.version === version && typeof entry.acceptance === 'string' ? entry.acceptance : null;
}

export function rememberAcceptance(disclaimer: string, version: string, acceptance: string) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readAll(), [disclaimer]: { version, acceptance } }));
  } catch {
    /* localStorage unavailable: the disclaimer is shown again next visit */
  }
}

export function forgetAcceptance(disclaimer: string) {
  try {
    const all = readAll();
    delete all[disclaimer];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}
