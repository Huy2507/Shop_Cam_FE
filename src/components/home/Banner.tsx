import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Banner as BannerType } from "../../types/home";

interface BannerProps {
  banners?: BannerType[];
  className?: string;
}

const AUTOPLAY_MS = 5000;

const Banner = ({ banners = [], className = "" }: BannerProps) => {
  const { t } = useTranslation();
  const safeBanners = useMemo(
    () => (banners.length > 0 ? banners : [{ id: "fallback", urlimg: "https://picsum.photos/1200/400?random=banner" }]),
    [banners],
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [safeBanners.length]);

  useEffect(() => {
    if (safeBanners.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % safeBanners.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [safeBanners.length]);

  const activeBanner = safeBanners[activeIndex];

  const content = (
    <div
      className={`relative overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 ${className}`}
      style={{ aspectRatio: "1200/420", minHeight: 300 }}
    >
      <img
        src={activeBanner.urlimg}
        alt={activeBanner.title || "Banner"}
        className="h-full w-full object-cover"
      />
      {activeBanner.title && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <h2 className="text-center text-2xl font-bold text-white drop-shadow-lg sm:text-4xl">
            {activeBanner.title}
          </h2>
        </div>
      )}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <span className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg hover:bg-red-700">
          {t("common.storefront.buyNow")}
        </span>
      </div>
      {safeBanners.length > 1 && (
        <>
          <button
            type="button"
            aria-label={t("common.storefront.previousSlide")}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-1.5 text-white hover:bg-black/50"
            onClick={() =>
              setActiveIndex((prev) => (prev - 1 + safeBanners.length) % safeBanners.length)
            }
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label={t("common.storefront.nextSlide")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-1.5 text-white hover:bg-black/50"
            onClick={() => setActiveIndex((prev) => (prev + 1) % safeBanners.length)}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
            {safeBanners.map((b, idx) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`h-2 w-2 rounded-full ${idx === activeIndex ? "bg-white" : "bg-white/50"}`}
                aria-label={`${t("common.storefront.slide")} ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );

  if (activeBanner.link) {
    return (
      <a href={activeBanner.link} className="block">
        {content}
      </a>
    );
  }

  return content;
};

export default Banner;
