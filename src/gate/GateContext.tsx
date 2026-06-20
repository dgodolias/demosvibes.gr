import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import EmailGate from './EmailGate';

const STORAGE_KEY = 'dv_gate_accepted_v1'; // versioned so we can re-prompt later if needed

interface GateState {
  accepted: boolean;
  /** False during prerender + first paint, until localStorage is read. */
  ready: boolean;
  accept: () => void;
}

const GateContext = createContext<GateState>({
  accepted: false,
  ready: false,
  accept: () => {},
});

export const useGate = () => useContext(GateContext);

/**
 * Wraps the app, reads the "already entered" flag from localStorage, and shows
 * the email gate overlay until satisfied.
 *
 * SSG-safe: localStorage is only read inside useEffect, so the prerendered HTML
 * always contains the real page content (good for crawlers); the overlay is
 * layered on after hydration only for visitors who haven't entered yet.
 */
export function GateProvider({ children }: { children: React.ReactNode }) {
  const [accepted, setAccepted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setAccepted(localStorage.getItem(STORAGE_KEY) === '1');
    } catch {
      /* localStorage unavailable (private mode) — treat as not accepted */
    }
    setReady(true);
  }, []);

  const accept = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setAccepted(true);
  }, []);

  return (
    <GateContext.Provider value={{ accepted, ready, accept }}>
      {children}
      {ready && !accepted && <EmailGate />}
    </GateContext.Provider>
  );
}
