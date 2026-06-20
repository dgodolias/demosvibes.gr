import { Link } from 'react-router-dom';
import type { Resource } from '../data/types';

/** One card in the landing resource grid. */
export default function ResourceCard({ resource }: { resource: Resource }) {
  const card = resource.card!;
  const { thumb } = card;

  const thumbClass =
    thumb.type === 'solo'
      ? 'resource-thumb solo' + (thumb.official ? ' official-cover' : '')
      : 'resource-thumb pair';

  return (
    <li className="resource-item">
      <Link className="resource-card" to={'/' + resource.slug}>
        <span className={thumbClass}>
          {thumb.type === 'solo' ? (
            <img src={thumb.src} alt={thumb.alt} loading="eager" />
          ) : (
            <>
              <img src={thumb.before.src} alt={thumb.before.alt} loading="eager" />
              <img src={thumb.after.src} alt={thumb.after.alt} loading="eager" />
            </>
          )}
        </span>
        <span className="resource-body">
          <span className="resource-meta">{card.metaLine}</span>
          <span className="resource-title">{card.title}</span>
          <span className="resource-desc">{card.desc}</span>
          <span className="resource-tags">
            {card.cardTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </span>
        </span>
      </Link>
    </li>
  );
}
