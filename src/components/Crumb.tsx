import { Link } from 'react-router-dom';
import { BackIcon } from './icons';

/** Breadcrumb back-link shown at the top of every sub-page. */
export default function Crumb({ label, to }: { label: string; to: string }) {
  return (
    <Link className="crumb" to={to}>
      <BackIcon />
      <span>{label}</span>
    </Link>
  );
}
