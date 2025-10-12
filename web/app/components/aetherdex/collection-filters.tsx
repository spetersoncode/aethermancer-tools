import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";

export type FilterMode = "all" | "collected" | "uncollected";

interface CollectionFiltersProps {
  filterMode: FilterMode;
  onFilterModeChange: (mode: FilterMode) => void;
}

export function CollectionFilters({
  filterMode,
  onFilterModeChange,
}: CollectionFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm font-medium">Show</p>
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant={filterMode === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterModeChange("all")}
            className={cn(
              "justify-start",
              filterMode === "all" && "shadow-md"
            )}
          >
            All Monsters
          </Button>
          <Button
            variant={filterMode === "collected" ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterModeChange("collected")}
            className={cn(
              "justify-start",
              filterMode === "collected" && "shadow-md"
            )}
          >
            Collected Only
          </Button>
          <Button
            variant={filterMode === "uncollected" ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterModeChange("uncollected")}
            className={cn(
              "justify-start",
              filterMode === "uncollected" && "shadow-md"
            )}
          >
            Uncollected Only
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
