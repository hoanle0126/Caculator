'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Store, Package, DollarSign, Loader2 } from 'lucide-react';
import ShopManager from '@/components/ShopManager';
import ProductManager from '@/components/ProductManager';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getShops, getAllProducts } from '@/lib/supabase-utils';
import type { ShopUI, ProductUI, CurrencyType } from '@/types';

export default function Home() {
  const [selectedShopId, setSelectedShopId] = useState<string>('');
  const [shops, setShops] = useState<ShopUI[]>([]);
  const [products, setProducts] = useState<ProductUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedShop = shops.find(shop => shop.id === selectedShopId);
  const shopProducts = selectedShop ? products.filter(p => p.shopId === selectedShop.id) : [];

  const handleShopSelect = (shopId: string) => {
    console.log('handleShopSelect called with shopId:', shopId);
    console.log('Available shops count:', shops.length);
    console.log('Available shops details:', shops.map(s => ({ id: s.id, name: s.name, currency: s.currency })));
    console.log('Current selectedShopId:', selectedShopId);
    setSelectedShopId(shopId);
  };

  const handleProductsChange = (newProducts: ProductUI[]) => {
    setProducts(newProducts);
  };

  const getTotalValue = (currency: CurrencyType) => {
    const shopProducts = products.filter(p => {
      const shop = shops.find(s => s.id === p.shopId);
      return shop?.currency === currency;
    });
    
    return shopProducts.reduce((sum, product) => {
      const price = parseFloat(product.price);
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
  };

  const formatPrice = (price: number, currency: CurrencyType) => {
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);
    }
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedShops, fetchedProducts] = await Promise.all([
          getShops(),
          getAllProducts()
        ]);
        
        setShops(fetchedShops);
        setProducts(fetchedProducts);
        
        // Auto-select first shop if available
        if (fetchedShops.length > 0 && !selectedShopId) {
          setSelectedShopId(fetchedShops[0].id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update selected shop when shops change
  useEffect(() => {
    if (shops.length > 0 && !selectedShopId) {
      setSelectedShopId(shops[0].id);
    }
    // Nếu selectedShopId không tồn tại trong shops, chọn shop đầu tiên
    if (shops.length > 0 && selectedShopId) {
      const shopExists = shops.some(shop => shop.id === selectedShopId);
      if (!shopExists) {
        setSelectedShopId(shops[0].id);
      }
    }
  }, [shops, selectedShopId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
          <p className="mt-4 text-lg text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <ShoppingBag className="h-8 w-8 text-primary" />
                Hệ Thống Quản Lý Sản Phẩm
              </h1>
              <p className="text-muted-foreground mt-2">
                Quản lý cửa hàng và sản phẩm với hỗ trợ giá không giới hạn
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Card className="flex-1 min-w-[200px]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tổng số cửa hàng</p>
                      <p className="text-2xl font-bold">{shops.length}</p>
                    </div>
                    <Store className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="flex-1 min-w-[200px]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tổng số sản phẩm</p>
                      <p className="text-2xl font-bold">{products.length}</p>
                    </div>
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Currency Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng giá trị USD</p>
                    <p className="text-2xl font-bold">{formatPrice(getTotalValue('USD'), 'USD')}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng giá trị VND</p>
                    <p className="text-2xl font-bold">{formatPrice(getTotalValue('VND'), 'VND')}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        {/* Main Content */}
        <Tabs defaultValue="shops" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="shops" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Cửa hàng
            </TabsTrigger>
            <TabsTrigger 
              value="products" 
              className="flex items-center gap-2"
              disabled={!selectedShop}
            >
              <Package className="h-4 w-4" />
              Sản phẩm
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="shops" className="space-y-6">
            <ShopManager 
              onShopSelect={handleShopSelect}
              selectedShopId={selectedShopId}
            />
          </TabsContent>
          
          <TabsContent value="products" className="space-y-6">
            {selectedShop ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6 p-4 bg-card border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{selectedShop.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Quản lý sản phẩm cho {selectedShop.name} ({selectedShop.currency})
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Store className="h-5 w-5 text-primary" />
                      <span className="font-medium">{shopProducts.length} products</span>
                    </div>
                  </div>
                </div>
                
                <ProductManager
                  shopId={selectedShop.id}
                  shopCurrency={selectedShop.currency}
                  products={shopProducts}
                  onProductsChange={(newProducts) => {
                    const otherProducts = products.filter(p => p.shopId !== selectedShop.id);
                    handleProductsChange([...otherProducts, ...newProducts]);
                  }}
                />
              </motion.div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Store className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Chưa chọn cửa hàng</h3>
                  <p className="text-muted-foreground">
                    Vui lòng chọn cửa hàng từ tab Cửa hàng để quản lý sản phẩm
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>Hệ Thống Quản Lý Sản Phẩm • Hỗ trợ giá trị không giới hạn • Xây dựng với Next.js & shadcn/ui</p>
          <p className="mt-1">Thử nhập giá như "100000000000" (100 tỷ) để kiểm tra hỗ trợ số lớn</p>
        </footer>
      </motion.div>
    </div>
  );
}