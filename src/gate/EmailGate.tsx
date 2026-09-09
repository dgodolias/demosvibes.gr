import type { FormEvent } from 'react';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useGate } from './GateContext';
import { isValidEmail, subscribeEmail } from './subscribe';

/**
 * Full-screen email-capture interstitial.
 *
 * Email is optional. Nonempty submissions require explicit server confirmation
 * before entry is remembered; failures keep the form open for retry or skipping.
 */
export default function EmailGate() {
  const { accept } = useGate();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lock body scroll while the gate is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      accept();
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      setError('Γράψε ένα έγκυρο email ή άφησε το πεδίο κενό για να μπεις χωρίς εγγραφή.');
      return;
    }

    const honeypot = new FormData(event.currentTarget).get('bot-field');
    setSubmitting(true);
    setError(null);
    try {
      await subscribeEmail({
        email: trimmedEmail,
        consent: true,
        honeypot: typeof honeypot === 'string' ? honeypot : '',
      });
      accept();
    } catch {
      setError('Δεν μπορέσαμε να επιβεβαιώσουμε την αποθήκευση του email σου. Δοκίμασε ξανά ή συνέχισε στο site χωρίς νέα υποβολή.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
    >
      {/* scrim */}
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" aria-hidden="true" />

      <form
        onSubmit={handleSubmit}
        name="email-gate"
        noValidate
        aria-busy={submitting}
        className="relative w-full max-w-[440px] rounded-card border border-line bg-white p-7 shadow-card"
      >
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-accent">demosvibes</p>
        <h2 id="gate-title" className="mb-2 font-display text-[28px] leading-tight text-ink">
          Μπες στο demosvibes.
        </h2>
        <p className="mb-5 text-[15px] text-muted">
          Δωρεάν prompts και οδηγοί για τα καλύτερα AI εργαλεία, όλα στα ελληνικά.
        </p>

        {/* honeypot (hidden from humans) */}
        <p className="hidden">
          <label>
            Μην το συμπληρώνεις: <input name="bot-field" tabIndex={-1} autoComplete="off" />
          </label>
        </p>

        <input
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          placeholder="το email σου"
          aria-label="Το email σου"
          aria-describedby={error ? 'gate-email-error gate-consent' : 'gate-consent'}
          aria-invalid={Boolean(error) && !isValidEmail(email)}
          value={email}
          disabled={submitting}
          onChange={(event) => { setEmail(event.target.value); setError(null); }}
          className="mb-4 w-full rounded-card border border-line bg-white px-3.5 py-3 text-base text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
        />

        <p id="gate-consent" className="mb-4 text-[12.5px] leading-snug text-muted">
          Υποβάλλοντας το email μου, λέω ναι να μου στέλνει το demosvibes.gr νέα prompts και AI εργαλεία.
          Μπορώ να φύγω όποτε θέλω. Δες την{' '}
          <Link to="/privacy" className="text-accent underline underline-offset-2">
            Πολιτική Απορρήτου
          </Link>
          .
        </p>

        {error && <p id="gate-email-error" role="alert" className="mb-4 text-[13px] leading-snug text-ink">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-[46px] w-full items-center justify-center rounded-chip bg-ink px-5 text-[15px] font-bold text-white transition hover:bg-ink-soft disabled:opacity-70"
        >
          {submitting ? 'Αποθηκεύουμε το email…' : error ? 'Δοκίμασε ξανά' : 'Μπαίνω στο site'}
        </button>

        {error && <button type="button" onClick={accept} className="mt-3 min-h-[40px] w-full text-center text-[13px] text-muted underline underline-offset-2">Συνέχεια χωρίς νέα υποβολή</button>}

        <p className="mt-3 text-center text-[11.5px] text-quiet">
          Καθόλου spam. Μόνο χρήσιμα AI εργαλεία. Μπορείς να ζητήσεις διαγραφή όποτε θες.
        </p>
      </form>
    </div>
  );
}
