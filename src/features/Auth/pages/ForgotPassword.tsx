import { useResolveErrorMessage } from "@utils/resolveErrorMessage";
import { Mail } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/authService";

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const resolveErrorMessage = useResolveErrorMessage();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmail = async () => {
    if (!email) {
      toast.error(t("forgotPassword.email.placeholder"));
      return;
    }

    try {
      setIsLoading(true);
      await forgotPassword(email);
      localStorage.setItem("resetEmail", email);
      toast.success(t("forgotPassword.sendCodeSuccess"));
      navigate("/verify-otp", {
        state: { email, fromForgot: true },
      });
    } catch (err) {
      toast.error(resolveErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendEmail();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4 transition-colors duration-200 dark:bg-slate-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-slate-100">
            {t("forgotPassword.title")}
          </h2>
          <p className="text-base text-gray-600 dark:text-slate-400">
            {t("forgotPassword.description")}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl transition-colors duration-200 dark:border-slate-700 dark:bg-slate-800">
          <div className="space-y-6">
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-slate-200">
                {t("forgotPassword.email.label")}
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400 dark:text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pr-4 pl-10 text-gray-900 placeholder-gray-400 transition-all focus:border-transparent focus:ring-2 focus:ring-violet-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
                  placeholder={t("forgotPassword.email.placeholder")}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full transform cursor-pointer rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 dark:focus:ring-offset-slate-900"
              disabled={isLoading}
              onClick={handleSendEmail}
            >
              {isLoading
                ? t("forgotPassword.sending")
                : t("forgotPassword.sendCodeButton")}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {t("forgotPassword.rememberPassword")}{" "}
              <button
                onClick={() => navigate("/login")}
                className="inline-flex cursor-pointer items-center text-violet-500 transition-colors hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-300"
              >
                {t("forgotPassword.backToLogin")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

