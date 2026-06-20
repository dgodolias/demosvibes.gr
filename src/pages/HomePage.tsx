import Seo from '../components/Seo';
import Topbar from '../components/Topbar';
import FeaturedResource from '../components/FeaturedResource';
import SearchFilter from '../components/SearchFilter';
import SiteFooter from '../components/SiteFooter';
import { gridResources, featuredResource } from '../data/resources';
import { site } from '../data/site';
import { websiteLd } from '../lib/seo';

/** Derived hero stats (replaces the old hardcoded, stale numbers). */
const total = gridResources.length;
const prompts = gridResources.filter((r) => r.card!.filters.includes('prompt')).length;
const latest = gridResources[0]?.card!.metaLine.split('·')[0].trim().split(' ').slice(0, 2).join(' ') ?? '';

export default function HomePage() {
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

          {featuredResource && <FeaturedResource resource={featuredResource} />}
        </section>

        <SearchFilter resources={gridResources} />

        <SiteFooter />
      </main>
    </>
  );
}
