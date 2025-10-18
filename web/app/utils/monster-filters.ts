import type { Monster, Element, MonsterType } from '~/data/monsters';

/**
 * Checks if a monster matches the given filter criteria
 */
export function monsterMatchesFilters(
  monster: Monster,
  filters: {
    searchQuery?: string;
    elementFilter?: Element | null;
    typeFilter?: MonsterType | null;
  }
): boolean {
  const { searchQuery, elementFilter, typeFilter } = filters;

  // Search filter
  if (
    searchQuery &&
    !monster.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) {
    return false;
  }

  // Element filter
  if (elementFilter && !monster.elements.includes(elementFilter)) {
    return false;
  }

  // Type filter
  if (typeFilter && !monster.types.includes(typeFilter)) {
    return false;
  }

  return true;
}
