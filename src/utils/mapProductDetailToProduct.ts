import type { Product, ProductDetail } from "../types/home";

function hasPositiveDiscount(d: number | null | undefined): d is number {
  return d != null && d > 0;
}

export function productDetailToProduct(detail: ProductDetail): Product {
  return {
    id: detail.id,
    name: detail.name,
    price: detail.price,
    discount: hasPositiveDiscount(detail.discount) ? detail.discount : undefined,
    info: detail.info,
    imageUrl: detail.imageUrl,
    isNew: detail.isNew,
    outOfStock: detail.outOfStock,
    badge: detail.badge,
    categoryName: detail.categoryName,
  };
}
