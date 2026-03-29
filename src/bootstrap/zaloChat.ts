import {
    getZaloOfficialAccountId,
    getZaloWelcomeMessage
} from "../constants/zaloConfig";

const ZALO_SDK_SRC = "https://sp.zalo.me/plugins/sdk.js";
const MARKER_ID = "shopcam-zalo-widget-host";

/** Gắn widget Zalo OA một lần khi load app. */
export function initZaloOfficialChatWidget(): void {
    if (typeof document === "undefined") return;
    const oaid = getZaloOfficialAccountId();
    if (!oaid || document.getElementById(MARKER_ID)) return;

    const host = document.createElement("div");
    host.id = MARKER_ID;
    const inner = document.createElement("div");
    inner.className = "zalo-chat-widget";
    inner.setAttribute("data-oaid", oaid);
    inner.setAttribute("data-welcome-message", getZaloWelcomeMessage());
    inner.setAttribute("data-autopopup", "0");
    inner.setAttribute("data-width", "360");
    inner.setAttribute("data-height", "420");
    inner.setAttribute("data-primary-color", "#dc2626");
    host.appendChild(inner);
    document.body.appendChild(host);

    if (document.querySelector(`script[src="${ZALO_SDK_SRC}"]`)) return;
    const s = document.createElement("script");
    s.src = ZALO_SDK_SRC;
    s.async = true;
    s.defer = true;
    document.body.append(s);
}
