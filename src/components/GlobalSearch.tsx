import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { SearchDocument, SearchScope } from '../lib/search';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { getSearchDocuments } from '../data/search';
import { searchDocuments } from '../lib/search';
import '../search.css';

const SCOPES: { value: SearchScope; label: string }[] = [
  { value: 'videos', label: 'Videos' }, { value: 'tools', label: 'Tools' }, { value: 'about', label: 'About me' },
];
const SUGGESTIONS = ['QR με λογότυπο', 'δωρεάν SQL', 'μετάφραση μενού', 'cookie banners'];

function SearchIcon() {
  return <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>;
}

function containDialogFocus(event: ReactKeyboardEvent<HTMLDialogElement>) {
  if (event.key !== 'Tab' || event.defaultPrevented) return;
  // Read the current controls each time: result links and the clear button
  // appear/disappear while searching. Native dialog alone can tab into browser UI.
  const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, [tabindex]')]
    .filter((element) => element.tabIndex >= 0 && !element.matches(':disabled')
      && !element.closest('[hidden], [inert], [aria-hidden="true"]')
      && element.getClientRects().length > 0 && getComputedStyle(element).visibility === 'visible');
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (!first || !last) {
    event.preventDefault();
    return;
  }
  const active = document.activeElement;
  const focusedControl = controls.some((element) => element === active);
  const destination = !focusedControl ? (event.shiftKey ? last : first)
    : event.shiftKey && active === first ? last
    : !event.shiftKey && active === last ? first : null;
  if (destination) {
    event.preventDefault();
    destination.focus();
  }
}

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<SearchScope>();
  const [documents, setDocuments] = useState<SearchDocument[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const inputId = useId();

  const openSearch = useCallback(() => {
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setDocuments(getSearchDocuments(Date.now()));
    setOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    dialogRef.current?.close();
    setOpen(false);
    previousFocus.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        const anotherModal = [...document.querySelectorAll('dialog[open], [role="dialog"][aria-modal="true"]')]
          .some((element) => element !== dialogRef.current && element.getClientRects().length > 0);
        if (anotherModal) return;
        event.preventDefault();
        if (dialogRef.current?.open) inputRef.current?.focus();
        else openSearch();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [openSearch]);

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.showModal();
    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const interval = window.setInterval(() => setDocuments(getSearchDocuments(Date.now())), 30_000);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearInterval(interval);
    };
  }, [open]);

  const results = useMemo(() => searchDocuments(documents, query, scope), [documents, query, scope]);
  const visibleResults = results.slice(0, 18);
  const resultScopes = [...new Set(visibleResults.map(({ document }) => document.scope))];

  return (
    <>
      <button className="global-search-trigger" type="button" onClick={openSearch} aria-label="Αναζήτηση σε όλο το site" aria-haspopup="dialog">
        <SearchIcon /><span>Ψάξε παντού…</span><kbd>Ctrl K</kbd>
      </button>
      {open && (
        <dialog ref={dialogRef} className="global-search-dialog" aria-labelledby={titleId} onKeyDown={containDialogFocus} onCancel={closeSearch} onClose={closeSearch} onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeSearch();
        }}>
          <div className="global-search-heading"><h2 id={titleId}>Τι ψάχνεις;</h2><button className="global-search-close" onClick={closeSearch} type="button" aria-label="Κλείσιμο αναζήτησης">×</button></div>
          <div className="global-search-input-wrap">
            <SearchIcon /><label className="sr-only" htmlFor={inputId}>Αναζήτηση σε όλο το site</label>
            <input ref={inputRef} id={inputId} type="search" value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" placeholder="Π.χ. θέλω να φτιάξω QR με λογότυπο" maxLength={180} />
            {query && <button className="local-search-clear" type="button" onClick={() => { setQuery(''); inputRef.current?.focus(); }} aria-label="Καθαρισμός αναζήτησης">×</button>}
          </div>
          <p className="global-search-hint">Γράψε ένα θέμα ή αυτό που θέλεις να κάνεις. Δοκίμασε και Greeklish.</p>
          <div className="global-search-scopes" aria-label="Περιοχή αναζήτησης">
            <button type="button" aria-pressed={!scope} onClick={() => setScope(undefined)}>Παντού</button>
            {SCOPES.map(({ value, label }) => <button key={value} type="button" aria-pressed={scope === value} onClick={() => setScope(value)}>{label}</button>)}
          </div>
          {!query.trim() ? (
            <div className="global-search-start">
              <p>Μερικές ιδέες για αρχή</p>
              <div className="global-search-suggestions">{SUGGESTIONS.map((suggestion) => <button key={suggestion} type="button" onClick={() => { setScope(undefined); setQuery(suggestion); inputRef.current?.focus(); }}>{suggestion}<span aria-hidden="true">↗</span></button>)}</div>
              <p className="global-search-start-note">Βρες υλικό από τα Videos, δικά μου Tools και πληροφορίες για εμένα.</p>
            </div>
          ) : (
            <div className="global-search-results">
              <p className="global-search-count" role="status" aria-live="polite">{results.length ? `${results.length} ${results.length === 1 ? 'αποτέλεσμα' : 'αποτελέσματα'}${results.length > 18 ? ' · εμφανίζονται τα 18 πιο σχετικά' : ''}` : 'Δεν βρέθηκε κάτι σχετικό.'}</p>
              {resultScopes.map((resultScope) => <section key={resultScope} aria-label={SCOPES.find(({ value }) => value === resultScope)?.label}>
                <h3>{SCOPES.find(({ value }) => value === resultScope)?.label}</h3>
                <ul>{visibleResults.filter(({ document: resultDocument }) => resultDocument.scope === resultScope).map(({ document: resultDocument }) => <li key={resultDocument.id}><Link to={resultDocument.href} onClick={(event) => {
                  closeSearch();
                  const fragment = resultDocument.href.split('#')[1];
                  if (fragment && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                    // React Router also allows navigating to the current hash; reselecting
                    // that result should find its card even when the URL did not change.
                    window.requestAnimationFrame(() => document.getElementById(fragment)?.scrollIntoView());
                  }
                }}><span><strong>{resultDocument.title}</strong><span className="global-search-description">{resultDocument.description}</span></span><span className="global-search-result-arrow" aria-hidden="true">↗</span></Link></li>)}</ul>
              </section>)}
              {!results.length && <p className="global-search-no-results">Δοκίμασε λιγότερες λέξεις, ένα όνομα εργαλείου ή μια άλλη περιγραφή.</p>}
            </div>
          )}
          <div className="global-search-footer"><span>Videos · Tools · About me</span><span><kbd>Esc</kbd> για κλείσιμο</span></div>
        </dialog>
      )}
    </>
  );
}
