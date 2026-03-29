/**
 * Cấu hình Zalo chat (Vite env, prefix VITE_).
 *
 * - VITE_ZALO_OA_ID: ID Zalo Official Account → bật widget (ô chat SDK).
 * - VITE_ZALO_CHAT_URL: link dự phòng (vd https://zalo.me/84987654321) khi chưa có OA hoặc mở nhanh tab mới.
 */

const trim = (v: string | undefined) => (typeof v === "string" ? v.trim() : "");

export function getZaloOfficialAccountId(): string | undefined {
  const id = trim(import.meta.env.VITE_ZALO_OA_ID);
  return id || undefined;
}

/** Link mở chat (Zalo app / web). Ưu tiên OA id → zalo.me/&lt;id&gt;. */
export function getZaloChatUrl(): string | undefined {
  const oa = getZaloOfficialAccountId();
  if (oa) return `https://zalo.me/${oa}`;
  const url = trim(import.meta.env.VITE_ZALO_CHAT_URL);
  return url || undefined;
}

export function getZaloWelcomeMessage(): string {
  return (
    trim(import.meta.env.VITE_ZALO_WELCOME_MESSAGE) ||
    "Shop Cam xin chào! Bạn cần tư vấn sản phẩm nào ạ?"
  );
}
