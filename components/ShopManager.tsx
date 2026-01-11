'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Store, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getShops, createShop, updateShop, deleteShop } from '@/lib/supabase-utils';
import type { ShopUI, CurrencyType } from '@/types';

interface ShopManagerProps {
  onShopSelect?: (shopId: string) => void;
  selectedShopId?: string;
}

export default function ShopManager({ onShopSelect, selectedShopId }: ShopManagerProps) {
  const [shops, setShops] = useState<ShopUI[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<ShopUI | null>(null);
  const [shopName, setShopName] = useState('');
  const [currency, setCurrency] = useState<CurrencyType>('USD');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shopName.trim()) return;

    setIsSubmitting(true);

    try {
      if (editingShop) {
        // Update existing shop
        const updatedShop = await updateShop(editingShop.id, { name: shopName, currency });
        if (updatedShop) {
          setShops(shops.map(shop => 
            shop.id === editingShop.id ? updatedShop : shop
          ));
        }
    } else {
      // Add new shop
      const newShop = await createShop({ name: shopName, currency });
      if (newShop) {
        console.log('ShopManager: Created new shop:', newShop);
        console.log('ShopManager: Previous shops count:', shops.length);
        setShops([newShop, ...shops]);
        console.log('ShopManager: After update, shops should be:', shops.length + 1);
        // Tự động chọn cửa hàng mới tạo
        onShopSelect?.(newShop.id);
      }
    }

      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving shop:', error);
      alert('Có lỗi xảy ra khi lưu cửa hàng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (shop: ShopUI) => {
    setEditingShop(shop);
    setShopName(shop.name);
    setCurrency(shop.currency);
    setIsDialogOpen(true);
  };

  const handleDelete = async (shopId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa cửa hàng này? Tất cả sản phẩm trong cửa hàng cũng sẽ bị xóa.')) {
      const success = await deleteShop(shopId);
      if (success) {
        setShops(shops.filter(shop => shop.id !== shopId));
        // If the deleted shop was selected, clear the selection
        if (selectedShopId === shopId) {
          onShopSelect?.('');
        }
      } else {
        alert('Có lỗi xảy ra khi xóa cửa hàng. Vui lòng thử lại.');
      }
    }
  };

  const resetForm = () => {
    setEditingShop(null);
    setShopName('');
    setCurrency('USD');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Fetch shops on component mount
  useEffect(() => {
    const fetchShops = async () => {
      setIsLoading(true);
      try {
        const fetchedShops = await getShops();
        console.log('ShopManager: Fetched shops:', fetchedShops.length, fetchedShops);
        setShops(fetchedShops);
      } catch (error) {
        console.error('Error fetching shops:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShops();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Quản Lý Cửa Hàng
            </CardTitle>
            <CardDescription>
              Tạo và quản lý cửa hàng của bạn. Mỗi cửa hàng có danh sách sản phẩm và tiền tệ riêng.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm Cửa Hàng
                </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingShop ? 'Chỉnh Sửa Cửa Hàng' : 'Thêm Cửa Hàng Mới'}</DialogTitle>
                <DialogDescription>
                  {editingShop ? 'Cập nhật thông tin cửa hàng' : 'Tạo cửa hàng mới với tiền tệ riêng'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="shop-name">Tên Cửa Hàng</Label>
                    <Input
                      id="shop-name"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="Nhập tên cửa hàng"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="currency">Tiền Tệ</Label>
                    <Select value={currency} onValueChange={(value: CurrencyType) => setCurrency(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tiền tệ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">Đô la Mỹ ($)</SelectItem>
                        <SelectItem value="VND">Đồng Việt Nam (₫)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : editingShop ? (
                      'Cập Nhật'
                    ) : (
                      'Thêm Cửa Hàng'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Đang tải cửa hàng...</p>
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Store className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Chưa có cửa hàng nào. Tạo cửa hàng đầu tiên của bạn!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shops.map((shop, index) => (
              <motion.div
                key={shop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card 
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md relative",
                    selectedShopId === shop.id && "ring-2 ring-primary"
                  )}
                  onClick={() => {
                    console.log('Shop clicked:', shop.id, shop.name);
                    onShopSelect?.(shop.id);
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="pointer-events-none">
                        <h3 className="font-semibold text-lg">{shop.name}</h3>
                        <Badge variant={shop.currency === 'USD' ? 'default' : 'secondary'} className="mt-1">
                          {shop.currency === 'USD' ? '$ USD' : '₫ VND'}
                        </Badge>
                      </div>
                      <Store className="h-8 w-8 text-muted-foreground pointer-events-none" />
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1 pointer-events-none">
                      <p>Tạo: {formatDate(shop.createdAt)}</p>
                      <p>Cập nhật: {formatDate(shop.updatedAt)}</p>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(shop);
                        }}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Sửa
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(shop.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Xóa
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
