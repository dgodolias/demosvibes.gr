import { useEffect, useMemo, useState } from 'react';
import FeaturedResource from '../components/FeaturedResource';
import SearchFilter from '../components/SearchFilter';
import Seo from '../components/Seo';
import SiteFooter from '../components/SiteFooter';
import Topbar from '../components/Topbar';
import { gridResources } from '../data/resources';
import { site } from '../data/site';
import { isReleasedOnHomepage } from '../lib/release';
import { websiteLd } from '../lib/seo';

export default function HomePage() {
  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const homepageResources = useMemo(
    () => gridResources.filter((resource) => isReleasedOnHomepage(resource, now)),
    [now],
  );

  /** The "Τελευταίο" card = the actual newest released video (gridResources is newest-first). */
  const featured = homepageResources[0];

  /** Derived hero stats (replaces the old hardcoded, stale numbers). */
  const total = homepageResources.length;
  const prompts = homepageResources.filter((resource) => resource.card!.filters.includes('prompt')).length;
  const latest =
    homepageResources[0]?.card!.metaLine.split('·')[0].trim().split(' ').slice(0, 2).join(' ') ?? '';

  return (
    <>
      <Seo
        title="videos · dgodolias"
        description={site.description}
        path="/"
        ogType="website"
        jsonLd={websiteLd()}
      />
      <main className="site-shell">
        <Topbar />

        <section className="landing-hero" aria-labelledby="page-title">
          <div className="hero-copy">
            <p className="eyebrow">Social companion hub</p>
            <h1 id="page-title">Βρες το υλικό πίσω από το βίντεο.</h1>
            <p className="hero-lede">
              Έρχεσαι από TikTok, Instagram ή Shorts; Διάλεξε το βίντεο και πάρε το prompt, το link,
              τον οδηγό ή το αρχείο που αναφέρω.
            </p>
            <div className="hero-stats" aria-label="Σύνοψη υλικού">
              <span>
                <strong>{total}</strong> resources
              </span>
              <span>
                <strong>{prompts}</strong> prompts
              </span>
              <span>
                <strong>{latest}</strong> latest
              </span>
            </div>
          </div>

          {featured && <FeaturedResource resource={featured} />}
        </section>

        <SearchFilter resources={homepageResources} />

        <SiteFooter />
      </main>
    </>
  );
}
