export interface PasswordValidationResult {
  isValid: boolean;
  error?: string;
}

export const sanitizePasswordInput = (input: string): string => {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/[^A-Za-z0-9!@#$%^&*(),.?":{}|<>]/g, "");
};

export const validatePassword = (
  password: string,
): PasswordValidationResult => {
  if (password !== password.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) {
    return {
      isValid: false,
      error: "Password cannot contain diacritical marks",
    };
  }

  if (
    /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(password)
  ) {
    return {
      isValid: false,
      error: "changePassword.passwordInvalidEmoji",
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: "changePassword.passwordTooShort",
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: "changePassword.passwordNoUppercase",
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: "changePassword.passwordNoLowercase",
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: "changePassword.passwordNoNumber",
    };
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      error: "changePassword.passwordNoSpecial",
    };
  }

  if (/[^A-Za-z0-9!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      error: "changePassword.passwordInvalidSpecialChars",
    };
  }

  return { isValid: true };
};
