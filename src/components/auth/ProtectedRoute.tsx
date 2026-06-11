import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-50 text-sm font-semibold text-ink-600 dark:bg-ink-950 dark:text-ink-300">
        Checking your session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return <Outlet />;
}
