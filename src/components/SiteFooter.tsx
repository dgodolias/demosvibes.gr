import { Link } from 'react-router-dom';
import { site } from '../data/site';

/** Landing-page footer. */
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>{site.domain}</span>
      <span style={{ display: 'flex', gap: '14px' }}>
        <Link to="/privacy">Πολιτική Απορρήτου</Link>
        <a href={site.github} target="_blank" rel="noopener">
          source
        </a>
      </span>
    </footer>
  );
}
