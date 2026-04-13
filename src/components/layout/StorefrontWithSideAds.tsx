import type { ReactNode } from "react";
import SideAdSlot from "./SideAdSlot";

interface StorefrontWithSideAdsProps {
  children: ReactNode;
  leftAdLabel: string;
  rightAdLabel: string;
  leftAd?: {
    imageUrl: string;
    name: string;
    link?: string | null;
    openInNewTab?: boolean;
  } | null;
  rightAd?: {
    imageUrl: string;
    name: string;
    link?: string | null;
    openInNewTab?: boolean;
  } | null;
}

export default function StorefrontWithSideAds({
  children,
  leftAdLabel,
  rightAdLabel,
  leftAd,
  rightAd,
}: StorefrontWithSideAdsProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[180px_minmax(0,1fr)_180px]">
      <aside className="hidden xl:flex">
        <SideAdSlot label={leftAdLabel} ad={leftAd} />
      </aside>

      <div>{children}</div>

      <aside className="hidden xl:flex">
        <SideAdSlot label={rightAdLabel} ad={rightAd} />
      </aside>
    </div>
  );
}

