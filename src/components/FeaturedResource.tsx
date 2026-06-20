import { Link } from 'react-router-dom';
import type { Resource } from '../data/types';

/** The highlighted "latest" card in the hero. */
export default function FeaturedResource({ resource }: { resource: Resource }) {
  const card = resource.card!;
  const img =
    card.thumb.type === 'solo'
      ? { src: card.thumb.src, alt: card.thumb.alt }
      : { src: card.thumb.after.src, alt: card.thumb.after.alt };

  return (
    <Link
      className="featured-resource"
      to={'/' + resource.slug}
      aria-label={`Άνοιγμα υλικού για ${card.title}`}
    >
      <span className="featured-kicker">Τελευταίο</span>
      <span className="featured-title">{card.title}</span>
      <span className="featured-text">{card.desc}</span>
      <span className="featured-media solo" aria-hidden="true">
        <img src={img.src} alt="" loading="eager" />
      </span>
      <span className="featured-cta">Άνοιγμα υλικού</span>
    </Link>
  );
}
