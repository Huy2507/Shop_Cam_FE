export function resolveMediaUrl(raw?: string | null): string {
  if (!raw) return "";
  let v = raw.trim();
  if (!v) return "";
  if (/^[a-zA-Z0-9_-]+$/.test(v)) return "";
  if (v.startsWith("uploads/")) v = `/${v}`;
  if (/^https?:\/\//i.test(v) || v.startsWith("data:")) return v;
  if (v.startsWith("/")) {
    const apiBase = (import.meta.env.VITE_API_URL ?? "").trim();
    if (apiBase) {
      try {
        return `${new URL(apiBase).origin}${v}`;
      } catch {
        return v;
      }
    }
  }
  return v;
}

