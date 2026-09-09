import { isIP } from 'node:net';

const MAX_USER_AGENT_LENGTH = 2_048;
const MAX_REFERRER_LENGTH = 4_096;

function cleanHeader(value: string | null): string | null {
  const cleaned = value?.replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ').trim();
  return cleaned || null;
}

function clientIp(headers: Headers, trustVercelHeaders: boolean): string | null {
  if (!trustVercelHeaders) return null;
  // Vercel supplies these headers. An invalid preferred value does not fall back
  // to a second header, and a proxy chain is never guessed into one client IP.
  const value = (headers.get('x-vercel-forwarded-for') ?? headers.get('x-forwarded-for'))?.trim();
  if (!value || value.length > 64 || value.includes('%') || isIP(value) === 0) return null;
  return value;
}

function referringUrl(headers: Headers): string | null {
  const value = cleanHeader(headers.get('referer'));
  if (!value || value.length > MAX_REFERRER_LENGTH || !/^https?:\/\//i.test(value)) return null;
  try {
    const url = new URL(value);
    url.hash = '';
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password
      || url.href.length > MAX_REFERRER_LENGTH) return null;
    return url.href;
  } catch {
    return null;
  }
}

/** Request context only: never read metadata from the submitted JSON/form body. */
export function subscriberMetadata(headers: Headers, trustVercelHeaders: boolean) {
  return {
    ip: clientIp(headers, trustVercelHeaders),
    userAgent: cleanHeader(headers.get('user-agent'))?.slice(0, MAX_USER_AGENT_LENGTH) ?? null,
    referrer: referringUrl(headers),
  };
}
