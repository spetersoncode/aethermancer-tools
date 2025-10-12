import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ElementBadge } from "./element-badge";
import { TypeBadge } from "./type-badge";
import { type Monster } from "~/data/monsters";
import { X } from "lucide-react";

interface TeamSlotsProps {
  team: (Monster | null)[];
  onRemove: (index: number) => void;
}

export function TeamSlots({ team, onRemove }: TeamSlotsProps) {
  return (
    <div className="space-y-2">
      {team.map((monster, index) => (
        <Card key={index} className="relative hover:shadow-md transition-shadow py-2">
          {monster ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1.5 top-1.5 h-6 w-6 hover:bg-destructive/10 hover:text-destructive z-10"
                onClick={() => onRemove(index)}
                aria-label={`Remove ${monster.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
              <CardContent className="p-2.5 pr-9">
                <div className="flex gap-2 items-start">
                  {monster.image && (
                    <div className="flex-shrink-0">
                      <img
                        src={monster.image}
                        alt={monster.name}
                        className="h-10 w-10 object-contain"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-semibold text-sm leading-tight">{monster.name}</h3>
                    <div className="flex flex-wrap gap-0.5">
                      {monster.elements.map((element) => (
                        <ElementBadge key={element} element={element} />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-0.5">
                      {monster.types.slice(0, 3).map((type) => (
                        <TypeBadge key={type} type={type} />
                      ))}
                      {monster.types.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{monster.types.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex h-16 items-center justify-center">
              <p className="text-muted-foreground text-xs">Empty Slot {index + 1}</p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
