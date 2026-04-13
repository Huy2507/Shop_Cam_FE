import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  logout as authServiceLogout,
  getCurrentUser,
} from "../features/Auth/services/authService";
import { AuthContext, User } from "../hooks/useAuth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserInfo = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      console.log("Không thể call api getCurrentUser");
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    if (!user) {
      await fetchUserInfo();
    }
  };

  const logout = async () => {
    try {
      await authServiceLogout();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      setUser(null);
      navigate("/login");
    }
  };

  useEffect(() => {
    const authPages = new Set([
      "/login",
      "/forgot-password",
      "/verify-otp",
      "/change-password",
    ]);

    if (authPages.has(location.pathname)) {
      // Ở các trang auth không cần call current-user để tránh vòng lặp 401/refresh.
      setLoading(false);
      return;
    }

    void fetchUserInfo();
  }, [location.pathname]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
