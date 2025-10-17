import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ElementBadge } from '../team-builder/element-badge';
import { TypeBadge } from '../team-builder/type-badge';
import {
  type Element,
  type MonsterType,
  getAllElements,
  getAllTypes,
} from '~/data/monsters';
import { Search, X } from 'lucide-react';

interface MonsterFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  elementFilter: Element | null;
  onElementFilterChange: (element: Element | null) => void;
  typeFilter: MonsterType | null;
  onTypeFilterChange: (type: MonsterType | null) => void;
  onClearFilters: () => void;
  resultCount?: number;
}

export function MonsterFilters({
  searchQuery,
  onSearchChange,
  elementFilter,
  onElementFilterChange,
  typeFilter,
  onTypeFilterChange,
  onClearFilters,
  resultCount,
}: MonsterFiltersProps) {
  const hasActiveFilters = searchQuery || elementFilter || typeFilter;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search monsters..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-9"
        />
      </div>

      {/* Result Count */}
      {resultCount !== undefined && (
        <p className="text-xs text-muted-foreground">
          {resultCount} monster{resultCount !== 1 ? 's' : ''} found
        </p>
      )}

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
                  onElementFilterChange(
                    elementFilter === element ? null : element
                  )
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
                onClick={() =>
                  onTypeFilterChange(typeFilter === type ? null : type)
                }
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
              onClick={onClearFilters}
              size="sm"
              className="w-full h-8"
            >
              <X className="mr-2 h-3.5 w-3.5" />
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
