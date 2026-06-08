import { NavLink } from "react-router-dom";
import { LogOut, Sparkles } from "lucide-react";
import { sidebarItems } from "../../data/app-data";
import { cn } from "../../utils/cn";
import { Button } from "../ui/button";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-ink-950/40 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-ink-200 bg-white px-4 py-5 transition-transform duration-300 dark:border-white/10 dark:bg-ink-950 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <a className="flex items-center gap-3 px-2" href="/dashboard">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink-950 text-sm font-black text-white dark:bg-white dark:text-ink-950">
            S
          </span>
          <div>
            <p className="font-black text-ink-950 dark:text-white">Skillora</p>
            <p className="text-xs font-medium text-ink-500 dark:text-ink-400">AI Career Copilot</p>
          </div>
        </a>

        <nav className="mt-8 space-y-1" aria-label="Dashboard navigation">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-ink-950 text-white dark:bg-white dark:text-ink-950"
                      : "text-ink-600 hover:bg-ink-100 hover:text-ink-950 dark:text-ink-300 dark:hover:bg-white/10 dark:hover:text-white"
                  )
                }
                onClick={onClose}
                to={item.href}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto rounded-lg border border-teal-200 bg-teal-50 p-4 dark:border-teal-400/20 dark:bg-teal-400/10">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-teal-500 text-white">
            <Sparkles aria-hidden="true" className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm font-bold text-ink-950 dark:text-white">Launch beta</p>
          <p className="mt-2 text-xs leading-5 text-ink-600 dark:text-ink-300">
            Frontend layout is ready for auth, profile, and career workflows.
          </p>
          <Button className="mt-4 w-full" size="sm" variant="secondary">
            View roadmap
          </Button>
        </div>

        <Button className="mt-4 justify-start" variant="ghost">
          <LogOut aria-hidden="true" className="h-4 w-4" />
          Sign out
        </Button>
      </aside>
    </>
  );
}
