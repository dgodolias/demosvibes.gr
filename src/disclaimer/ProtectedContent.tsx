import type { ReactNode } from 'react';
import type { Disclaimer } from '../data/disclaimers';
import type { ContentBlock } from '../data/types';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

import { disclaimers } from '../data/disclaimers';
import { useGate } from '../gate/GateContext';
import { forgetAcceptance, rememberAcceptance, storedAcceptance, unlockContent, UnlockRejected } from './unlock';

type Phase = 'waiting' | 'loading' | 'prompt' | 'saving' | 'ready' | 'outdated' | 'failed';

/**
 * Renders a disclaimer that must be scrolled to the end and accepted, then the
 * server-delivered content. Nothing of the protected content exists in the
 * prerendered HTML or the bundle, so removing the dialog reveals nothing.
 */
export default function ProtectedContent({ disclaimerId, render }: { disclaimerId: string; render: (blocks: ContentBlock[]) => ReactNode }) {
  const disclaimer = disclaimers[disclaimerId];
  const gate = useGate();
  const [phase, setPhase] = useState<Phase>('waiting');
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [error, setError] = useState<string | null>(null);

  const resume = useCallback(async (acceptance: string) => {
    setPhase('loading');
    try {
      const unlocked = await unlockContent({ disclaimer: disclaimer.id, version: disclaimer.version, acceptance });
      setBlocks(unlocked.blocks);
      setPhase('ready');
    } catch (failure) {
      if (failure instanceof UnlockRejected && failure.reason === 'outdated') setPhase('outdated');
      else if (failure instanceof UnlockRejected) {
        forgetAcceptance(disclaimer.id);
        setPhase('prompt');
      } else setPhase('failed');
    }
  }, [disclaimer]);

  // Wait for the email gate, then reuse this browser's acceptance or ask for one.
  useEffect(() => {
    if (!gate.ready || !gate.accepted || phase !== 'waiting') return;
    const stored = storedAcceptance(disclaimer.id, disclaimer.version);
    if (stored) void resume(stored);
    else setPhase('prompt');
  }, [gate.ready, gate.accepted, phase, disclaimer, resume]);

  async function accept() {
    if (phase !== 'prompt') return;
    setPhase('saving');
    setError(null);
    try {
      const unlocked = await unlockContent({ disclaimer: disclaimer.id, version: disclaimer.version, accepted: true });
      rememberAcceptance(disclaimer.id, disclaimer.version, unlocked.acceptance);
      setBlocks(unlocked.blocks);
      setPhase('ready');
    } catch (failure) {
      if (failure instanceof UnlockRejected && failure.reason === 'outdated') {
        setPhase('outdated');
        return;
      }
      setError('Δεν μπορέσαμε να καταγράψουμε την αποδοχή σου. Έλεγξε τη σύνδεσή σου και δοκίμασε ξανά.');
      setPhase('prompt');
    }
  }

  if (phase === 'ready') return <>{render(blocks)}</>;

  const retry = () => {
    const stored = storedAcceptance(disclaimer.id, disclaimer.version);
    if (stored) void resume(stored);
    else setPhase('prompt');
  };
  const notice = {
    waiting: ['Ο οδηγός είναι κλειδωμένος', 'Εμφανίζεται μόνο αφού διαβάσεις όλη τη δήλωση αποποίησης ευθύνης και πατήσεις «Διάβασα και αποδέχομαι». Το κείμενό του έρχεται από τον server μόνο μετά την αποδοχή, οπότε αν κρύψεις το παράθυρο δεν εμφανίζεται τίποτα.'],
    prompt: ['Ο οδηγός είναι κλειδωμένος', 'Εμφανίζεται μόνο αφού διαβάσεις όλη τη δήλωση αποποίησης ευθύνης και πατήσεις «Διάβασα και αποδέχομαι». Το κείμενό του έρχεται από τον server μόνο μετά την αποδοχή, οπότε αν κρύψεις το παράθυρο δεν εμφανίζεται τίποτα.'],
    saving: ['Καταγράφουμε την αποδοχή σου…', 'Ο οδηγός θα εμφανιστεί σε λίγα δευτερόλεπτα.'],
    loading: ['Φορτώνουμε τον οδηγό…', 'Έχεις ήδη αποδεχτεί τη δήλωση σε αυτόν τον browser.'],
    outdated: ['Η δήλωση ενημερώθηκε', 'Η δήλωση αποποίησης ευθύνης άλλαξε από τότε που άνοιξες τη σελίδα. Ανανέωσε τη σελίδα για να διαβάσεις τη νέα έκδοση.'],
    failed: ['Ο οδηγός δεν φόρτωσε', 'Δεν μπορέσαμε να φορτώσουμε τον οδηγό. Έλεγξε τη σύνδεσή σου και δοκίμασε ξανά.'],
  }[phase];
  const reload = () => window.location.reload();

  return (
    <>
      <section className="steps protected-locked" aria-live="polite">
        <h2>{notice[0]}</h2>
        <p>{notice[1]}</p>
        {(phase === 'waiting' || phase === 'prompt' || phase === 'outdated') && (
          <button type="button" className="protected-action" onClick={reload}>
            {phase === 'outdated' ? 'Ανανέωση σελίδας' : 'Δείξε μου τη δήλωση'}
          </button>
        )}
        {phase === 'failed' && <button type="button" className="protected-action" onClick={retry}>Δοκίμασε ξανά</button>}
      </section>
      {/* Portal: <main> is its own stacking context below the sticky header. Client-only phase. */}
      {(phase === 'prompt' || phase === 'saving') && createPortal(
        <DisclaimerDialog disclaimer={disclaimer} saving={phase === 'saving'} error={error} onAccept={accept} />,
        document.body,
      )}
    </>
  );
}

