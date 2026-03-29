import { ChevronRight } from "lucide-react";
import { Fragment } from "react";
import { Link } from "react-router-dom";

export type BreadcrumbItem = {
  label: string;
  /** Có thì render Link; mục cuối thường bỏ trống */
  to?: string;
};

type BreadcrumbNavProps = {
  items: BreadcrumbItem[];
  variant?: "chevron" | "slash";
  className?: string;
};

export default function BreadcrumbNav({
  items,
  variant = "chevron",
  className = "",
}: BreadcrumbNavProps) {
  if (items.length === 0) return null;

  const lastIndex = items.length - 1;

  return (
    <nav
      className={`mb-4 flex flex-wrap items-center gap-1 text-sm text-slate-600 ${className}`.trim()}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === lastIndex;
        const showLink = Boolean(item.to);

        const Sep =
          variant === "slash" ? (
            <span className="mx-2 text-slate-400" aria-hidden>
              /
            </span>
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
          );

        return (
          <Fragment key={`${item.label}-${index}`}>
            {index > 0 && Sep}
            {showLink ? (
              <Link
                to={item.to!}
                className={isLast ? "line-clamp-1 text-slate-800 hover:text-red-600" : "hover:text-red-600"}
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "line-clamp-1 text-slate-800" : undefined}>{item.label}</span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
