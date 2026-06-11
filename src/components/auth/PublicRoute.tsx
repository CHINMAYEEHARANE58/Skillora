import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-50 text-sm font-semibold text-ink-600 dark:bg-ink-950 dark:text-ink-300">
        Preparing Skillora...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  return <Outlet />;
}