function DisclaimerDialog({ disclaimer, saving, error, onAccept }: { disclaimer: Disclaimer; saving: boolean; error: string | null; onAccept: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [progress, setProgress] = useState(0);

  // Lock the page behind the dialog and start keyboard scrolling in the text.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    scrollRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // The end marker becomes visible only at the bottom of the text (or at once
  // when the whole text already fits on screen).
  useEffect(() => {
    const root = scrollRef.current;
    const end = endRef.current;
    if (!root || !end || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setReachedEnd(true);
        setProgress(1);
      }
    }, { root, threshold: 0 });
    observer.observe(end);
    return () => observer.disconnect();
  }, []);

  function onScroll() {
    const element = scrollRef.current;
    if (!element) return;
    const max = element.scrollHeight - element.clientHeight;
    setProgress((current) => Math.max(current, max <= 0 ? 1 : Math.min(1, element.scrollTop / max)));
    if (max - element.scrollTop <= 4) setReachedEnd(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="disclaimer-title" aria-describedby="disclaimer-hint">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" aria-hidden="true" />
      <div className="relative flex max-h-[calc(100dvh-24px)] w-full max-w-[600px] flex-col overflow-hidden rounded-card border border-line bg-white shadow-card">
        <div className="border-b border-line px-5 pb-4 pt-5 sm:px-7 sm:pt-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-accent-2">Υποχρεωτική ανάγνωση</p>
          <h2 id="disclaimer-title" className="mb-2 font-display text-[22px] leading-tight text-ink sm:text-[25px]">{disclaimer.title}</h2>
          <p id="disclaimer-hint" className="text-[13px] leading-snug text-muted">
            Κύλισε το κείμενο μέχρι το τέλος. Το κουμπί αποδοχής ενεργοποιείται μόλις φτάσεις κάτω.
          </p>
        </div>
        <div
          ref={scrollRef}
          onScroll={onScroll}
          tabIndex={0}
          role="region"
          aria-label="Κείμενο δήλωσης αποποίησης ευθύνης"
          className="disclaimer-body min-h-[160px] flex-1 overflow-y-auto overscroll-contain px-5 py-4 outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-accent/15 sm:px-7"
        >
          <div dangerouslySetInnerHTML={{ __html: disclaimer.html }} />
          <div ref={endRef} className="h-px" aria-hidden="true" />
        </div>
        <div className="h-1 w-full bg-surface-lo" aria-hidden="true">
          <div className="h-full bg-accent transition-[width] duration-150" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
        <div className="px-5 pb-5 pt-4 sm:px-7 sm:pb-6">
          {error && <p role="alert" className="mb-3 text-[13px] leading-snug text-ink">{error}</p>}
          <button
            type="button"
            onClick={onAccept}
            disabled={!reachedEnd || saving}
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-chip bg-ink px-5 text-center text-[15px] font-bold text-white transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:bg-[#c9d0d6] disabled:text-[#56606d]"
          >
            {saving ? 'Καταγράφουμε την αποδοχή…' : reachedEnd ? 'Διάβασα και αποδέχομαι' : 'Κύλισε μέχρι το τέλος για να συνεχίσεις'}
          </button>
          <Link to="/" className="mt-3 flex min-h-[40px] items-center justify-center text-center text-[13px] text-muted underline underline-offset-2">
            Δεν συμφωνώ, πίσω στα videos
          </Link>
        </div>
      </div>
    </div>
  );
}
