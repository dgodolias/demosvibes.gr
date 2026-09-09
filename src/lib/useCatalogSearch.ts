import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getSearchDocuments } from '../data/search';
import { searchDocuments } from './search';

export function useCatalogSearch(scope: 'videos' | 'tools' | 'about') {
  const [params, setParams] = useSearchParams();
  const [now, setNow] = useState(0);
  // Static HTML has no query string. Match it for the first hydration render,
  // then apply the existing URL query without rewriting or discarding it.
  const query = now === 0 ? '' : params.get('q') ?? '';
  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  const documents = useMemo(() => getSearchDocuments(now), [now]);
  const results = useMemo(() => searchDocuments(documents, query, scope), [documents, query, scope]);
  const setQuery = (value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set('q', value); else next.delete('q');
    setParams(next, { replace: true, preventScrollReset: true });
  };
  return { query, setQuery, now, documents, results };
}
