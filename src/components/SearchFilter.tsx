import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { FilterTag, Resource } from '../data/types';
import { matches } from '../lib/filter';
import ResourceCard from './ResourceCard';

const FILTERS: { key: FilterTag | 'all'; label: string }[] = [
  { key: 'all', label: 'Όλα' },
  { key: 'prompt', label: 'Prompts' },
  { key: 'tool', label: 'Tools' },
  { key: 'guide', label: 'Guides' },
  { key: 'founders', label: 'Founders' },
];

/** The "Resource library" section: search box + filter chips + grid. */
export default function SearchFilter({ resources }: { resources: Resource[] }) {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [filter, setFilter] = useState<FilterTag | 'all'>('all');

  const visible = useMemo(
    () => resources.filter((r) => matches(r, query, filter)),
    [resources, query, filter],
  );

  return (
    <section className="library" aria-labelledby="library-title">
      <div className="library-head">
        <div>
          <p className="eyebrow">Resource library</p>
          <h2 id="library-title">Όλα τα συνοδευτικά</h2>
        </div>
        <label className="search-box">
          <span className="sr-only">Αναζήτηση υλικού</span>
          <input
            id="resource-search"
            type="search"
            placeholder="Αναζήτηση υλικού"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      <div className="filters" role="list" aria-label="Φίλτρα υλικού">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={'filter-chip' + (filter === f.key ? ' is-active' : '')}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ol className="resource-grid" id="resource-grid">
        {visible.map((r) => (
          <ResourceCard key={r.slug} resource={r} />
        ))}
      </ol>

      {visible.length === 0 && (
        <p className="empty-state">Δεν βρέθηκε κάτι με αυτά τα φίλτρα.</p>
      )}
    </section>
  );
}
