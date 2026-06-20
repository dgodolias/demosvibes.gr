import { useState } from 'react';
import { CopyIcon } from './icons';

/** Copy-to-clipboard pill, ported from the original prompt-page behaviour. */
export default function CopyButton({ text }: { text: string }) {
  const [label, setLabel] = useState('Copy');
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setLabel('Copied');
      setCopied(true);
      setTimeout(() => {
        setLabel('Copy');
        setCopied(false);
      }, 1800);
    } catch {
      setLabel('Press Ctrl+C');
    }
  }

  return (
    <button
      type="button"
      className={'btn-pill' + (copied ? ' copied' : '')}
      onClick={copy}
      aria-label="Copy prompt to clipboard"
    >
      <CopyIcon />
      <span>{label}</span>
    </button>
  );
}
