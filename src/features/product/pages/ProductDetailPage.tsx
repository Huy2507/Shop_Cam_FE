import ProductCard from "@components/home/ProductCard";
import ProductReviewsSection from "@components/product/ProductReviewsSection";
import BreadcrumbNav from "@components/layout/BreadcrumbNav";
import Footer from "@components/layout/Footer";
import Header from "@components/layout/Header";
import { useCart } from "../../../contexts/CartContext";
import { getProductById, getRelatedProducts } from "@services/homeApi";
import type { Product, ProductDetail } from "../../../types/home";
import { formatVnd } from "@utils/formatVnd";
import { productDetailToProduct } from "@utils/mapProductDetailToProduct";
import { getUnitPriceAfterDiscount, hasActiveDiscount } from "@utils/productPricing";
import { Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

/**
 * Trang chi tiết sản phẩm (PDP): ảnh, giá, mô tả, số lượng, thêm giỏ, SP liên quan.
 */
export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [detail, setDetail] = useState<ProductDetail | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!productId) {
      navigate("/products", { replace: true });
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [p, rel] = await Promise.all([
          getProductById(productId),
          getRelatedProducts(productId).catch(() => [] as Product[]),
        ]);
        if (!cancelled) {
          setDetail(p);
          setRelated(rel);
          setQty(1);
        }
      } catch {
        if (!cancelled) {
          setError("Không tải được sản phẩm.");
          setDetail(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [productId, navigate]);

  const breadcrumbItems = useMemo(() => {
    if (!detail) {
      return [
        { label: "Trang chủ", to: "/" },
        { label: "Sản phẩm", to: "/products" },
      ];
    }
    return [
      { label: "Trang chủ", to: "/" },
      { label: "Sản phẩm", to: "/products" },
      ...(detail.categoryName
        ? [
            {
              label: detail.categoryName,
              to: `/products?category=${encodeURIComponent(detail.categoryName)}`,
            },
          ]
        : []),
      { label: detail.name },
    ];
  }, [detail]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Header />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
          <div className="animate-pulse grid gap-8 lg:grid-cols-2">
            <div className="aspect-square rounded-xl bg-slate-200" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded bg-slate-200" />
              <div className="h-6 w-1/2 rounded bg-slate-200" />
              <div className="h-24 rounded bg-slate-200" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Header />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 text-center">
          <p className="mb-4 text-slate-600">{error ?? "Không tìm thấy sản phẩm."}</p>
          <Link to="/products" className="text-red-600 underline">
            Về danh sách sản phẩm
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const hasDisc = hasActiveDiscount(detail.discount);
  const unit = getUnitPriceAfterDiscount(detail.price, detail.discount);

  const handleAddCart = () => {
    if (detail.outOfStock) return;
    addItem(productDetailToProduct(detail), qty);
    toast.success(`Đã thêm ${qty} sản phẩm vào giỏ hàng`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <BreadcrumbNav items={breadcrumbItems} variant="slash" className="text-slate-500" />

        <div className="grid gap-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl bg-slate-100">
            <img
              src={detail.imageUrl}
              alt={detail.name}
              className="mx-auto max-h-[480px] w-full object-contain"
            />
          </div>

          <div>
            {detail.badge && (
              <span className="mb-2 inline-block rounded bg-blue-600 px-2 py-0.5 text-xs text-white">
                {detail.badge}
              </span>
            )}
            <h1 className="text-2xl font-bold text-slate-900">{detail.name}</h1>
            {detail.categoryName && (
              <p className="mt-1 text-sm text-slate-500">Danh mục: {detail.categoryName}</p>
            )}
            <p className="mt-1 font-mono text-xs text-slate-400">Mã: {detail.id.slice(0, 8)}…</p>

            <div className="mt-4">
              {hasDisc ? (
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-3xl font-bold text-red-600">{formatVnd(unit)}</span>
                  <span className="text-lg text-slate-400 line-through">
                    {formatVnd(detail.price)}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-red-600">{formatVnd(detail.price)}</span>
              )}
            </div>

            <div className="mt-4">
              {detail.outOfStock ? (
                <span className="rounded bg-slate-800 px-3 py-1 text-sm font-semibold text-white">
                  Hết hàng
                </span>
              ) : (
                <span className="text-sm font-medium text-emerald-600">Còn hàng</span>
              )}
            </div>

            {!detail.outOfStock && (
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium text-slate-700">Số lượng</span>
                <div className="flex items-center rounded-lg border border-slate-200">
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center hover:bg-slate-50"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Giảm"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-[2rem] text-center font-medium">{qty}</span>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center hover:bg-slate-50"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Tăng"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAddCart}
                  className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            )}

            {detail.info && (
              <p className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-800">
                {detail.info}
              </p>
            )}
          </div>
        </div>

        <section className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-800">Mô tả & thông tin</h2>
          <div className="prose prose-sm max-w-none text-slate-700">
            {detail.description ? (
              <p className="whitespace-pre-wrap">{detail.description}</p>
            ) : (
              <p className="text-slate-500">
                Sản phẩm chính hàng, bảo hành theo chính sách Shop Cam. Liên hệ hotline để được tư vấn
                chi tiết thông số kỹ thuật và lắp đặt.
              </p>
            )}
          </div>
        </section>

        <ProductReviewsSection productId={detail.id} />

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-lg font-bold text-slate-800">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
