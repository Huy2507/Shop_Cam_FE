import CheckoutModal from "@components/cart/CheckoutModal";
import Footer from "@components/layout/Footer";
import Header from "@components/layout/Header";
import { useCart } from "../../../contexts/CartContext";
import { formatVnd } from "@utils/formatVnd";
import { getUnitPriceAfterDiscount, hasActiveDiscount } from "@utils/productPricing";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { items, totalCount, totalAmount, updateQuantity, removeItem } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold text-slate-800">Giỏ hàng</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16 text-center">
            <ShoppingBag className="mb-4 h-16 w-16 text-slate-300" />
            <p className="mb-2 text-slate-600">Giỏ hàng trống</p>
            <Link
              to="/products"
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <>
            <ul className="space-y-4">
              {items.map((item) => {
                const unitPrice = getUnitPriceAfterDiscount(item.price, item.discount);
                const lineTotal = unitPrice * item.quantity;
                return (
                  <li
                    key={item.productId}
                    className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-800 line-clamp-2">{item.name}</p>
                      <p className="mt-1 text-sm font-bold text-red-600">
                        {formatVnd(unitPrice)}
                        {hasActiveDiscount(item.discount) && (
                          <span className="ml-2 text-slate-400 line-through">
                            {formatVnd(item.price)}
                          </span>
                        )}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center rounded-lg border border-slate-200">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center text-slate-600 hover:bg-slate-50"
                            aria-label="Giảm số lượng"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-[2rem] text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center text-slate-600 hover:bg-slate-50"
                            aria-label="Tăng số lượng"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          aria-label="Xoá khỏi giỏ"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm text-slate-600">Thành tiền</p>
                      <p className="font-bold text-red-600">{formatVnd(lineTotal)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-600">Tổng số lượng</span>
                <span className="font-medium">{totalCount} sản phẩm</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-medium text-slate-800">Tổng thanh toán</span>
                <span className="text-xl font-bold text-red-600">
                  {formatVnd(totalAmount)}
                </span>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Link
                  to="/products"
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Tiếp tục mua
                </Link>
                <button
                  type="button"
                  className="rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white hover:bg-red-700"
                  onClick={() => setCheckoutOpen(true)}
                  disabled={items.length === 0}
                  title={items.length === 0 ? "Giỏ hàng trống" : "Nhập thông tin và đặt hàng"}
                >
                  Đặt hàng
                </button>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  );
}
