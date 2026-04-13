import type { NewsVisualTemplate } from "../../types/siteUi";

export const NEWS_VISUAL_TEMPLATE_IDS: readonly NewsVisualTemplate[] = [
  "classic",
  "editorial",
  "minimal",
  "bold",
  "glass",
] as const;

export const NEWS_VISUAL_LABELS: Record<
  NewsVisualTemplate,
  { title: string; hint: string }
> = {
  classic: { title: "Cổ điển", hint: "Nền trắng, viền gọn" },
  editorial: { title: "Tạp chí", hint: "Giấy ấm, chữ serif" },
  minimal: { title: "Tối giản", hint: "Kẻ ngang, ít khối" },
  bold: { title: "Nổi bật", hint: "Đậm, bóng, nhấn màu site" },
  glass: { title: "Kính mờ", hint: "Blur, viền sáng" },
};

export function normalizeNewsVisualTemplate(raw: string | undefined | null): NewsVisualTemplate {
  const v = (raw ?? "classic").toLowerCase();
  return NEWS_VISUAL_TEMPLATE_IDS.includes(v as NewsVisualTemplate)
    ? (v as NewsVisualTemplate)
    : "classic";
}

export type NewsVisualSkin = {
  section: string;
  title: string;
  emptyText: string;
  listUl: string;
  listItemLink: string;
  listThumb: string;
  listTitle: string;
  listExcerpt: string;
  gridGap: string;
  cardSmWrapper: string;
  cardSmInner: string;
  cardSmImg: string;
  cardSmOverlay: string;
  cardSmTitle: string;
  featureCol: string;
  featureInner: string;
  featureImg: string;
  featureOverlay: string;
  featureTitle: string;
};

