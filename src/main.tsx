import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './routes';
import './index.css';

// vite-react-ssg builds a router from these routes, prerenders one HTML file
// per route at build time, then hydrates into an SPA at runtime.
export const createRoot = ViteReactSSG({ routes });
