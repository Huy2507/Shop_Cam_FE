import type { Banner } from "../../types/home";

interface PromoBannersProps {
  banners: Banner[];
}

const PromoBanners = ({ banners }: PromoBannersProps) => {
  if (banners.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {banners.map((banner) => (
        <a
          key={banner.id}
          href={banner.link || "#"}
          className="block overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="relative aspect-[280/120] overflow-hidden">
            <img
              src={banner.urlimg}
              alt={banner.title || "Promo"}
              className="h-full w-full object-cover"
            />
            {banner.title && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <p className="text-center text-sm font-semibold text-white drop-shadow">
                  {banner.title}
                </p>
              </div>
            )}
          </div>
        </a>
      ))}
    </div>
  );
};

export default PromoBanners;
