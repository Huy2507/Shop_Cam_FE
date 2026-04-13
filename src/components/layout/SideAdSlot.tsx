import { useMemo, useState } from "react";
import { resolveMediaUrl } from "@utils/mediaUrl";
interface SideAdSlotProps {
  label: string;
  ad?: {
    imageUrl: string;
    name: string;
    link?: string | null;
    openInNewTab?: boolean;
  } | null;
}

export default function SideAdSlot({ label, ad }: SideAdSlotProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = useMemo(() => resolveMediaUrl(ad?.imageUrl), [ad?.imageUrl]);
  const showImage = Boolean(ad && imageUrl && !imgError);
  const content = ad ? (
    showImage ? (
      <img
        src={imageUrl}
        alt={ad.name}
        className="h-full w-full rounded-lg object-cover"
        onError={() => setImgError(true)}
      />
    ) : (
      <div className="flex h-full items-center justify-center text-center text-xs text-slate-500 dark:text-slate-300">
        {ad.name || label}
      </div>
    )
  ) : (
    <div className="flex h-full items-center justify-center text-center text-xs text-slate-500 dark:text-slate-300">
      {label}
    </div>
  );

  if (ad?.link) {
    return (
      <a
        href={ad.link}
        target={ad.openInNewTab ? "_blank" : "_self"}
        rel={ad.openInNewTab ? "noreferrer" : undefined}
        className="sticky top-28 block h-[520px] w-full rounded-xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="sticky top-28 h-[520px] w-full rounded-xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {content}
    </div>
  );
}

