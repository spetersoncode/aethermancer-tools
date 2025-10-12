import { Badge } from "../ui/badge";
import { type MonsterType } from "~/data/monsters";
import { cn } from "~/lib/utils";

interface TypeBadgeProps {
  type: MonsterType;
  className?: string;
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  return (
    <Badge variant="secondary" className={cn(className)}>
      {type}
    </Badge>
  );
}
