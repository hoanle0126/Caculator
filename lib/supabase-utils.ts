import { supabase } from './supabase'
import type { ShopUI, ProductUI } from '@/types'

// Shop operations
export async function getShops(): Promise<ShopUI[]> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(shop => ({
      id: shop.id,
      name: shop.name,
      currency: shop.currency,
      createdAt: new Date(shop.created_at),
      updatedAt: new Date(shop.updated_at),
    }))
  } catch (error) {
    console.error('Error fetching shops:', error)
    return []
  }
}

export async function createShop(shopData: Omit<ShopUI, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShopUI | null> {
  try {
    const now = new Date()
    const shopToInsert = {
      name: shopData.name,
      currency: shopData.currency,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    }

    const { data, error } = await supabase
      .from('shops')
      .insert(shopToInsert)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      currency: data.currency,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  } catch (error) {
    console.error('Error creating shop:', error)
    return null
  }
}

export async function updateShop(shopId: string, shopData: Partial<Omit<ShopUI, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ShopUI | null> {
  try {
    const updateData = {
      ...shopData,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('shops')
      .update(updateData)
      .eq('id', shopId)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      currency: data.currency,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  } catch (error) {
    console.error('Error updating shop:', error)
    return null
  }
}

export async function deleteShop(shopId: string): Promise<boolean> {
  try {
    // First, delete all products in this shop
    const { error: productsError } = await supabase
      .from('products')
      .delete()
      .eq('shop_id', shopId)

    if (productsError) throw productsError

    // Then delete the shop
    const { error } = await supabase
      .from('shops')
      .delete()
      .eq('id', shopId)

    if (error) throw error

    return true
  } catch (error) {
    console.error('Error deleting shop:', error)
    return false
  }
}

// Product operations
export async function getProductsByShop(shopId: string): Promise<ProductUI[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(product => ({
      id: product.id,
      shopId: product.shop_id,
      name: product.name,
      price: product.price,
      createdAt: new Date(product.created_at),
      updatedAt: new Date(product.updated_at),
    }))
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function createProduct(productData: Omit<ProductUI, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductUI | null> {
  try {
    const now = new Date()
    const productToInsert = {
      shop_id: productData.shopId,
      name: productData.name,
      price: productData.price,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    }

    const { data, error } = await supabase
      .from('products')
      .insert(productToInsert)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      shopId: data.shop_id,
      name: data.name,
      price: data.price,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  } catch (error) {
    console.error('Error creating product:', error)
    return null
  }
}

export async function updateProduct(productId: string, productData: Partial<Omit<ProductUI, 'id' | 'shopId' | 'createdAt' | 'updatedAt'>>): Promise<ProductUI | null> {
  try {
    const updateData = {
      ...productData,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      shopId: data.shop_id,
      name: data.name,
      price: data.price,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  } catch (error) {
    console.error('Error updating product:', error)
    return null
  }
}

export async function deleteProduct(productId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (error) throw error

    return true
  } catch (error) {
    console.error('Error deleting product:', error)
    return false
  }
}

// Get all products (for dashboard)
export async function getAllProducts(): Promise<ProductUI[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(product => ({
      id: product.id,
      shopId: product.shop_id,
      name: product.name,
      price: product.price,
      createdAt: new Date(product.created_at),
      updatedAt: new Date(product.updated_at),
    }))
  } catch (error) {
    console.error('Error fetching all products:', error)
    return []
  }
}
