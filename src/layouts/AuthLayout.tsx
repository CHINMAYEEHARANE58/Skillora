import { Moon, Sun } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import type { Theme } from "../hooks/useTheme";
import { Button } from "../components/ui/button";

type AuthLayoutProps = {
  theme: Theme;
  onThemeToggle: () => void;
};

export function AuthLayout({ theme, onThemeToggle }: AuthLayoutProps) {
  const ThemeIcon = theme === "dark" ? Sun : Moon;

  return (
    <div className="grid min-h-screen bg-ink-50 dark:bg-ink-950 lg:grid-cols-[1fr_0.95fr]">
      <section className="hidden border-r border-ink-200 bg-ink-950 p-10 text-white dark:border-white/10 lg:flex lg:flex-col">
        <Link className="flex items-center gap-3" to="/dashboard">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-sm font-black text-ink-950">
            S
          </span>
          <span className="text-lg font-black">Skillora</span>
        </Link>
        <div className="mt-auto max-w-xl">
          <p className="text-sm font-semibold uppercase text-teal-300">AI Career Copilot</p>
          <h1 className="mt-4 text-5xl font-black leading-tight">Build your career operating system.</h1>
          <p className="mt-5 text-lg leading-8 text-white/72">
            A polished workspace for role planning, skill growth, applications, and interview readiness.
          </p>
        </div>
      </section>

      <section className="flex min-h-screen flex-col px-5 py-5 sm:px-8">
        <div className="flex items-center justify-between">
          <Link className="flex items-center gap-3 lg:hidden" to="/dashboard">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink-950 text-sm font-black text-white dark:bg-white dark:text-ink-950">
              S
            </span>
            <span className="text-lg font-black text-ink-950 dark:text-white">Skillora</span>
          </Link>
          <div className="ml-auto">
            <Button
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              onClick={onThemeToggle}
              size="icon"
              variant="ghost"
            >
              <ThemeIcon aria-hidden="true" className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 items-center">
          <Outlet />
        </div>
      </section>
    </div>
  );
}
