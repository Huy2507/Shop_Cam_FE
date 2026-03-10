import type { Banner as BannerType } from "../../types/home";

interface BannerProps {
  banner?: BannerType | null;
  className?: string;
}

const Banner = ({ banner, className = "" }: BannerProps) => {
  const urlimg = banner?.urlimg || "https://picsum.photos/1200/400?random=banner";
  const title = banner?.title;
  const link = banner?.link;

  const content = (
    <div
      className={`relative overflow-hidden rounded-xl bg-slate-200 ${className}`}
      style={{ aspectRatio: "1200/400", minHeight: 280 }}
    >
      <img
        src={urlimg}
        alt={title || "Banner"}
        className="h-full w-full object-cover"
      />
      {title && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <h2 className="text-center text-2xl font-bold text-white drop-shadow-lg sm:text-4xl">
            {title}
          </h2>
        </div>
      )}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <span className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg hover:bg-red-700">
          MUA NGAY
        </span>
      </div>
    </div>
  );

  if (link) {
    return (
      <a href={link} className="block">
        {content}
      </a>
    );
  }

  return content;
};

export default Banner;
