import { Link } from 'react-router-dom';
import type { CardLinkItem } from '../data/types';
import { ChatIcon, ToolIcon, ChevronIcon } from './icons';

/** List of large tappable links to child pages (e.g. the AI-staging index). */
export default function CardLinks({ items }: { items: CardLinkItem[] }) {
  return (
    <ul className="video-list" role="list">
      {items.map((item) => (
        <li key={item.to}>
          <Link className="card-link" to={item.to}>
            <span className="icon" aria-hidden="true">
              {item.icon === 'chat' ? <ChatIcon /> : <ToolIcon />}
            </span>
            <span className="meta">
              <span className="title">{item.title}</span>
              <span className="sub">{item.sub}</span>
            </span>
            <span className="chev" aria-hidden="true">
              <ChevronIcon />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
