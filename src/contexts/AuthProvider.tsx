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
    // Storefront không tự gọi current-user khi mount để tránh redirect /login ngoài ý muốn.
    // current-user chỉ nên được kiểm tra ở luồng admin (AdminRequireAuth).
    setLoading(false);
  }, [location.pathname]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