export function getNewsVisualSkin(t: NewsVisualTemplate): NewsVisualSkin {
  switch (t) {
    case "editorial":
      return {
        section:
          "rounded-sm border border-stone-300/80 bg-[#faf8f5] p-5 shadow-sm sm:p-8",
        title:
          "mb-8 border-b border-stone-200 pb-4 text-center font-serif text-3xl font-bold tracking-tight text-stone-900",
        emptyText: "text-center text-sm text-stone-500",
        listUl: "space-y-5",
        listItemLink:
          "flex gap-4 border-l-4 border-amber-800/90 bg-white/70 p-4 shadow-sm transition hover:bg-white",
        listThumb: "relative h-28 w-40 shrink-0 overflow-hidden rounded bg-stone-200",
        listTitle: "line-clamp-2 font-serif text-lg font-semibold text-stone-900",
        listExcerpt: "mt-1 line-clamp-2 text-sm text-stone-600",
        gridGap: "gap-5",
        cardSmWrapper: "group block overflow-hidden rounded-sm",
        cardSmInner: "relative aspect-square overflow-hidden rounded-sm bg-stone-200 ring-1 ring-stone-300/80",
        cardSmImg: "h-full w-full object-cover transition duration-500 group-hover:scale-105",
        cardSmOverlay:
          "absolute inset-0 bg-gradient-to-t from-stone-900/85 via-stone-900/20 to-transparent",
        cardSmTitle:
          "absolute bottom-0 left-0 right-0 p-3 font-serif text-sm font-semibold text-amber-50",
        featureCol: "sm:col-span-2 lg:row-span-2",
        featureInner: "group block overflow-hidden rounded-sm",
        featureImg:
          "relative aspect-[16/10] overflow-hidden rounded-sm bg-stone-200 ring-1 ring-stone-400",
        featureOverlay:
          "absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-800/30 to-transparent",
        featureTitle:
          "absolute bottom-0 left-0 right-0 p-5 font-serif text-2xl font-bold text-amber-50",
      };
    case "minimal":
      return {
        section: "border-0 bg-transparent p-0 sm:p-0",
        title:
          "mb-8 text-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-500",
        emptyText: "text-center text-xs text-slate-400",
        listUl: "divide-y divide-slate-200 border-y border-slate-200",
        listItemLink:
          "flex gap-4 py-5 transition hover:bg-slate-50/80",
        listThumb: "relative h-24 w-36 shrink-0 overflow-hidden bg-slate-100",
        listTitle: "line-clamp-2 text-base font-medium text-slate-800",
        listExcerpt: "mt-1 line-clamp-2 text-sm font-light text-slate-500",
        gridGap: "gap-8",
        cardSmWrapper: "group block",
        cardSmInner: "relative aspect-[4/5] overflow-hidden bg-slate-100",
        cardSmImg:
          "h-full w-full object-cover grayscale transition duration-300 group-hover:grayscale-0 group-hover:scale-[1.02]",
        cardSmOverlay: "absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-80",
        cardSmTitle:
          "absolute bottom-0 left-0 right-0 p-3 text-xs font-medium uppercase tracking-wide text-white",
        featureCol: "sm:col-span-2 lg:row-span-2",
        featureInner: "group block",
        featureImg: "relative aspect-[16/10] overflow-hidden bg-slate-100",
        featureOverlay: "absolute inset-0 bg-slate-900/50",
        featureTitle:
          "absolute bottom-0 left-0 right-0 p-4 text-sm font-semibold uppercase tracking-widest text-white",
      };
    case "bold":
      return {
        section:
          "overflow-hidden rounded-2xl border-2 border-slate-800 bg-white shadow-2xl",
        title:
          "bg-slate-900 px-4 py-4 text-center text-lg font-black uppercase tracking-wide text-white",
        emptyText: "p-6 text-center text-sm text-slate-500",
        listUl: "space-y-3 p-4",
        listItemLink:
          "flex gap-4 rounded-xl border-2 border-slate-200 bg-white p-3 shadow-md transition hover:border-[var(--site-primary,#dc2626)] hover:shadow-lg",
        listThumb: "relative h-28 w-40 shrink-0 overflow-hidden rounded-lg bg-slate-200",
        listTitle: "line-clamp-2 text-base font-extrabold text-slate-900",
        listExcerpt: "mt-1 line-clamp-2 text-sm font-medium text-slate-600",
        gridGap: "gap-4 p-4 pt-0",
        cardSmWrapper: "group block overflow-hidden rounded-xl",
        cardSmInner:
          "relative aspect-square overflow-hidden rounded-xl bg-slate-200 shadow-lg ring-2 ring-slate-900/10 transition group-hover:ring-[var(--site-primary,#dc2626)]",
        cardSmImg: "h-full w-full object-cover transition group-hover:scale-110",
        cardSmOverlay: "absolute inset-0 bg-gradient-to-t from-black/80 to-black/10",
        cardSmTitle:
          "absolute bottom-0 left-0 right-0 p-3 text-sm font-bold text-white drop-shadow-md",
        featureCol: "sm:col-span-2 lg:row-span-2",
        featureInner: "group block overflow-hidden rounded-xl",
        featureImg:
          "relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-200 shadow-xl ring-2 ring-slate-900",
        featureOverlay: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent",
        featureTitle:
          "absolute bottom-0 left-0 right-0 p-5 text-xl font-black uppercase leading-tight text-white",
      };
    case "glass":
      return {
        section:
          "rounded-2xl border border-white/30 bg-white/35 p-5 shadow-2xl shadow-slate-400/30 backdrop-blur-md sm:p-7",
        title:
          "mb-6 text-center text-xl font-semibold text-slate-800 drop-shadow-sm",
        emptyText: "text-center text-sm text-slate-600",
        listUl: "space-y-3",
        listItemLink:
          "flex gap-4 rounded-xl border border-white/40 bg-white/40 p-3 shadow-md backdrop-blur-sm transition hover:bg-white/60",
        listThumb: "relative h-28 w-40 shrink-0 overflow-hidden rounded-lg bg-white/50",
        listTitle: "line-clamp-2 font-semibold text-slate-900",
        listExcerpt: "mt-1 line-clamp-2 text-sm text-slate-600",
        gridGap: "gap-4",
        cardSmWrapper: "group block overflow-hidden rounded-xl",
        cardSmInner:
          "relative aspect-square overflow-hidden rounded-xl border border-white/50 bg-white/30 shadow-lg backdrop-blur-sm",
        cardSmImg: "h-full w-full object-cover transition group-hover:scale-105",
        cardSmOverlay:
          "absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/10 to-transparent",
        cardSmTitle: "absolute bottom-0 left-0 right-0 p-3 text-sm font-medium text-white",
        featureCol: "sm:col-span-2 lg:row-span-2",
        featureInner: "group block overflow-hidden rounded-xl",
        featureImg:
          "relative aspect-[16/10] overflow-hidden rounded-xl border border-white/50 bg-white/30 shadow-xl backdrop-blur-md",
        featureOverlay:
          "absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-800/25 to-transparent",
        featureTitle:
          "absolute bottom-0 left-0 right-0 p-5 text-lg font-semibold text-white",
      };
    case "classic":
    default:
      return {
        section: "rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6",
        title: "mb-6 text-center text-xl font-bold text-slate-800",
        emptyText: "text-center text-sm text-slate-500",
        listUl: "space-y-4",
        listItemLink:
          "flex gap-4 rounded-lg border border-slate-100 bg-slate-50/80 p-3 transition hover:border-slate-200 hover:bg-white",
        listThumb: "relative h-28 w-40 shrink-0 overflow-hidden rounded-md bg-slate-200",
        listTitle: "line-clamp-2 font-semibold text-slate-800",
        listExcerpt: "mt-1 line-clamp-2 text-sm text-slate-600",
        gridGap: "gap-4",
        cardSmWrapper: "group block overflow-hidden rounded-lg",
        cardSmInner: "relative aspect-square overflow-hidden rounded-lg bg-slate-200",
        cardSmImg: "h-full w-full object-cover transition group-hover:scale-105",
        cardSmOverlay: "absolute inset-0 bg-gradient-to-t from-black/70 to-transparent",
        cardSmTitle: "absolute bottom-0 left-0 right-0 p-3 text-sm font-medium text-white",
        featureCol: "sm:col-span-2 lg:row-span-2",
        featureInner: "group block overflow-hidden rounded-lg",
        featureImg: "relative aspect-[16/10] overflow-hidden rounded-lg bg-slate-200",
        featureOverlay: "absolute inset-0 bg-gradient-to-t from-black/80 to-transparent",
        featureTitle: "absolute bottom-0 left-0 right-0 p-4 text-lg font-semibold text-white",
      };
  }
}

export function blogPageMainBg(template: NewsVisualTemplate): string {
  switch (template) {
    case "editorial":
      return "bg-[#f5f2eb]";
    case "minimal":
      return "bg-white";
    case "bold":
      return "bg-gradient-to-b from-slate-200 via-slate-100 to-slate-50";
    case "glass":
      return "bg-gradient-to-br from-slate-300/50 via-slate-100 to-amber-50/50";
    default:
      return "bg-slate-50";
  }
}
