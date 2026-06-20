import type { RouteRecord } from 'vite-react-ssg';
import { GateProvider } from './gate/GateContext';
import HomePage from './pages/HomePage';
import ResourcePage from './pages/ResourcePage';
import PrivacyPage from './pages/PrivacyPage';
import NotFound from './pages/NotFound';
import { resources } from './data/resources';

/**
 * Routes are flat (no Outlet layout): vite-react-ssg only prerenders the
 * element of a matched leaf route, so each page is a top-level route and the
 * email-gate provider wraps each page directly. This guarantees real content
 * in every prerendered HTML file (SEO), while the gate still appears on any
 * entry point (including deep links to sub-pages).
 */
const withGate = (node: React.ReactNode) => <GateProvider>{node}</GateProvider>;

export const routes: RouteRecord[] = [
  { path: '/', element: withGate(<HomePage />) },
  ...resources.map((r) => ({
    path: '/' + r.slug,
    element: withGate(<ResourcePage resource={r} />),
  })),
  { path: '/privacy', element: withGate(<PrivacyPage />) },
  { path: '*', element: withGate(<NotFound />) },
];

/** Concrete paths for the SSG crawler + sitemap generator. */
export const staticPaths: string[] = ['/', ...resources.map((r) => '/' + r.slug), '/privacy'];
