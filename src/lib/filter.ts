import type { FilterTag, Resource } from '../data/types';

/** Greek-aware lowercasing — must match the original site's search behaviour. */
export function normalize(value: string): string {
  return value.toLocaleLowerCase('el-GR').trim();
}

/** The searchable text for a grid card (title + desc + meta + all tags). */
export function cardHaystack(r: Resource): string {
  const c = r.card;
  if (!c) return '';
  return normalize([c.title, c.desc, c.metaLine, c.cardTags.join(' '), c.searchTags.join(' ')].join(' '));
}

/** Does a resource match the current search query and active filter chip? */
export function matches(r: Resource, query: string, filter: FilterTag | 'all'): boolean {
  const q = normalize(query);
  const matchesSearch = !q || cardHaystack(r).includes(q);
  const matchesFilter = filter === 'all' || (r.card?.filters.includes(filter) ?? false);
  return matchesSearch && matchesFilter;
}
