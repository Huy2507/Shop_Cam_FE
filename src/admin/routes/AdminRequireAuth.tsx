import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../../features/Auth/services/authService";

interface Props {
  children: React.ReactNode;
}

export default function AdminRequireAuth({ children }: Props) {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        await getCurrentUser();
        setAuthorized(true);
      } catch {
        setAuthorized(false);
      } finally {
        setChecking(false);
      }
    };
    void check();
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        <p className="text-sm text-slate-400">Checking admin session...</p>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  return <>{children}</>;
}

