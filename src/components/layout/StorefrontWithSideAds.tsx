import type { ReactNode } from "react";
import SideAdSlot from "./SideAdSlot";

interface StorefrontWithSideAdsProps {
  children: ReactNode;
  leftAdLabel: string;
  rightAdLabel: string;
}

export default function StorefrontWithSideAds({
  children,
  leftAdLabel,
  rightAdLabel,
}: StorefrontWithSideAdsProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[180px_minmax(0,1fr)_180px]">
      <aside className="hidden xl:flex">
        <SideAdSlot label={leftAdLabel} />
      </aside>

      <div>{children}</div>

      <aside className="hidden xl:flex">
        <SideAdSlot label={rightAdLabel} />
      </aside>
    </div>
  );
}

