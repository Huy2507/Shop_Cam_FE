import Footer from "@components/layout/Footer";
import Header from "@components/layout/Header";
import ProductGrid from "@components/home/ProductGrid";
import type { Product } from "../../../types/home";
import { getProducts } from "@services/homeApi";
import { useEffect, useState } from "react";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProducts("best");
        setProducts(data);
      } catch {
        setError("Không tải được danh sách sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold text-slate-800">Mua hàng online</h1>
        <p className="mb-4 text-sm text-slate-600">
          Danh sách sản phẩm được lấy từ API backend (filter mặc định: bán chạy nhất).
        </p>
        {error && (
          <p className="mb-4 text-sm text-red-600">
            {error}
          </p>
        )}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 animate-pulse">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col rounded-xl bg-white p-3 shadow-sm"
              >
                <div className="mb-3 h-32 rounded-lg bg-slate-200" />
                <div className="mb-2 h-4 w-3/4 rounded bg-slate-200" />
                <div className="mb-1 h-4 w-1/2 rounded bg-slate-200" />
                <div className="h-4 w-1/3 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        ) : (
          <ProductGrid products={products} title="Danh sách sản phẩm" />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;

