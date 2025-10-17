import { useMemo, useState } from 'react';
import type { Route } from './+types/aetherdex';
import { CollectionGrid } from '~/components/aetherdex/collection-grid';
import { CollectionStats } from '~/components/aetherdex/collection-stats';
import { CollectionActions } from '~/components/aetherdex/collection-actions';
import { MonsterFilters } from '~/components/shared/monster-filters';
import {
  monsters,
  type Monster,
  type Element,
  type MonsterType,
} from '~/data/monsters';
import { useLocalStorage } from '~/hooks/useLocalStorage';

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'Aetherdex - Aethermancer' },
    {
      name: 'description',
      content: 'Track your Aethermancer monster collection',
    },
  ];
}

interface MonsterPair {
  base: Monster;
  shifted?: Monster;
}

export default function Aetherdex() {
  // Local storage for collected monsters
  const [collectedIds, setCollectedIds] = useLocalStorage<string[]>(
    'aetherdex-collection',
    []
  );

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [elementFilter, setElementFilter] = useState<Element | null>(null);
  const [typeFilter, setTypeFilter] = useState<MonsterType | null>(null);

  // Convert array to Set for faster lookups
  const collectedSet = useMemo(() => new Set(collectedIds), [collectedIds]);

  // Group monsters into base/shifted pairs
  const monsterPairs = useMemo(() => {
    const pairs: MonsterPair[] = [];
    const processedIds = new Set<string>();

    monsters.forEach((monster) => {
      if (processedIds.has(monster.id)) return;

      // Check if this is a base monster (not shifted)
      if (!monster.id.endsWith('-shifted')) {
        const shiftedId = `${monster.id}-shifted`;
        const shiftedMonster = monsters.find((m) => m.id === shiftedId);

        pairs.push({
          base: monster,
          shifted: shiftedMonster,
        });

        processedIds.add(monster.id);
        if (shiftedMonster) {
          processedIds.add(shiftedMonster.id);
        }
      }
    });

    // Sort pairs alphabetically by base monster name
    return pairs.sort((a, b) => a.base.name.localeCompare(b.base.name));
  }, []);

  // Filter logic
  const filteredPairs = useMemo(() => {
    return monsterPairs.filter((pair) => {
      const monster = pair.base;

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
    });
  }, [monsterPairs, searchQuery, elementFilter, typeFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setElementFilter(null);
    setTypeFilter(null);
  };

  // Toggle collected state
  const handleToggleCollected = (monsterId: string) => {
    setCollectedIds((prev) => {
      if (prev.includes(monsterId)) {
        return prev.filter((id) => id !== monsterId);
      } else {
        return [...prev, monsterId];
      }
    });
  };

  // Load collection from file
  const handleLoadCollection = (ids: string[]) => {
    setCollectedIds(ids);
  };

  // Calculate stats
  const stats = useMemo(() => {
    const totalMonsters = monsters.length;
    const collectedCount = monsters.filter((m) =>
      collectedSet.has(m.id)
    ).length;

    const baseMonsters = monsters.filter((m) => !m.id.endsWith('-shifted'));
    const shiftedMonsters = monsters.filter((m) => m.id.endsWith('-shifted'));

    const totalBase = baseMonsters.length;
    const collectedBase = baseMonsters.filter((m) =>
      collectedSet.has(m.id)
    ).length;

    const totalShifted = shiftedMonsters.length;
    const collectedShifted = shiftedMonsters.filter((m) =>
      collectedSet.has(m.id)
    ).length;

    return {
      totalMonsters,
      collectedCount,
      totalBase,
      collectedBase,
      totalShifted,
      collectedShifted,
    };
  }, [collectedSet]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Aetherdex
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your monster collection
        </p>
      </div>

      {/* Main Content - Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 lg:gap-6 items-start">
        {/* Left Panel - Stats and Actions (Sticky on desktop) */}
        <aside className="lg:sticky lg:top-[88px] space-y-3">
          <CollectionStats {...stats} />
          <CollectionActions
            collectedIds={collectedIds}
            onLoad={handleLoadCollection}
          />
        </aside>

        {/* Right Panel - Monster Collection Grid */}
        <main className="min-w-0 space-y-4">
          {/* Filters */}
          <MonsterFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            elementFilter={elementFilter}
            onElementFilterChange={setElementFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            onClearFilters={clearFilters}
            resultCount={filteredPairs.length}
          />

          {/* Monster Collection Grid */}
          <CollectionGrid
            monsterPairs={filteredPairs}
            collectedIds={collectedSet}
            onToggleCollected={handleToggleCollected}
          />
        </main>
      </div>
    </div>
  );
}
