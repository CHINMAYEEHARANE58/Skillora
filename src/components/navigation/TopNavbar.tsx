import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import type { Theme } from "../../hooks/useTheme";
import { Avatar } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type TopNavbarProps = {
  theme: Theme;
  onMenuClick: () => void;
  onThemeToggle: () => void;
};

export function TopNavbar({ theme, onMenuClick, onThemeToggle }: TopNavbarProps) {
  const ThemeIcon = theme === "dark" ? Sun : Moon;

  return (
    <header className="sticky top-0 z-30 border-b border-ink-200 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-ink-950/80">
      <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6">
        <Button aria-label="Open navigation" onClick={onMenuClick} size="icon" variant="ghost" className="lg:hidden">
          <Menu aria-hidden="true" className="h-5 w-5" />
        </Button>

        <div className="hidden max-w-md flex-1 items-center md:flex">
          <div className="relative w-full">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <Input className="pl-9" placeholder="Search goals, roles, notes..." />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Badge className="hidden sm:inline-flex" variant="success">
            Beta workspace
          </Badge>
          <Button aria-label="Notifications" size="icon" variant="ghost">
            <Bell aria-hidden="true" className="h-5 w-5" />
          </Button>
          <Button
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={onThemeToggle}
            size="icon"
            variant="ghost"
          >
            <ThemeIcon aria-hidden="true" className="h-5 w-5" />
          </Button>
          <Avatar className="h-9 w-9" name="Chinmayee Harane" />
        </div>
      </div>
    </header>
  );
}
