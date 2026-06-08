import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/navigation/Sidebar";
import { TopNavbar } from "../components/navigation/TopNavbar";
import type { Theme } from "../hooks/useTheme";

type AppLayoutProps = {
  theme: Theme;
  onThemeToggle: () => void;
};

export function AppLayout({ theme, onThemeToggle }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <div className="lg:grid lg:grid-cols-[18rem_1fr]">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="min-w-0">
          <TopNavbar
            theme={theme}
            onMenuClick={() => setSidebarOpen(true)}
            onThemeToggle={onThemeToggle}
          />
          <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
