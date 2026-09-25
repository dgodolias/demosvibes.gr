import { Link } from 'react-router-dom';
import HubIcon from '../components/HubIcon';
import LocalSearch from '../components/LocalSearch';
import Seo from '../components/Seo';
import WebsitePreview from '../components/WebsitePreview';
import { useCatalogSearch } from '../lib/useCatalogSearch';

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
            {showQr && <article id="qrcode-style-gen" className="hub-tool-card" aria-labelledby="qr-title">
              <div className="hub-tool-banner"><h2 id="qr-title">QRCodeStyleGen</h2></div>
              <div className="hub-tool-body"><WebsitePreview url="https://dgodolias.github.io/QRCodeStyleGen/" title="Προεπισκόπηση QRCodeStyleGen" action="Άνοιγμα εργαλείου" />
                <div className="hub-tool-details"><div className="hub-tool-content"><p className="hub-tool-kicker">QR codes στα μέτρα σου</p><p>Φτιάξε το δικό σου QR code με χρώματα, σχήματα και λογότυπο. Όλα γίνονται μέσα στον browser σου.</p><div className="hub-tags"><span>QR generator</span><span>Web app</span><span>Δωρεάν</span></div></div><a className="hub-external-row" href="https://dgodolias.github.io/QRCodeStyleGen/" target="_blank" rel="noopener noreferrer">Δοκίμασέ το<HubIcon name="arrow" /></a></div>
              </div>
            </article>}
            {showContego && <article id="contego" className="hub-tool-card hub-tool-contego" aria-labelledby="contego-title">
              <div className="hub-tool-banner"><h2 id="contego-title">Contego</h2><span className="hub-soon">Έρχεται σύντομα</span></div>
              <div className="hub-tool-body"><div className="hub-contego-art"><img src="/assets/contego/icon128.png" alt="" width={72} height={72} /><strong>Contego</strong><span>Your browsing. Your choices.</span></div>
                <div className="hub-tool-details"><div className="hub-tool-content"><p className="hub-tool-kicker">Οι επιλογές σου στο browsing</p><p>Extension που χειρίζεται τα cookie banners με τις προτιμήσεις σου και προσφέρει προαιρετικό ad blocking.</p><div className="hub-tags"><span>Chrome extension</span><span>Privacy</span></div><p className="hub-coming-note">Η εγκατάσταση θα είναι διαθέσιμη σύντομα.</p></div>
                  <div className="hub-supplement"><span>Συμπληρωματικό υλικό</span><Link to="/tools/contego/privacy/"><HubIcon name="document" />Πολιτική απορρήτου<HubIcon name="arrow" /></Link><small>Πώς λειτουργεί το Contego και ποια δεδομένα χρησιμοποιεί.</small></div>
                </div>
              </div>
            </article>}
          </div>
          {showKickbacks && <>
            <div className="hub-tools-toolbar hub-tools-used"><h2>Εργαλεία που χρησιμοποιώ <span>1</span></h2><p>Δεν είναι δικά μου και δεν έχω σχέση με τις εταιρείες που τα φτιάχνουν.</p></div>
            <div className="hub-used-grid">
              <article id="kickbacks-ai" className="hub-tool-card hub-tool-thirdparty" aria-labelledby="kickbacks-title">
                <div className="hub-tool-banner"><h2 id="kickbacks-title">Kickbacks.ai</h2><span className="hub-soon">Εργαλείο τρίτου</span></div>
                <div className="hub-tool-body"><Link className="hub-tool-shot" to="/kickbacks-ai/" aria-label="Οδηγός για το Kickbacks.ai"><img src="/thumbs/kickbacks-ai_thumb.jpg" alt="" width={480} height={300} loading="lazy" /></Link>
                  <div className="hub-tool-details"><div className="hub-tool-content"><p className="hub-tool-kicker">Χρήματα όσο «σκέφτεται» το AI</p><p>Extension για VS Code που δείχνει μια διαφήμιση μίας γραμμής όσο δουλεύει το Claude Code ή το Codex και σου πιστώνει μέρος των εσόδων. Το χρησιμοποιώ, αλλά δεν είναι δικό μου: διάβασε τη δήλωση αποποίησης ευθύνης και κάνε τη δική σου έρευνα.</p><div className="hub-tags"><span>VS Code extension</span><span>Claude Code</span><span>Codex</span></div></div><Link className="hub-external-row" to="/kickbacks-ai/">Δες τον οδηγό βήμα βήμα<HubIcon name="arrow" /></Link></div>
                </div>
              </article>
            </div>
          </>}
          {count === 0 && !showKickbacks && <div className="hub-empty"><h2>Δεν βρέθηκε κάποιο εργαλείο.</h2><p>Δοκίμασε «QR», «cookies» ή μια περιγραφή αυτού που χρειάζεσαι.</p><button type="button" onClick={() => setQuery('')}>Εμφάνιση όλων</button></div>}
        </section>
      </main>
    </>
  );
}
