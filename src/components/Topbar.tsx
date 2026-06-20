import { Link } from 'react-router-dom';
import { site } from '../data/site';

/** Landing-page top bar: wordmark + GitHub link. */
export default function Topbar() {
  return (
    <header className="topbar" aria-label="Κύρια πλοήγηση">
      <Link className="wordmark" to="/" aria-label="dgodolias videos αρχική">
        <img className="wordmark-logo" src="/assets/logo_v2_180.png" alt="" width={34} height={34} />
        <span>videos</span>
      </Link>
      <a className="topbar-link" href={site.github} target="_blank" rel="noopener">
        GitHub
      </a>
    </header>
  );
}
