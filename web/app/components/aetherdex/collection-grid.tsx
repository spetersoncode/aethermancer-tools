import { CollectionCard } from './collection-card';
import { type Monster } from '~/data/monsters';

interface MonsterPair {
  base: Monster;
  shifted?: Monster;
}

interface CollectionGridProps {
  monsterPairs: MonsterPair[];
  collectedIds: Set<string>;
  onToggleCollected: (monsterId: string) => void;
}

export function CollectionGrid({
  monsterPairs,
  collectedIds,
  onToggleCollected,
}: CollectionGridProps) {
  if (monsterPairs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground text-lg">No monsters found</p>
        <p className="text-muted-foreground text-sm mt-2">
          No monster data available
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {monsterPairs.map((pair) => (
        <CollectionCard
          key={pair.base.id}
          baseMonster={pair.base}
          shiftedMonster={pair.shifted}
          collectedIds={collectedIds}
          onToggleCollected={onToggleCollected}
        />
      ))}
    </div>
  );
}
