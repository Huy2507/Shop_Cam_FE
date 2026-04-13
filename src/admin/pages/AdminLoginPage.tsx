import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginForAdmin } from "../services/adminAuthService";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const next = params.get("next") || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginForAdmin({ username, password });
      if (data?.succeeded === false) {
        toast.error(data?.errors?.[0] ?? "Đăng nhập thất bại.");
        return;
      }
      toast.success("Đăng nhập admin thành công.");
      navigate(next, { replace: true });
    } catch {
      toast.error("Đăng nhập thất bại. Kiểm tra tài khoản, mật khẩu và quyền Admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <h1 className="mb-2 text-xl font-semibold text-slate-50">Đăng nhập Admin</h1>
        <p className="mb-4 text-sm text-slate-400">
          Tài khoản cần có role <strong className="text-slate-300">Admin</strong> trong hệ thống (bảng UserRoles).
        </p>
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            placeholder="Email / username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            placeholder="Mật khẩu"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
