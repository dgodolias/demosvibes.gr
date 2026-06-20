import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import 'vite-react-ssg'; // augments UserConfig with `ssgOptions`

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  // Single instance of react + react-router so the SSR router context that
  // vite-react-ssg provides is the same one <Link> reads from.
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router', 'react-router-dom'],
  },
  // Emit one <slug>/index.html per route so trailing-slash canonical URLs
  // (e.g. /founders-idea/) are served natively by Netlify.
  ssgOptions: {
    dirStyle: 'nested',
    formatting: 'minify',
  },
} as UserConfig);
