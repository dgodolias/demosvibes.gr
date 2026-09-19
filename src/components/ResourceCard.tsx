import { Link } from 'react-router-dom';
import type { Resource } from '../data/types';
import HubIcon from './HubIcon';

export default function ResourceCard({ resource, newest = false, priority = false }: { resource: Resource; newest?: boolean; priority?: boolean }) {
  const card = resource.card!;
  const { thumb } = card;
  const [date, format] = card.metaLine.split('·').map(part => part.trim());
  return (
    <li className="hub-video-item" data-status={card.status ?? 'active'} data-visible-after={card.visibleAfter}>
      <Link className="hub-video-card" to={'/' + resource.slug}>
        <div className={'hub-thumbnail' + (thumb?.type === 'pair' ? ' hub-thumbnail-pair' : '') + (thumb ? '' : ' hub-thumbnail-text')}>
          {!thumb
            ? <span className="hub-thumbnail-tags" aria-hidden="true">{card.cardTags.map(tag => <span key={tag}>{tag}</span>)}</span>
            : thumb.type === 'solo'
              ? <img src={thumb.src} alt={thumb.alt} loading={priority ? 'eager' : 'lazy'} width={480} height={300} />
              : <><img src={thumb.before.src} alt={thumb.before.alt} loading={priority ? 'eager' : 'lazy'} width={240} height={300} /><img src={thumb.after.src} alt={thumb.after.alt} loading={priority ? 'eager' : 'lazy'} width={240} height={300} /></>}
          {format && <span className="hub-format">{format}</span>}
        </div>
        <div className="hub-video-body">
          <div className="hub-video-meta"><time dateTime={resource.date}>{date}</time>{newest && <span>Τελευταίο video</span>}</div>
          <h3>{card.title}</h3><p>{card.desc}</p>
          <span className="hub-video-action">Δες το υλικό<HubIcon name="arrow" /></span>
        </div>
      </Link>
    </li>
  );
}
