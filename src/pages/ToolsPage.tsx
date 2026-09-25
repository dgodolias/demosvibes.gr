import type { ReactNode } from 'react';

import { Link } from 'react-router-dom';
import HubIcon from '../components/HubIcon';
import LocalSearch from '../components/LocalSearch';
import Seo from '../components/Seo';
import WebsitePreview from '../components/WebsitePreview';
import { useCatalogSearch } from '../lib/useCatalogSearch';

/** Compact tool card: small media, title, short description and its actions. */
function ToolCard({ id, title, badge, media, description, className = '', children }: {
  id: string; title: string; badge?: string; media: ReactNode; description: string; className?: string; children: ReactNode;
}) {
  return (
    <article id={id} className={`hub-tool-card ${className}`} aria-labelledby={`${id}-title`}>
      <div className="hub-tool-media">{media}</div>
      <div className="hub-tool-info">
        <div className="hub-tool-head"><h2 id={`${id}-title`}>{title}</h2>{badge && <span className="hub-soon">{badge}</span>}</div>
        <p className="hub-tool-desc">{description}</p>
        <div className="hub-tool-links">{children}</div>
      </div>
    </article>
  );
}

export default function ToolsPage() {
  const { query, setQuery, results } = useCatalogSearch('tools');
  const matching = new Set(results.map(result => result.document.id));
  const showQr = !query.trim() || matching.has('qrcode-style-gen');
  const showContego = !query.trim() || matching.has('contego') || matching.has('contego-privacy');
  const showKickbacks = !query.trim() || matching.has('kickbacks-ai-tool');
  const count = Number(showQr) + Number(showContego);
  return (
    <>
      <Seo title="Tools · Demos Vibes" description="Δικά μου εργαλεία: QRCodeStyleGen για QR codes και Contego για τον browser σου. Δοκίμασε τα projects μου." path="/tools" ogType="website" />
      <main id="main-content" className="hub-container hub-main">
        <section aria-labelledby="tools-title">
          <div className="hub-intro hub-intro-tools"><div><p className="hub-eyebrow">Φτιαγμένα από εμένα</p><h1 id="tools-title">Τα έφτιαξα για να διευκολυνθώ εγώ.<br /><span>Τώρα επωφελείσαι και εσύ!</span></h1><p className="hub-lead">Δικά μου projects που μπορείς να χρησιμοποιήσεις.<br />Πάτα στην προεπισκόπηση για να ανοίξεις το εργαλείο.</p></div></div>
          <div className="hub-tools-toolbar"><h2>Τα εργαλεία μου <span role="status" aria-live="polite">{count}</span></h2><LocalSearch id="tools-search" label="Αναζήτηση στα Tools" placeholder="Εργαλείο ή τι θέλεις να κάνεις…" value={query} onChange={setQuery} /></div>
          <div className="hub-tools-grid">
            {showQr && <ToolCard id="qrcode-style-gen" title="QRCodeStyleGen"
              media={<WebsitePreview url="https://dgodolias.github.io/QRCodeStyleGen/" title="Προεπισκόπηση QRCodeStyleGen" action="Άνοιγμα εργαλείου" />}
              description="Φτιάξε το δικό σου QR code με χρώματα, σχήματα και λογότυπο, μέσα στον browser σου.">
              <a href="https://dgodolias.github.io/QRCodeStyleGen/" target="_blank" rel="noopener noreferrer">Δοκίμασέ το<HubIcon name="arrow" /></a>
            </ToolCard>}
            {showContego && <ToolCard id="contego" title="Contego" badge="Έρχεται σύντομα" className="hub-tool-contego"
              media={<div className="hub-contego-art"><img src="/assets/contego/icon128.png" alt="" width={48} height={48} /><span>Your browsing. Your choices.</span></div>}
              description="Chrome extension για τα cookie banners, με τις προτιμήσεις σου και προαιρετικό ad blocking. Η εγκατάσταση θα είναι διαθέσιμη σύντομα.">
              <Link to="/tools/contego/privacy/"><HubIcon name="document" />Πολιτική απορρήτου</Link>
            </ToolCard>}
          </div>
          {showKickbacks && <>
            <div className="hub-tools-toolbar hub-tools-used"><h2>Εργαλεία που χρησιμοποιώ <span>1</span></h2><p>Δεν είναι δικά μου και δεν έχω σχέση με τις εταιρείες που τα φτιάχνουν.</p></div>
            <div className="hub-used-grid">
              <ToolCard id="kickbacks-ai" title="Kickbacks.ai" badge="Εργαλείο τρίτου" className="hub-tool-thirdparty"
                media={<Link className="hub-tool-shot" to="/kickbacks-ai/" tabIndex={-1} aria-hidden="true"><img src="/thumbs/kickbacks-ai_thumb.jpg" alt="" width={480} height={300} loading="lazy" /></Link>}
                description="Διαφήμιση μίας γραμμής όσο δουλεύει το Claude Code ή το Codex, με μέρος των εσόδων για σένα. Δεν είναι δικό μου: κάνε τη δική σου έρευνα.">
                <Link to="/kickbacks-ai/">Δες τον οδηγό βήμα βήμα<HubIcon name="arrow" /></Link>
              </ToolCard>
            </div>
          </>}
          {count === 0 && !showKickbacks && <div className="hub-empty"><h2>Δεν βρέθηκε κάποιο εργαλείο.</h2><p>Δοκίμασε «QR», «cookies» ή μια περιγραφή αυτού που χρειάζεσαι.</p><button type="button" onClick={() => setQuery('')}>Εμφάνιση όλων</button></div>}
        </section>
      </main>
    </>
  );
}
