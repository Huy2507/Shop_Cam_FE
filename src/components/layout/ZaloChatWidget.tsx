import { getZaloChatUrl, getZaloOfficialAccountId } from "@constants/zaloConfig";
import { SiZalo } from "react-icons/si";

/**
 * Chỉ nút fallback khi không dùng OA widget (widget gắn từ main.tsx).
 */
export default function ZaloChatWidget() {
  if (getZaloOfficialAccountId()) return null;

  const fallbackUrl = getZaloChatUrl();
  if (!fallbackUrl) return null;

  return (
    <a
      href={fallbackUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-[#0068FF] text-white shadow-lg transition hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#0068FF] focus:ring-offset-2"
      title="Chat Zalo"
      aria-label="Mở chat Zalo"
    >
      <SiZalo className="h-8 w-8" aria-hidden />
    </a>
  );
}
