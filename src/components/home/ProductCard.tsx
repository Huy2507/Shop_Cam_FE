import { useCart } from "../../contexts/CartContext";
import type { Product } from "../../types/home";

interface ProductCardProps {
  product: Product;
}

// Format giá tiền hiển thị trên thẻ sản phẩm.
const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

/**
 * Thẻ hiển thị 1 sản phẩm đơn lẻ trên grid:
 * - Ảnh, badge, trạng thái mới/hết hàng
 * - Giá gốc / giá khuyến mãi
 * - Nút "Thêm vào giỏ" mở modal chọn số lượng (không xử lý logic giỏ trực tiếp).
 */
const ProductCard = ({ product }: ProductCardProps) => {
  const { openAddToCartModal } = useCart();
  const hasDiscount = product.discount != null && product.discount > 0;
  const newPrice = hasDiscount ? product.price - (product.discount ?? 0) : product.price;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        {product.outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded bg-red-600 px-3 py-1 text-sm font-bold text-white">
              HẾT HÀNG
            </span>
          </div>
        )}
        {product.badge && !product.outOfStock && (
          <div className="absolute left-2 top-2 rounded bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
            {product.badge}
          </div>
        )}
        {product.isNew && !product.outOfStock && (
          <div className="absolute right-2 top-2 rounded bg-slate-700 px-2 py-0.5 text-xs font-medium text-white">
            Mới
          </div>
        )}
        {product.info && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-600/90 px-2 py-1 text-center text-xs font-medium text-white">
            {product.info}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="mb-2 line-clamp-2 text-sm font-medium text-slate-800">
          {product.name}
        </h3>

        <div className="mt-auto space-y-1">
          {hasDiscount ? (
            <>
              <p className="text-xs text-slate-500">Giá khuyến mãi:</p>
              <p className="text-lg font-bold text-red-600">{formatPrice(newPrice)}</p>
              <p className="text-sm text-slate-400 line-through">{formatPrice(product.price)}</p>
            </>
          ) : (
            <p className="text-lg font-bold text-red-600">{formatPrice(product.price)}</p>
          )}
        </div>

        {!product.outOfStock && (
          <button
            type="button"
            onClick={() => openAddToCartModal(product)}
            className="mt-3 w-full rounded-lg border border-red-600 bg-white py-2 text-sm font-medium text-red-600 transition hover:bg-red-600 hover:text-white"
          >
            Thêm vào giỏ
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
