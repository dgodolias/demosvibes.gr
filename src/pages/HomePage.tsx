import { useMemo } from 'react';
import LocalSearch from '../components/LocalSearch';
import ResourceCard from '../components/ResourceCard';
import Seo from '../components/Seo';
import { gridResources } from '../data/resources';
import { site } from '../data/site';
import { isReleasedOnHomepage } from '../lib/release';
import { websiteLd } from '../lib/seo';
import { useCatalogSearch } from '../lib/useCatalogSearch';

export default function HomePage() {
  const { query, setQuery, now, results } = useCatalogSearch('videos');
  const released = useMemo(() => gridResources.filter(resource => isReleasedOnHomepage(resource, now)), [now]);
  const visible = query.trim()
    ? results.flatMap(({ document }) => {
        const resource = released.find(item => item.slug === document.id);
        if (resource) return [resource];
        const parent = released.find(item => document.id.startsWith(item.slug + '/'));
        return parent ? [parent] : [];
      }).filter((resource, index, all) => all.findIndex(item => item.slug === resource.slug) === index)
    : released;
  return (
    <>
      <Seo title="Videos · Demos Vibes" description={site.description} path="/" ogType="website" jsonLd={websiteLd()} />
      <main id="main-content" className="hub-container hub-main">
        <section aria-labelledby="videos-title">
          <div className="hub-intro">
            <div><p className="hub-eyebrow">Το υλικό των videos</p><h1 id="videos-title">Είδες το βίντεο.<br /><span>Πάρε και το υλικό.</span></h1><p className="hub-lead">Prompts, links και οδηγοί από τα videos μου.<br />Βρες αυτό που είδες και δοκίμασέ το στην πράξη.</p></div>
            <LocalSearch id="video-search" label="Αναζήτηση στα Videos" placeholder="Τίτλος, εργαλείο ή θέμα…" value={query} onChange={setQuery} />
          </div>
          <div className="hub-collection"><h2>Η βιβλιοθήκη των videos <span role="status" aria-live="polite">{visible.length}</span></h2><span>{query.trim() ? 'Πιο σχετικά πρώτα' : 'Πιο πρόσφατα πρώτα ↓'}</span></div>
          <ol className="hub-video-grid">
            {visible.map((resource, index) => <ResourceCard key={resource.slug} resource={resource} newest={resource.slug === released[0]?.slug} priority={index < 3} />)}
          </ol>
          {visible.length === 0 && <div className="hub-empty"><h2>Δεν βρέθηκε κάποιο video.</h2><p>Δοκίμασε έναν άλλο τίτλο, εργαλείο ή θέμα.</p><button type="button" onClick={() => setQuery('')}>Εμφάνιση όλων</button></div>}
        </section>
      </main>
    </>
  );
}
