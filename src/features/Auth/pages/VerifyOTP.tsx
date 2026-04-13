import { useResolveErrorMessage } from "@utils/resolveErrorMessage";
import { ArrowLeft, Shield } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { resendOTP, verifyResetCode } from "../services/authService";

const VerifyOTP: React.FC = () => {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const location = useLocation();
  const resolveErrorMessage = useResolveErrorMessage();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const countdownRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const { email, fromForgot } = location.state || {};

  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [countdown]);

  useEffect(() => {
    if (!email || !fromForgot) {
      toast.error(t("verifyOTP.invalidAccess"));
      navigate("/login");
    } else {
      setCountdown(60);
    }
  }, [email, fromForgot, navigate, t]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "Enter" && !isLoading) {
      const fullCode = code.join("");
      if (fullCode.length === 6) {
        handleVerify();
      } else {
        const nextEmptyIndex = code.findIndex((digit) => !digit);
        if (nextEmptyIndex !== -1) {
          inputRefs.current[nextEmptyIndex]?.focus();
        }
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newCode = Array(6)
      .fill("")
      .map((_, i) => pastedData[i] || "");
    setCode(newCode);

    const lastFilledIndex = pastedData.length - 1;
    if (lastFilledIndex >= 0 && lastFilledIndex < 6) {
      inputRefs.current[Math.min(lastFilledIndex + 1, 5)]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      toast.error(t("verifyOTP.code.placeholder"));
      return;
    }

    try {
      setIsLoading(true);
      if (fromForgot) {
        await verifyResetCode(fullCode, email);
        toast.success(t("verifyOTP.verifySuccess"));
        navigate("/set-password", {
          state: { code: fullCode, email, fromVerifyReset: true },
        });
      }
    } catch (err) {
      toast.error(resolveErrorMessage(err));
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      await resendOTP(email, true);
      toast.success(t("verifyOTP.resendSuccess"));
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setCountdown(60);
    } catch (err) {
      toast.error(resolveErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4 transition-colors duration-200 dark:bg-slate-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-slate-100">
            {t("verifyOTP.title")}
          </h2>
          <p className="mb-2 text-base text-gray-600 dark:text-slate-400">
            {t("verifyOTP.description")}
          </p>
          <p className="font-medium text-gray-800 dark:text-slate-200">
            {email}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl transition-colors duration-200 dark:border-slate-700 dark:bg-slate-800">
          <div className="space-y-6">
            <div>
              <label className="mb-4 block text-center text-sm font-medium text-gray-700 dark:text-slate-200">
                {t("verifyOTP.code.label")}
              </label>

              <div
                className="flex justify-center space-x-3"
                onPaste={handlePaste}
              >
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      if (el) {
                        inputRefs.current[index] = el;
                      }
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`h-12 w-12 rounded-lg border-2 text-center text-xl font-bold transition-all ${
                      digit
                        ? "border-violet-500 bg-violet-50 dark:border-pink-500 dark:bg-slate-600"
                        : "border-gray-200 bg-gray-50 dark:border-slate-600 dark:bg-slate-700"
                    } text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-violet-500 focus:outline-none dark:text-slate-100 dark:placeholder-slate-400`}
                    required
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleVerify}
              disabled={isLoading}
              className="w-full transform cursor-pointer rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:from-violet-600 hover:to-pink-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 dark:focus:ring-offset-slate-800"
            >
              {isLoading ? t("verifyOTP.verifying") : t("verifyOTP.verifyButton")}
            </button>

            <div className="text-center">
              <p className="mb-2 text-sm text-gray-500 dark:text-slate-400">
                {t("verifyOTP.noCodeReceived")}
              </p>
              <button
                onClick={handleResendCode}
                disabled={isLoading || countdown > 0}
                className={`cursor-pointer text-sm font-medium transition-colors ${
                  countdown > 0
                    ? "cursor-not-allowed text-gray-400 dark:text-slate-500"
                    : "text-violet-500 hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-300"
                }`}
              >
                {countdown > 0
                  ? `${t("verifyOTP.resendCode")} (${countdown}s)`
                  : t("verifyOTP.resendCode")}
              </button>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6 dark:border-slate-700">
            <button
              onClick={() =>
                navigate("/forgot-password", {
                  state: { email },
                })
              }
              className="inline-flex cursor-pointer items-center text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300"
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

export default VerifyOTP;

