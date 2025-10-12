import { useMemo } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/aetherdex";
import { Button } from "~/components/ui/button";
import { CollectionGrid } from "~/components/aetherdex/collection-grid";
import { CollectionStats } from "~/components/aetherdex/collection-stats";
import { CollectionActions } from "~/components/aetherdex/collection-actions";
import { monsters, type Monster } from "~/data/monsters";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { ArrowLeft } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Aetherdex - Aethermancer" },
    {
      name: "description",
      content: "Track your Aethermancer monster collection",
    },
  ];
}

interface MonsterPair {
  base: Monster;
  shifted?: Monster;
}

export default function Aetherdex() {
  // Local storage for collected monsters
  const [collectedIds, setCollectedIds] = useLocalStorage<string[]>(
    "aetherdex-collection",
    []
  );

  // Convert array to Set for faster lookups
  const collectedSet = useMemo(
    () => new Set(collectedIds),
    [collectedIds]
  );

  // Group monsters into base/shifted pairs
  const monsterPairs = useMemo(() => {
    const pairs: MonsterPair[] = [];
    const processedIds = new Set<string>();

    monsters.forEach((monster) => {
      if (processedIds.has(monster.id)) return;

      // Check if this is a base monster (not shifted)
      if (!monster.id.endsWith("-shifted")) {
        const shiftedId = `${monster.id}-shifted`;
        const shiftedMonster = monsters.find((m) => m.id === shiftedId);

        pairs.push({
          base: monster,
          shifted: shiftedMonster,
        });

        processedIds.add(monster.id);
        if (shiftedMonster) {
          processedIds.add(shiftedMonster.id);
        }
      }
    });

    // Sort pairs alphabetically by base monster name
    return pairs.sort((a, b) => a.base.name.localeCompare(b.base.name));
  }, []);


  // Toggle collected state
  const handleToggleCollected = (monsterId: string) => {
    setCollectedIds((prev) => {
      if (prev.includes(monsterId)) {
        return prev.filter((id) => id !== monsterId);
      } else {
        return [...prev, monsterId];
      }
    });
  };

  // Load collection from file
  const handleLoadCollection = (ids: string[]) => {
    setCollectedIds(ids);
  };

  // Calculate stats
  const stats = useMemo(() => {
    const totalMonsters = monsters.length;
    const collectedCount = monsters.filter((m) =>
      collectedSet.has(m.id)
    ).length;

    const baseMonsters = monsters.filter(
      (m) => !m.id.endsWith("-shifted")
    );
    const shiftedMonsters = monsters.filter((m) =>
      m.id.endsWith("-shifted")
    );

    const totalBase = baseMonsters.length;
    const collectedBase = baseMonsters.filter((m) =>
      collectedSet.has(m.id)
    ).length;

    const totalShifted = shiftedMonsters.length;
    const collectedShifted = shiftedMonsters.filter((m) =>
      collectedSet.has(m.id)
    ).length;

    return {
      totalMonsters,
      collectedCount,
      totalBase,
      collectedBase,
      totalShifted,
      collectedShifted,
    };
  }, [collectedSet]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Aetherdex
              </h1>
              <p className="text-muted-foreground text-xs md:text-sm">
                Track your monster collection
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="flex-1 container mx-auto px-4 md:px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 lg:gap-6 items-start">
          {/* Left Panel - Stats and Actions (Sticky on desktop) */}
          <aside className="lg:sticky lg:top-[88px] space-y-3">
            <CollectionStats {...stats} />
            <CollectionActions
              collectedIds={collectedIds}
              onLoad={handleLoadCollection}
            />
          </aside>

          {/* Right Panel - Monster Collection Grid */}
          <main className="min-w-0">
            <CollectionGrid
              monsterPairs={monsterPairs}
              collectedIds={collectedSet}
              onToggleCollected={handleToggleCollected}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
