import { useState, useMemo } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { MonsterCard } from './monster-card';
import { ElementBadge } from './element-badge';
import { TypeBadge } from './type-badge';
import {
  type Monster,
  type Element,
  type MonsterType,
  getAllElements,
  getAllTypes,
} from '~/data/monsters';
import { Search, X } from 'lucide-react';

interface MonsterGridProps {
  monsters: Monster[];
  selectedMonsters: Monster[];
  onMonsterSelect: (monster: Monster) => void;
}

export function MonsterGrid({
  monsters,
  selectedMonsters,
  onMonsterSelect,
}: MonsterGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [elementFilter, setElementFilter] = useState<Element | null>(null);
  const [typeFilter, setTypeFilter] = useState<MonsterType | null>(null);

  const filteredMonsters = useMemo(() => {
    return monsters.filter((monster) => {
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
  }, [monsters, searchQuery, elementFilter, typeFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setElementFilter(null);
    setTypeFilter(null);
  };

  const hasActiveFilters = searchQuery || elementFilter || typeFilter;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold mb-1">Available Monsters</h2>
        <p className="text-xs text-muted-foreground">
          {filteredMonsters.length} monster
          {filteredMonsters.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search monsters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-9"
        />
      </div>

      {/* Filters */}
      <div className="space-y-2.5 border rounded-lg p-3 bg-muted/30">
        {/* Element Filter */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs font-semibold">Filter by Element</h3>
            {elementFilter && (
              <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                Active
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {getAllElements().map((element) => (
              <button
                key={element}
                onClick={() =>
                  setElementFilter(elementFilter === element ? null : element)
                }
                className="transition-all hover:scale-105 active:scale-95"
              >
                <ElementBadge
                  element={element}
                  className={
                    elementFilter === element
                      ? 'shadow-lg scale-110 brightness-110'
                      : 'opacity-80 hover:opacity-100'
                  }
                />
              </button>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs font-semibold">Filter by Type</h3>
            {typeFilter && (
              <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                Active
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {getAllTypes().map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(typeFilter === type ? null : type)}
                className="transition-all hover:scale-105 active:scale-95"
              >
                <TypeBadge
                  type={type}
                  className={
                    typeFilter === type
                      ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                      : 'opacity-80 hover:opacity-100'
                  }
                />
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="pt-0.5">
            <Button
              variant="outline"
              onClick={clearFilters}
              size="sm"
              className="w-full h-8"
            >
              <X className="mr-2 h-3.5 w-3.5" />
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {/* Monster Grid - Natural Scrolling */}
      <div className="grid gap-3 md:grid-cols-1 xl:grid-cols-2 pb-4">
        {filteredMonsters.map((monster) => (
          <MonsterCard
            key={monster.id}
            monster={monster}
            isSelected={selectedMonsters.some((m) => m.id === monster.id)}
            onClick={() => onMonsterSelect(monster)}
          />
        ))}
      </div>
    </div>
  );
}
