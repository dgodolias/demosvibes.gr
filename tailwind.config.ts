import type { Config } from 'tailwindcss';

/**
 * The visual identity ("Stitch light theme") lives mostly in src/index.css as
 * ported component classes. Tailwind here exposes the same design tokens as
 * utilities so new UI (e.g. the email gate) can be built with utilities while
 * staying on-brand.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#f5f7f8',
        surface: 'rgba(255,255,255,0.82)',
        'surface-hi': '#ffffff',
        'surface-lo': '#eef3f1',
        ink: '#10131a',
        'ink-soft': '#252b36',
        muted: '#626d7c',
        quiet: '#8b95a3',
        line: 'rgba(16,19,26,0.10)',
        'line-strong': 'rgba(16,19,26,0.18)',
        accent: '#0b6b5d',
        'accent-2': '#d96b35',
        'accent-3': '#4056b4',
        'accent-soft': 'rgba(11,107,93,0.10)',
        'code-bg': '#111621',
        'code-fg': '#e9edf4',
      },
      fontFamily: {
        display: ['"Google Sans Display"', '"Google Sans Text"', 'system-ui', 'sans-serif'],
        body: ['"Google Sans Text"', '"Google Sans Display"', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', '"SF Mono"', 'Menlo', 'Consolas', 'monospace'],
      },
      borderRadius: {
        card: '8px',
        chip: '999px',
        small: '6px',
      },
      boxShadow: {
        card: '0 1px 0 rgba(16,19,26,0.04), 0 18px 40px -32px rgba(16,19,26,0.38)',
        soft: '0 12px 34px -28px rgba(16,19,26,0.35)',
      },
    },
  },
  plugins: [],
} satisfies Config;
