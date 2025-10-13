import { Card, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import { ElementBadge } from './element-badge';
import { TypeBadge } from './type-badge';
import { type Monster, type Element, type MonsterType } from '~/data/monsters';

interface TeamStatsProps {
  team: (Monster | null)[];
}

export function TeamStats({ team }: TeamStatsProps) {
  const activeMonsters = team.filter((m): m is Monster => m !== null);

  // Count elements
  const elementCounts = activeMonsters.reduce(
    (acc, monster) => {
      monster.elements.forEach((element) => {
        acc[element] = (acc[element] || 0) + 1;
      });
      return acc;
    },
    {} as Record<Element, number>
  );

  // Count types
  const typeCounts = activeMonsters.reduce(
    (acc, monster) => {
      monster.types.forEach((type) => {
        acc[type] = (acc[type] || 0) + 1;
      });
      return acc;
    },
    {} as Record<MonsterType, number>
  );

  const sortedElements = Object.entries(elementCounts).sort(
    ([, a], [, b]) => b - a
  );
  const sortedTypes = Object.entries(typeCounts).sort(([, a], [, b]) => b - a);

  if (activeMonsters.length === 0) {
    return (
      <Card className="bg-muted/30 py-2">
        <CardContent className="p-3">
          <h3 className="text-xs font-semibold mb-1.5">Team Composition</h3>
          <p className="text-muted-foreground text-xs">
            Select monsters to see composition
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 py-2">
      <CardContent className="p-3 space-y-2">
        <h3 className="text-xs font-semibold">Team Composition</h3>

        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Elements
          </span>
          {sortedElements.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {sortedElements.map(([element, count]) => (
                <div key={element} className="flex items-center gap-0.5">
                  <ElementBadge element={element as Element} />
                  <span className="text-xs font-medium">×{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">None</span>
          )}
        </div>

        <Separator className="bg-primary/20" />

        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Types
          </span>
          {sortedTypes.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {sortedTypes.map(([type, count]) => (
                <div key={type} className="flex items-center gap-0.5">
                  <TypeBadge type={type as MonsterType} />
                  <span className="text-xs font-medium">×{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">None</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
