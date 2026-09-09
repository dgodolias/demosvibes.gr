import { Link } from 'react-router-dom';

import Seo from '../components/Seo';
import { contegoPrivacyArticle } from '../data/contegoPrivacy';
import '../contego-privacy.css';

export default function ContegoPrivacyPage() {
  return (
    <>
      <Seo
        title="Privacy · Contego · demosvibes"
        description="How Contego handles consent banners, cookies and preferences in your browser. Privacy policy, version 1.2.3."
        path="/tools/contego/privacy/"
        ogType="website"
      />
      <main id="main-content" className="contego-privacy" lang="en">
        <header className="contego-privacy__header">
          <a className="contego-privacy__brand" href="#en">
            <img src="/assets/contego/icon96.png" alt="" width="44" height="44" />
            <span>Contego</span>
          </a>
          <nav className="contego-privacy__links" aria-label="Policy navigation">
            <a href="#support">Support</a>
            <Link to="/tools/">Back to tools <span aria-hidden="true">↗</span></Link>
          </nav>
        </header>

        {/* Reviewed local build-time snapshot; never accepts user or network HTML. */}
        <div dangerouslySetInnerHTML={{ __html: contegoPrivacyArticle }} />

        <section className="contego-privacy__hosting" aria-labelledby="policy-hosting">
          <h2 id="policy-hosting">Public website hosting</h2>
          <p>This policy page is hosted on Netlify.</p>
        </section>

        <footer className="contego-privacy__footer">
          <span>Contego · Privacy on your terms.</span>
          <a href="#en">Back to top <span aria-hidden="true">↑</span></a>
        </footer>
      </main>
    </>
  );
}
