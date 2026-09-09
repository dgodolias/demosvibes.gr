interface HubIconProps {
  name: 'videos' | 'tools' | 'about' | 'arrow' | 'document' | 'search';
  className?: string;
}

export default function HubIcon({ name, className = '' }: HubIconProps) {
  return (
    <svg className={`hub-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === 'videos' && <><rect x="3" y="4" width="18" height="16" rx="4" /><path d="m10 8 6 4-6 4Z" /></>}
      {name === 'tools' && <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><path d="M14 17.5h7m-3.5-3.5v7" /></>}
      {name === 'about' && <><circle cx="12" cy="8" r="3.5" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></>}
      {name === 'arrow' && <path d="M6 18 18 6M6 6h12v12" />}
      {name === 'document' && <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" /><path d="M14 3v6h6M8 13h8m-8 4h6" /></>}
      {name === 'search' && <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>}
    </svg>
  );
}
