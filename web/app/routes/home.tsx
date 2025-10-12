import type { Route } from "./+types/home";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Aethermancer Tools" },
    { name: "description", content: "Tools for Aethermancer players" },
  ];
}

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-3xl w-full space-y-12">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">Aethermancer Tools</h1>
          <p className="text-2xl text-muted-foreground">
            Build strategies and optimize your gameplay
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-xl hover:scale-[1.02] hover:border-primary/30 transition-all">
            <CardHeader>
              <CardTitle>Monster Team Builder</CardTitle>
              <CardDescription>
                Create and optimize your perfect team of three monsters. Filter by elements
                and types, and see real-time composition analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" asChild className="w-full">
                <Link to="/team-builder">Open Team Builder</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl hover:scale-[1.02] hover:border-primary/30 transition-all">
            <CardHeader>
              <CardTitle>Aetherdex</CardTitle>
              <CardDescription>
                Track your monster collection progress. Mark monsters as collected and
                see completion stats for both base and shifted variants.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" asChild className="w-full">
                <Link to="/aetherdex">Open Aetherdex</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
