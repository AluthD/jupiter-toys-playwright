import { toCents } from './priceHelper';

export interface Product {
  name: string;
  price: number;
  quantity: number;
}

// Cost of one cart line = unit price x quantity.
// The price is converted to cents first, so the result is a whole number
// (e.g. 10.99 x 2 -> 1099 x 2 = 2198 cents).
export function calculateItemCost(product: Product): number {
  return toCents(product.price) * product.quantity;
}

// Total cost of the order = sum of each item's cost (in cents).
export function calculateTotalCost(products: Product[]): number {
  return products.reduce((total, product) => total + calculateItemCost(product), 0);
}
