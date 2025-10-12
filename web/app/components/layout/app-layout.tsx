import { Link, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import { Home, Library, Users } from "lucide-react";
import { cn } from "~/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/aetherdex", label: "Aetherdex", icon: Library },
    { to: "/team-builder", label: "Team Builder", icon: Users },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Site Branding */}
            <Link to="/" className="flex items-center space-x-2">
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Aethermancer Tools
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Button
                  key={link.to}
                  variant={isActive(link.to) ? "secondary" : "ghost"}
                  size="sm"
                  asChild
                >
                  <Link to={link.to} className="flex items-center gap-2">
                    <link.icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                </Button>
              ))}
            </nav>

            {/* Mobile Navigation */}
            <nav className="flex md:hidden items-center space-x-1">
              {navLinks.map((link) => (
                <Button
                  key={link.to}
                  variant={isActive(link.to) ? "secondary" : "ghost"}
                  size="icon"
                  asChild
                  className="h-9 w-9"
                >
                  <Link to={link.to}>
                    <link.icon className="h-4 w-4" />
                    <span className="sr-only">{link.label}</span>
                  </Link>
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Aethermancer Tools - Community tools for Aethermancer players
            </p>
            <p className="text-sm text-muted-foreground">
              Data from{" "}
              <a
                href="https://aethermancer.wiki.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                Aethermancer Wiki
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
