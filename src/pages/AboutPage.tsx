import HubIcon from '../components/HubIcon';
import LocalSearch from '../components/LocalSearch';
import Seo from '../components/Seo';
import WebsitePreview from '../components/WebsitePreview';
import { useCatalogSearch } from '../lib/useCatalogSearch';

export default function AboutPage() {
  const { query, setQuery, results } = useCatalogSearch('about');
  const showProfile = !query.trim() || results.length > 0;
  return (
    <>
      <Seo title="About me · Δήμος · Demos Vibes" description="Γεια είμαι ο Δήμος. AI Software Engineer και creator πίσω από το Demos Vibes. Γνώρισε τα projects και την εμπειρία μου." path="/about" ogType="website" />
      <main id="main-content" className="hub-container hub-main">
        <div className="hub-about-search"><LocalSearch id="about-search" label="Αναζήτηση στο About me" placeholder="Projects, εμπειρία, επικοινωνία…" value={query} onChange={setQuery} /></div>
        {showProfile ? <section className="hub-about-layout" aria-labelledby="about-title">
          <div className="hub-about-copy"><p className="hub-eyebrow">Ο άνθρωπος πίσω από τα videos</p><h1 id="about-title">Γεια είμαι ο <span>Δήμος</span></h1><p className="hub-lead">Φτιάχνω software και μοιράζομαι όσα μαθαίνω για το AI, μέσα από το Demos Vibes.</p><p className="hub-role">AI Software Engineer &amp; Creator</p><p className="hub-location">Αθήνα, Ελλάδα</p><p className="hub-lead">Στο προσωπικό μου site θα βρεις τα projects, την εμπειρία μου και τρόπους να επικοινωνήσουμε.</p><a className="hub-text-link" href="https://dimosthenisgkontolias.com/" target="_blank" rel="noopener noreferrer">Γνώρισέ με καλύτερα<HubIcon name="arrow" /></a></div>
          <div className="hub-about-preview"><WebsitePreview url="https://dimosthenisgkontolias.com/" title="Προεπισκόπηση portfolio του Δήμου" action="Δες το portfolio" width={1440} /><a className="hub-about-caption" href="https://dimosthenisgkontolias.com/" target="_blank" rel="noopener noreferrer"><span><strong>dimosthenisgkontolias.com</strong><small>Projects, εμπειρία &amp; επικοινωνία</small></span><HubIcon name="arrow" /></a></div>
        </section> : <div className="hub-empty"><h1>Δεν βρέθηκε κάτι στο About me.</h1><p>Δοκίμασε «projects», «επικοινωνία» ή «Δήμος».</p><button type="button" onClick={() => setQuery('')}>Εμφάνιση προφίλ</button></div>}
      </main>
    </>
  );
}
