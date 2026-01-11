export type CurrencyType = 'USD' | 'VND';

// Database types (matching Supabase schema)
export interface Shop {
  id: string;
  name: string;
  currency: CurrencyType;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  shop_id: string;
  name: string;
  price: string; // Using string to handle large numbers without precision loss
  created_at: string;
  updated_at: string;
}

// UI types (for frontend usage)
export interface ShopUI {
  id: string;
  name: string;
  currency: CurrencyType;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductUI {
  id: string;
  shopId: string;
  name: string;
  price: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShopWithProducts extends ShopUI {
  products: ProductUI[];
}

// Helper functions to convert between DB and UI types
export function dbToUIShop(shop: Shop): ShopUI {
  return {
    id: shop.id,
    name: shop.name,
    currency: shop.currency,
    createdAt: new Date(shop.created_at),
    updatedAt: new Date(shop.updated_at),
  };
}

export function dbToUIProduct(product: Product): ProductUI {
  return {
    id: product.id,
    shopId: product.shop_id,
    name: product.name,
    price: product.price,
    createdAt: new Date(product.created_at),
    updatedAt: new Date(product.updated_at),
  };
}

export function uiToDBShop(shop: ShopUI): Omit<Shop, 'id'> {
  return {
    name: shop.name,
    currency: shop.currency,
    created_at: shop.createdAt.toISOString(),
    updated_at: shop.updatedAt.toISOString(),
  };
}

export function uiToDBProduct(product: ProductUI): Omit<Product, 'id'> {
  return {
    shop_id: product.shopId,
    name: product.name,
    price: product.price,
    created_at: product.createdAt.toISOString(),
    updated_at: product.updatedAt.toISOString(),
  };
}
