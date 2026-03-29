export function hasActiveDiscount(discount?: number | null): boolean {
  return discount != null && discount > 0;
}

export function getUnitPriceAfterDiscount(price: number, discount?: number | null): number {
  return hasActiveDiscount(discount) ? price - (discount ?? 0) : price;
}
