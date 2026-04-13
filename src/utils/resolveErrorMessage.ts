import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { translateApiError } from "./translateApiError";

export function useResolveErrorMessage() {
  useTranslation("error");
  return useCallback((error: unknown) => translateApiError(error), []);
}

export { translateApiError };
