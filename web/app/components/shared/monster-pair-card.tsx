import { Card, CardContent } from '../ui/card';
import { ElementBadge } from '../team-builder/element-badge';
import { TypeBadge } from '../team-builder/type-badge';
import { type Monster } from '~/data/monsters';
import { cn } from '~/lib/utils';
import { Check } from 'lucide-react';

interface MonsterPairCardProps {
  baseMonster: Monster;
  shiftedMonster?: Monster;
  selectedIds?: Set<string>;
  onMonsterClick: (monsterId: string) => void;
  showCheckmark?: boolean;
  grayscaleUnselected?: boolean;
}

function MonsterDisplay({
  monster,
  isSelected,
  onToggle,
  label,
  showCheckmark,
  grayscaleUnselected,
}: {
  monster: Monster;
  isSelected: boolean;
  onToggle: () => void;
  label: string;
  showCheckmark?: boolean;
  grayscaleUnselected?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative p-3 rounded-lg border-2 transition-all cursor-pointer',
        'hover:bg-accent/50',
        isSelected
          ? 'bg-primary/10 border-primary/50 shadow-md'
          : 'bg-card border-border'
      )}
      onClick={onToggle}
    >
      {/* Checkmark */}
      {showCheckmark && isSelected && (
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
              grayscaleUnselected && !isSelected && 'opacity-40 grayscale'
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

export function MonsterPairCard({
  baseMonster,
  shiftedMonster,
  selectedIds = new Set(),
  onMonsterClick,
  showCheckmark = false,
  grayscaleUnselected = false,
}: MonsterPairCardProps) {
  const isBaseSelected = selectedIds.has(baseMonster.id);
  const isShiftedSelected = shiftedMonster
    ? selectedIds.has(shiftedMonster.id)
    : false;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          <MonsterDisplay
            monster={baseMonster}
            isSelected={isBaseSelected}
            onToggle={() => onMonsterClick(baseMonster.id)}
            label="Base"
            showCheckmark={showCheckmark}
            grayscaleUnselected={grayscaleUnselected}
          />
          {shiftedMonster ? (
            <MonsterDisplay
              monster={shiftedMonster}
              isSelected={isShiftedSelected}
              onToggle={() => onMonsterClick(shiftedMonster.id)}
              label="Shifted"
              showCheckmark={showCheckmark}
              grayscaleUnselected={grayscaleUnselected}
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
