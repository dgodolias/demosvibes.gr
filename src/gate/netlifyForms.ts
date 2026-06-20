/**
 * Netlify Forms submission for the email gate.
 *
 * Detection of the form happens at BUILD time via the static stub in
 * public/__forms.html (Netlify's bot parses HTML, never runtime JS). At runtime
 * we POST url-encoded data to "/" with a matching `form-name`.
 */

const encode = (data: Record<string, string>): string =>
  Object.keys(data)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
    .join('&');

export async function submitEmailGate(email: string, consent: boolean): Promise<void> {
  const body = encode({
    'form-name': 'email-gate', // MUST match public/__forms.html
    email,
    consent: consent ? 'yes' : 'no',
    'bot-field': '', // honeypot — real users leave it empty
  });

  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) throw new Error(`Netlify Forms POST failed: ${res.status}`);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
