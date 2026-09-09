import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import GlobalSearch from './GlobalSearch';
import HubIcon from './HubIcon';

const sections = [
  { to: '/', label: 'Videos', icon: 'videos' },
  { to: '/tools', label: 'Tools', icon: 'tools' },
  { to: '/about', label: 'About me', icon: 'about' },
] as const;

export default function Topbar() {
  const { pathname, hash } = useLocation();
  const active = pathname.startsWith('/tools') ? '/tools' : pathname.startsWith('/about') ? '/about' : '/';
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) { target.scrollIntoView(); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return (
    <>
      <a className="hub-skip" href="#main-content">Μετάβαση στο περιεχόμενο</a>
      <header className="hub-header">
        <div className="hub-container hub-header-inner">
          <Link className="hub-brand" to="/" aria-label="Demos Vibes, αρχική Videos">
            <img src="/assets/logo_v2_180.png" alt="" width={40} height={40} />
            <span>demos<span>vibes</span></span>
          </Link>
          <nav className="hub-nav" aria-label="Κύρια πλοήγηση">
            {sections.map(({ to, label, icon }) => (
              <Link key={to} to={to} aria-current={active === to ? 'page' : undefined}>
                <HubIcon name={icon} />{label}
              </Link>
            ))}
          </nav>
          <GlobalSearch />
        </div>
      </header>
    </>
  );
}
