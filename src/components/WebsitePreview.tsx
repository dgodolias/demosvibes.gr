import { useEffect, useRef, useState } from 'react';
import HubIcon from './HubIcon';

interface WebsitePreviewProps {
  url: string;
  title: string;
  action: string;
  width?: number;
  className?: string;
}

/** Read-only live preview; the containing link owns click and keyboard navigation. */
export default function WebsitePreview({ url, title, action, width = 1200, className = '' }: WebsitePreviewProps) {
  const container = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);
  const [loading, setLoading] = useState(true);
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const resize = () => setScale(element.clientWidth / width);
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, [width]);
  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => setSlow(true), 12_000);
    return () => window.clearTimeout(timer);
  }, [loading]);
  return (
    <a className={`hub-preview ${className}`} href={url} target="_blank" rel="noopener noreferrer" aria-label={`${title} — άνοιγμα σε νέα καρτέλα`}>
      <div className="hub-browser-bar" aria-hidden="true"><span className="hub-browser-dot" /><span className="hub-browser-dot" /><span className="hub-browser-dot" /><span className="hub-browser-url">{url.replace(/^https:\/\//, '').replace(/\/$/, '')}</span><HubIcon name="arrow" /></div>
      <div className="hub-frame" ref={container}>
        {loading && <div className="hub-preview-loading">{slow ? 'Πάτα εδώ για να ανοίξεις το site.' : 'Φόρτωση προεπισκόπησης…'}</div>}
        <iframe src={url} title={title} tabIndex={-1} aria-hidden="true" {...{ inert: '' }} loading="lazy" sandbox="allow-scripts allow-same-origin" referrerPolicy="strict-origin-when-cross-origin" style={{ width, transform: `scale(${scale})` }} onLoad={() => setLoading(false)} onError={() => setSlow(true)} />
      </div>
      <span className="hub-preview-action">{action}<HubIcon name="arrow" /></span>
    </a>
  );
}
