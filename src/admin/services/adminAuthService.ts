/**
 * Đăng nhập admin: user/password → JWT (cookie HttpOnly); refresh dùng accessFrom admin.
 */

import { ACCESS_FROM_STORAGE_KEY } from "@constants/authAccessFrom";
import api from "@services/axiosConfig";

export function setAccessFromAdmin() {
  sessionStorage.setItem(ACCESS_FROM_STORAGE_KEY, "admin");
}

/** Đăng nhập — BE trả Result + set cookie access_token / refresh_token. */
export async function loginForAdmin(credentials: {
  username: string;
  password: string;
}) {
  const response = await api.post("/api/Auth/login/admin", credentials);
  setAccessFromAdmin();
  return response.data;
}
