import type { RouteRecord } from 'vite-react-ssg';
import type { ReactNode } from 'react';
import { GateProvider } from './gate/GateContext';
import SiteFooter from './components/SiteFooter';
import Topbar from './components/Topbar';
import AboutPage from './pages/AboutPage';
import ContegoPrivacyPage from './pages/ContegoPrivacyPage';
import HomePage from './pages/HomePage';
import ResourcePage from './pages/ResourcePage';
import PrivacyPage from './pages/PrivacyPage';
import NotFound from './pages/NotFound';
import ToolsPage from './pages/ToolsPage';
import { resources } from './data/resources';

/**
 * Routes are flat (no Outlet layout): vite-react-ssg only prerenders the
 * element of a matched leaf route, so each page is a top-level route and the
 * email-gate provider wraps each page directly. This guarantees real content
 * in every prerendered HTML file (SEO), while the gate still appears on any
 * entry point (including deep links to sub-pages).
 */
function withShell(node: ReactNode, { gated = true, footer = false } = {}) {
  const page = <><Topbar />{node}{footer && <SiteFooter />}</>;
  return gated ? <GateProvider>{page}</GateProvider> : page;
}

export const routes: RouteRecord[] = [
  { path: '/', element: withShell(<HomePage />, { footer: true }) },
  { path: '/tools', element: withShell(<ToolsPage />, { footer: true }) },
  { path: '/about', element: withShell(<AboutPage />, { footer: true }) },
  // The store policy must remain directly readable without the email overlay.
  { path: '/tools/contego/privacy', element: withShell(<ContegoPrivacyPage />, { gated: false }) },
  ...resources.map((r) => ({
    path: '/' + r.slug,
    element: withShell(<ResourcePage resource={r} />),
  })),
  { path: '/privacy', element: withShell(<PrivacyPage />) },
  { path: '*', element: withShell(<NotFound />) },
];

/** Concrete paths for the SSG crawler + sitemap generator. */
export const staticPaths: string[] = ['/', '/tools', '/about', '/tools/contego/privacy', ...resources.map((r) => '/' + r.slug), '/privacy'];
