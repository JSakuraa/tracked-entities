import type { Entity } from '../../shared/types';

export type SortDirection = 'asc' | 'desc';

/**
 * Returns the entities ordered by category. Entities that share a category
 * keep their existing relative order.
 */
export function sortByCategory(
  entities: Entity[],
  direction: SortDirection = 'asc',
): Entity[] {
  const modifier = direction === 'asc' ? 1 : -1;

  return entities.sort((a, b) => {
    if (a.category < b.category) return -1 * modifier;
    if (a.category > b.category) return 1 * modifier;
    return 0;
  });
}
