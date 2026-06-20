import { Link } from 'react-router-dom';
import { site } from '../data/site';
import type { Crumb } from '../data/types';

/** Sub-page footer: a back-link mirroring the breadcrumb + a source link. */
export default function PageFooter({ crumb }: { crumb: Crumb }) {
  return (
    <footer className="page-footer">
      <Link to={crumb.to}>{crumb.label}</Link>
      <Link to="/privacy">Πολιτική Απορρήτου</Link>
      <a href={site.github} target="_blank" rel="noopener">
        github
      </a>
    </footer>
  );
}
