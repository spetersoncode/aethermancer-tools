import { useState } from "react";
import type { Route } from "./+types/team-builder";
import { Button } from "~/components/ui/button";
import { MonsterGrid } from "~/components/team-builder/monster-grid";
import { TeamSlots } from "~/components/team-builder/team-slots";
import { TeamStats } from "~/components/team-builder/team-stats";
import { monsters, type Monster } from "~/data/monsters";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Team Builder - Aethermancer" },
    {
      name: "description",
      content: "Build and optimize your Aethermancer monster team",
    },
  ];
}

export default function TeamBuilder() {
  const [team, setTeam] = useState<(Monster | null)[]>([null, null, null]);

  const sortedMonsters = [...monsters].sort((a, b) => a.name.localeCompare(b.name));

  const handleMonsterSelect = (monster: Monster) => {
    // Check if monster is already in team
    const monsterIndex = team.findIndex((m) => m?.id === monster.id);
    if (monsterIndex !== -1) {
      // Remove from team
      const newTeam = [...team];
      newTeam[monsterIndex] = null;
      setTeam(newTeam);
      return;
    }

    // Find first empty slot
    const emptySlotIndex = team.findIndex((m) => m === null);
    if (emptySlotIndex !== -1) {
      const newTeam = [...team];
      newTeam[emptySlotIndex] = monster;
      setTeam(newTeam);
    }
  };

  const handleMonsterRemove = (index: number) => {
    const newTeam = [...team];
    newTeam[index] = null;
    setTeam(newTeam);
  };

  const handleClearTeam = () => {
    setTeam([null, null, null]);
  };

  const selectedMonsters = team.filter((m): m is Monster => m !== null);

  return (
    <div className="container mx-auto px-4 md:px-6 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Team Builder
        </h1>
        <p className="text-muted-foreground mt-1">
          Build your perfect team of three monsters
        </p>
      </div>

      {/* Main Content - Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 lg:gap-6 items-start">
        {/* Left Panel - Team Section (Sticky on desktop) */}
        <aside className="lg:sticky lg:top-[88px] space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Your Team ({selectedMonsters.length}/3)</h2>
              {selectedMonsters.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleClearTeam}>
                  Clear
                </Button>
              )}
            </div>
            <TeamSlots team={team} onRemove={handleMonsterRemove} />
          </div>
          <TeamStats team={team} />
        </aside>

        {/* Right Panel - Monster Selection */}
        <main className="min-w-0">
          <MonsterGrid
            monsters={sortedMonsters}
            selectedMonsters={selectedMonsters}
            onMonsterSelect={handleMonsterSelect}
          />
        </main>
      </div>
    </div>
  );
}
