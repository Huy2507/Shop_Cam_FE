import type { Product } from "../../types/home";
import { useTranslation } from "react-i18next";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  title?: string;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}

const ProductGrid = ({
  products,
  title,
  activeFilter = "best",
  onFilterChange,
}: ProductGridProps) => {
  const { t } = useTranslation();
  const resolvedTitle = title ?? t("storefront.bestSellerUpper");
  const filters = [
    { id: "best", label: t("storefront.bestSellerUpper") },
    { id: "hot", label: t("storefront.hotSaleUpper") },
    { id: "combo", label: t("storefront.comboCheapUpper") },
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
      {onFilterChange && (
        <div className="mb-4 flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-700">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onFilterChange(f.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeFilter === f.id
                  ? "bg-red-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <h2 className="mb-4 text-lg font-bold uppercase text-slate-800 dark:text-slate-100">{resolvedTitle}</h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
