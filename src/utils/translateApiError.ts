import { AxiosError } from "axios";
import i18n from "../i18n/i18n";

/** Body lỗi từ API (camelCase hoặc PascalCase). */
function readErrorPayload(data: unknown): {
  errorCode?: string;
  errors: string[];
} {
  if (!data || typeof data !== "object") {
    return { errors: [] };
  }
  const o = data as Record<string, unknown>;
  const code = o.errorCode ?? o.ErrorCode;
  const errList = o.errors ?? o.Errors;
  const errors = Array.isArray(errList) ? errList.map(String) : [];
  return {
    errorCode: typeof code === "string" ? code : undefined,
    errors,
  };
}

/**
 * Dịch lỗi API sang chuỗi theo ngôn ngữ hiện tại (namespace `error`).
 * BE chỉ nên trả `errorCode` (+ tùy chọn `errors` kỹ thuật); không dựa vào chuỗi từ BE cho thông điệp người dùng.
 */
export function translateApiError(error: unknown): string {
  if (!(error instanceof AxiosError) || error.response?.data == null) {
    return i18n.t("UNKNOWN_ERROR", { ns: "error" });
  }

  const { errorCode, errors } = readErrorPayload(error.response.data);

  if (errorCode) {
    if (errorCode === "OTP_RESEND_COOLDOWN" && errors[0]) {
      const msg = i18n.t("OTP_RESEND_COOLDOWN", {
        ns: "error",
        seconds: errors[0],
      });
      if (msg && msg !== "OTP_RESEND_COOLDOWN") {
        return msg;
      }
    }

    const translated = i18n.t(errorCode, { ns: "error" });
    if (translated !== errorCode) {
      return translated;
    }
  }

  if (errors.length > 0) {
    return errors[0];
  }

  return i18n.t("UNKNOWN_ERROR", { ns: "error" });
}
