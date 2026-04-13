import { useTranslation } from "react-i18next";
import { resolveMediaUrl } from "@utils/mediaUrl";

export interface MidPromoItem {
  id: string;
  title: string;
  img: string;
  /** Nếu có — thẻ <a>; không có thì dùng # */
  href?: string | null;
}

const DEFAULT_PROMOS: MidPromoItem[] = [
  { id: "m1", title: "", img: "https://picsum.photos/400/150?random=apple1" },
  { id: "m2", title: "", img: "https://picsum.photos/400/150?random=apple2" },
  { id: "m3", title: "", img: "https://picsum.photos/400/150?random=gift" },
];

interface MidPromoGridProps {
  /** undefined = dùng 3 ô mặc định + i18n tiêu đề */
  items?: MidPromoItem[];
}

export default function MidPromoGrid({ items }: MidPromoGridProps) {
  const { t } = useTranslation();
  const useDefault = items === undefined;
  const resolvedItems: MidPromoItem[] = useDefault
    ? [
        { ...DEFAULT_PROMOS[0], title: t("storefront.midPromo1") },
        { ...DEFAULT_PROMOS[1], title: t("storefront.midPromo2") },
        { ...DEFAULT_PROMOS[2], title: t("storefront.midPromo3") },
      ]
    : items;

  if (!resolvedItems.length) return null;

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-3">
      {resolvedItems.map((item) => {
        const href = item.href?.trim() || "#";
        return (
          <a
            key={item.id}
            href={href}
            className="block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="relative aspect-[4/1.5] overflow-hidden">
              <img src={resolveMediaUrl(item.img)} alt={item.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <p className="text-center text-sm font-semibold text-white">{item.title}</p>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
