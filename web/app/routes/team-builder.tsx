import { useState, useMemo } from 'react';
import type { Route } from './+types/team-builder';
import { Button } from '~/components/ui/button';
import { MonsterPairCard } from '~/components/shared/monster-pair-card';
import { MonsterFilters } from '~/components/shared/monster-filters';
import { TeamSlots } from '~/components/team-builder/team-slots';
import { TeamStats } from '~/components/team-builder/team-stats';
import {
  monsters,
  type Monster,
  type Element,
  type MonsterType,
} from '~/data/monsters';
import { monsterMatchesFilters } from '~/utils/monster-filters';

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'Team Builder - Aethermancer' },
    {
      name: 'description',
      content: 'Build and optimize your Aethermancer monster team',
    },
  ];
}

interface MonsterPair {
  base: Monster;
  shifted?: Monster;
  showBase?: boolean;
  showShifted?: boolean;
}

export default function TeamBuilder() {
  const [team, setTeam] = useState<(Monster | null)[]>([null, null, null]);
  const [searchQuery, setSearchQuery] = useState('');
  const [elementFilter, setElementFilter] = useState<Element | null>(null);
  const [typeFilter, setTypeFilter] = useState<MonsterType | null>(null);

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
    return monsterPairs
      .map((pair) => {
        const filters = { searchQuery, elementFilter, typeFilter };

        // Check if base monster matches filters
        const baseMatches = monsterMatchesFilters(pair.base, filters);

        // Check if shifted monster matches filters (if it exists)
        const shiftedMatches = pair.shifted
          ? monsterMatchesFilters(pair.shifted, filters)
          : false;

        return {
          ...pair,
          showBase: baseMatches,
          showShifted: shiftedMatches,
        };
      })
      .filter((pair) => pair.showBase || pair.showShifted); // Only include pairs where at least one monster matches
  }, [monsterPairs, searchQuery, elementFilter, typeFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setElementFilter(null);
    setTypeFilter(null);
  };

  const handleMonsterClick = (monsterId: string) => {
    const monster = monsters.find((m) => m.id === monsterId);
    if (!monster) return;

    // Check if monster is already in team
    const monsterIndex = team.findIndex((m) => m?.id === monsterId);
    if (monsterIndex !== -1) {
      // Remove from team
      const newTeam = [...team];
      newTeam[monsterIndex] = null;
      setTeam(newTeam);
      return;
    }

    // Find first empty slot
    const emptySlotIndex = team.findIndex((m) => m === null);
    if (emptySlotIndex !== -1) {
      const newTeam = [...team];
      newTeam[emptySlotIndex] = monster;
      setTeam(newTeam);
    }
  };

  const handleMonsterRemove = (index: number) => {
    const newTeam = [...team];
    newTeam[index] = null;
    setTeam(newTeam);
  };

  const handleClearTeam = () => {
    setTeam([null, null, null]);
  };

  const selectedMonsters = team.filter((m): m is Monster => m !== null);

  // Convert selected monsters to Set for easier lookup
  const selectedIds = useMemo(
    () => new Set(selectedMonsters.map((m) => m.id)),
    [selectedMonsters]
  );

  return (
    <div className="container mx-auto px-4 md:px-6 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Team Builder
        </h1>
        <p className="text-muted-foreground mt-1">
          Build your perfect team of three monsters
        </p>
      </div>

      {/* Main Content - Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 lg:gap-6 items-start">
        {/* Left Panel - Team Section (Sticky on desktop) */}
        <aside className="lg:sticky lg:top-[88px] space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">
                Your Team ({selectedMonsters.length}/3)
              </h2>
              {selectedMonsters.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleClearTeam}>
                  Clear
                </Button>
              )}
            </div>
            <TeamSlots team={team} onRemove={handleMonsterRemove} />
          </div>
          <TeamStats team={team} />
        </aside>

        {/* Right Panel - Monster Selection */}
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

          {/* Monster Grid */}
          {filteredPairs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredPairs.map((pair) => (
                <MonsterPairCard
                  key={pair.base.id}
                  baseMonster={pair.base}
                  shiftedMonster={pair.shifted}
                  selectedIds={selectedIds}
                  onMonsterClick={handleMonsterClick}
                  showBase={pair.showBase}
                  showShifted={pair.showShifted}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground text-lg">No monsters found</p>
              <p className="text-muted-foreground text-sm mt-2">
                Try adjusting your filters
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
