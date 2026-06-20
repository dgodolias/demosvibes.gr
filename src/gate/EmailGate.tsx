import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { submitEmailGate, isValidEmail } from './netlifyForms';
import { useGate } from './GateContext';

/**
 * Full-screen email-capture interstitial.
 *
 * UX (per owner): the "Μπαίνω στο site" button is ALWAYS enabled — visitors can
 * enter even with an empty email (capture is effectively optional but feels
 * required). We only POST to Netlify Forms when the email is valid AND consent
 * is ticked, keeping the captured list clean and GDPR-consented either way.
 */
export default function EmailGate() {
  const { accept } = useGate();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Lock body scroll while the gate is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    // Consent is given by the act of submitting an email (see the notice above
    // the button). Best-effort capture; never trap the user if the POST fails.
    if (isValidEmail(email)) {
      try {
        await submitEmailGate(email.trim(), true);
      } catch {
        /* swallow — entering the site must not depend on the POST */
      }
    }

    accept();
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

      {/* Detection is handled by the static stub in public/__forms.html; this
          runtime form just collects input and POSTs via fetch (see netlifyForms.ts). */}
      <form
        onSubmit={handleSubmit}
        name="email-gate"
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-card border border-line bg-white px-3.5 py-3 text-base text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
        />

        <p className="mb-4 text-[12.5px] leading-snug text-muted">
          Βάζοντας το email μου, λέω ναι να μου στέλνει το demosvibes.gr νέα prompts και AI εργαλεία.
          Μπορώ να φύγω όποτε θέλω. Δες την{' '}
          <Link to="/privacy" className="text-accent underline underline-offset-2">
            Πολιτική Απορρήτου
          </Link>
          .
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-[46px] w-full items-center justify-center rounded-chip bg-ink px-5 text-[15px] font-bold text-white transition hover:bg-ink-soft disabled:opacity-70"
        >
          {submitting ? 'Μπαίνεις…' : 'Μπαίνω στο site'}
        </button>

        <p className="mt-3 text-center text-[11.5px] text-quiet">
          Καθόλου spam. Μόνο χρήσιμα AI εργαλεία. Διαγραφή με ένα κλικ, όποτε θες.
        </p>
      </form>
    </div>
  );
}
