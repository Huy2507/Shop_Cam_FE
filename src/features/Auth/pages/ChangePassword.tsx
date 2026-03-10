import {
  sanitizePasswordInput,
  validatePassword,
} from "@utils/passwordValidation";
import { useResolveErrorMessage } from "@utils/resolveErrorMessage";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("auth");
  const resolveErrorMessage = useResolveErrorMessage();
  const { code, email, fromVerifyReset } = location.state || {};

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!code || !email || !fromVerifyReset) {
      toast.error(t("changePassword.invalidData"));
      navigate("/forgot-password");
    }
  }, [code, email, fromVerifyReset, navigate, t]);

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isNewPassword: boolean,
  ) => {
    const sanitizedValue = sanitizePasswordInput(e.target.value);
    if (isNewPassword) {
      setNewPassword(sanitizedValue);
    } else {
      setConfirmPassword(sanitizedValue);
    }
  };

  const handleSetPassword = async () => {
    if (!code || !email) {
      toast.error(t("changePassword.invalidData"));
      return;
    }

    const validationResult = validatePassword(newPassword);
    if (!validationResult.isValid) {
      const errorMessage = validationResult.error?.startsWith("changePassword.")
        ? t(validationResult.error)
        : validationResult.error;
      toast.error(errorMessage || t("changePassword.invalidData"));
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t("changePassword.passwordMismatch"));
      return;
    }

    try {
      setIsLoading(true);
      await resetPassword(email, code, newPassword, confirmPassword);
      localStorage.removeItem("resetEmail");
      toast.success(t("changePassword.success"));
      navigate("/login");
    } catch (err) {
      toast.error(resolveErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSetPassword();
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
            {t("changePassword.title")}
          </h2>
          <p className="text-gray-600 dark:text-slate-400">
            {t("changePassword.welcome")}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl transition-colors duration-200 dark:border-slate-700 dark:bg-slate-800">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-200">
                {t("changePassword.newPassword.label")}
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400 dark:text-slate-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => handlePasswordChange(e, true)}
                  onKeyDown={handleKeyDown}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pr-12 pl-10 text-gray-900 placeholder-gray-400 transition-all focus:border-transparent focus:ring-2 focus:ring-violet-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
                  placeholder={t("changePassword.newPassword.placeholder")}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer text-gray-400 transition-colors hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                {t("changePassword.passwordRequirements")}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-200">
                {t("changePassword.confirmPassword.label")}
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400 dark:text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => handlePasswordChange(e, false)}
                  onKeyDown={handleKeyDown}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pr-12 pl-10 text-gray-900 placeholder-gray-400 transition-all focus:border-transparent focus:ring-2 focus:ring-violet-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
                  placeholder={t("changePassword.confirmPassword.placeholder")}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer text-gray-400 transition-colors hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full transform cursor-pointer rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 dark:focus:ring-offset-slate-900"
              disabled={isLoading}
              onClick={handleSetPassword}
            >
              {isLoading
                ? t("changePassword.changing")
                : t("changePassword.changeButton")}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/forgot-password")}
              className="inline-flex cursor-pointer items-center text-violet-500 transition-colors hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("verifyOTP.backToForgot")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

