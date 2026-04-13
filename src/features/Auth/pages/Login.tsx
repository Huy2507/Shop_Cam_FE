import { useResolveErrorMessage } from "@utils/resolveErrorMessage";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");
  const resolveErrorMessage = useResolveErrorMessage();
  const [showPassword, setShowPassword] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      await login({ username: usernameOrEmail, password });
      toast.success(t("login.loginSuccess"));
      navigate("/");
    } catch (err) {
      const errorMessage = resolveErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4 transition-colors duration-200 dark:bg-slate-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 to-pink-500">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-slate-100">
            {t("login.title")}
          </h2>
          <p className="text-gray-600 dark:text-slate-400">
            {t("login.welcome")}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl transition-colors duration-200 dark:border-slate-700 dark:bg-slate-800">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-200">
                {t("login.usernameOrEmail.label")}
              </label>
              <div className="relative">
                <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400 dark:text-slate-400" />
                <input
                  type="text"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pr-4 pl-10 text-gray-900 placeholder-gray-400 transition-all focus:border-transparent focus:ring-2 focus:ring-violet-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
                  placeholder={t("login.usernameOrEmail.placeholder")}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-200">
                {t("login.password.label")}
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400 dark:text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pr-12 pl-10 text-gray-900 placeholder-gray-400 transition-all focus:border-transparent focus:ring-2 focus:ring-violet-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
                  placeholder={t("login.password.placeholder")}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-200 bg-gray-50 text-violet-500 focus:ring-2 focus:ring-violet-500 dark:border-slate-600 dark:bg-slate-700"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-slate-300">
                  {t("login.rememberMe")}
                </span>
              </label>
              <button
                type="button"
                className="mt-4 cursor-pointer text-sm text-violet-500 transition-colors hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-300"
                onClick={() => navigate("/forgot-password")}
                disabled={isLoading}
              >
                {t("login.forgotPassword")}
              </button>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/50 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full transform cursor-pointer rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:from-violet-600 hover:to-pink-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 dark:focus:ring-offset-slate-800"
              disabled={isLoading}
            >
              {isLoading ? t("login.loading") : t("login.loginButton")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

