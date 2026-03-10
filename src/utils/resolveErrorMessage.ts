import { AxiosError } from "axios";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

interface ErrorResponse {
  data: {
    errorCode?: string;
    errors?: string[];
  };
}

export function useResolveErrorMessage() {
  const { t } = useTranslation("error");

  const tRef = useRef(t);
  tRef.current = t;

  const resolveErrorMessage = useCallback((error: unknown): string => {
    if (error instanceof AxiosError && error.response) {
      const response = error.response as ErrorResponse;
      const errorCode = response.data?.errorCode;
      const errors = response.data?.errors ?? [];
      if (errorCode) {
        const translated = tRef.current(errorCode);
        if (translated !== errorCode) {
          return translated;
        }
      }

      if (errors.length > 0) {
        return errors[0];
      }
    }

    return tRef.current("UNKNOWN_ERROR");
  }, []);

  return resolveErrorMessage;
}
