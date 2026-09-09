import { Link } from 'react-router-dom';
import { site } from '../data/site';

export default function SiteFooter() {
  return <footer className="hub-footer"><div className="hub-container hub-footer-inner"><div><strong>{site.domain}</strong><span>Λιγότερο ψάξιμο. Περισσότερη πράξη.</span></div><div className="hub-footer-links"><a href="https://www.instagram.com/demos.vibes/" target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href="https://www.tiktok.com/@demos.vibes" target="_blank" rel="noopener noreferrer">TikTok ↗</a><Link to="/privacy">Πολιτική απορρήτου</Link></div></div></footer>;
}
