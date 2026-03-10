import type { Product } from "../../types/home";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  title?: string;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}

const ProductGrid = ({
  products,
  title = "BÁN CHẠY NHẤT",
  activeFilter = "best",
  onFilterChange,
}: ProductGridProps) => {
  const filters = [
    { id: "best", label: "BÁN CHẠY NHẤT" },
    { id: "hot", label: "HOT SALE" },
    { id: "combo", label: "COMBO SIÊU RẺ" },
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      {onFilterChange && (
        <div className="mb-4 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onFilterChange(f.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeFilter === f.id
                  ? "bg-red-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <h2 className="mb-4 text-lg font-bold uppercase text-slate-800">{title}</h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
