import { Card, CardContent } from '../ui/card';
import { ElementBadge } from '../team-builder/element-badge';
import { TypeBadge } from '../team-builder/type-badge';
import { type Monster } from '~/data/monsters';
import { cn } from '~/lib/utils';
import { Check } from 'lucide-react';

interface CollectionCardProps {
  baseMonster: Monster;
  shiftedMonster?: Monster;
  collectedIds: Set<string>;
  onToggleCollected: (monsterId: string) => void;
}

function MonsterDisplay({
  monster,
  isCollected,
  onToggle,
  label,
}: {
  monster: Monster;
  isCollected: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <div
      className={cn(
        'relative p-3 rounded-lg border-2 transition-all cursor-pointer',
        'hover:bg-accent/50',
        isCollected
          ? 'bg-primary/10 border-primary/50 shadow-md'
          : 'bg-card border-border'
      )}
      onClick={onToggle}
    >
      {/* Collected Checkmark */}
      {isCollected && (
        <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
          <Check className="h-4 w-4 text-primary-foreground" />
        </div>
      )}

      {/* Monster Image */}
      {monster.image && (
        <div className="flex justify-center mb-2">
          <img
            src={monster.image}
            alt={monster.name}
            className={cn(
              'h-20 w-20 object-contain transition-opacity',
              !isCollected && 'opacity-40 grayscale'
            )}
          />
        </div>
      )}

      {/* Label */}
      <div className="text-center">
        <span className="text-xs font-semibold text-muted-foreground uppercase">
          {label}
        </span>
      </div>

      {/* Monster Info */}
      <div className="space-y-1.5 mt-2">
        <h3 className="font-semibold text-sm text-center">
          {monster.name.replace(' (Shifted)', '')}
        </h3>

        {monster.elements.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center">
            {monster.elements.map((element) => (
              <ElementBadge
                key={element}
                element={element}
                className="text-xs"
              />
            ))}
          </div>
        )}

        {monster.types.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center">
            {monster.types.slice(0, 3).map((type) => (
              <TypeBadge key={type} type={type} className="text-xs" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CollectionCard({
  baseMonster,
  shiftedMonster,
  collectedIds,
  onToggleCollected,
}: CollectionCardProps) {
  const isBaseCollected = collectedIds.has(baseMonster.id);
  const isShiftedCollected = shiftedMonster
    ? collectedIds.has(shiftedMonster.id)
    : false;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          <MonsterDisplay
            monster={baseMonster}
            isCollected={isBaseCollected}
            onToggle={() => onToggleCollected(baseMonster.id)}
            label="Base"
          />
          {shiftedMonster ? (
            <MonsterDisplay
              monster={shiftedMonster}
              isCollected={isShiftedCollected}
              onToggle={() => onToggleCollected(shiftedMonster.id)}
              label="Shifted"
            />
          ) : (
            <div className="flex items-center justify-center p-3 rounded-lg border-2 border-dashed border-border bg-muted/20">
              <span className="text-xs text-muted-foreground">
                No Shifted Variant
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
