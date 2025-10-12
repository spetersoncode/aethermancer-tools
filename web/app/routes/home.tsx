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
    <div className="container mx-auto px-4 md:px-6 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Welcome
        </h1>
        <p className="text-muted-foreground mt-1">
          Build strategies and optimize your gameplay
        </p>
      </div>

      {/* Tool Cards */}
      <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
        <Card className="hover:shadow-lg hover:border-primary/30 transition-all">
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

        <Card className="hover:shadow-lg hover:border-primary/30 transition-all">
          <CardHeader>
            <CardTitle>Team Builder</CardTitle>
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
      </div>
    </div>
  );
}
