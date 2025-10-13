import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';

interface CollectionStatsProps {
  totalMonsters: number;
  collectedCount: number;
  totalBase: number;
  collectedBase: number;
  totalShifted: number;
  collectedShifted: number;
}

export function CollectionStats({
  totalMonsters,
  collectedCount,
  totalBase,
  collectedBase,
  totalShifted,
  collectedShifted,
}: CollectionStatsProps) {
  const completionPercentage =
    totalMonsters > 0 ? Math.round((collectedCount / totalMonsters) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Collection Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall</span>
            <span className="text-2xl font-bold text-primary">
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="text-center text-sm text-muted-foreground">
            {collectedCount} / {totalMonsters} collected
          </div>
        </div>

        <Separator />

        {/* Detailed Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Base Monsters</span>
            <span className="text-sm font-semibold">
              {collectedBase} / {totalBase}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-500"
              style={{
                width: `${totalBase > 0 ? (collectedBase / totalBase) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Shifted Variants</span>
            <span className="text-sm font-semibold">
              {collectedShifted} / {totalShifted}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-purple-500 h-full transition-all duration-500"
              style={{
                width: `${totalShifted > 0 ? (collectedShifted / totalShifted) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
