import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ElementBadge } from "./element-badge";
import { TypeBadge } from "./type-badge";
import { type Monster } from "~/data/monsters";
import { cn } from "~/lib/utils";

interface MonsterCardProps {
  monster: Monster;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function MonsterCard({
  monster,
  isSelected = false,
  onClick,
  className,
}: MonsterCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg hover:scale-[1.01] py-2",
        isSelected && "bg-primary/10 dark:bg-primary/20 shadow-xl border-primary/50 scale-[1.01]",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-3 p-3">
        {monster.image && (
          <div className="flex-shrink-0">
            <img
              src={monster.image}
              alt={monster.name}
              className="h-14 w-14 object-contain"
            />
          </div>
        )}
        <div className="flex-1 min-w-0 space-y-1.5">
          <h3 className="font-semibold text-base leading-tight">{monster.name}</h3>
          {monster.elements.length > 0 && (
            <div className="flex flex-wrap gap-0.5">
              {monster.elements.map((element) => (
                <ElementBadge key={element} element={element} />
              ))}
            </div>
          )}
          {monster.types.length > 0 && (
            <div className="flex flex-wrap gap-0.5">
              {monster.types.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
