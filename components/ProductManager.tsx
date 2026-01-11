'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Package, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getProductsByShop, createProduct, updateProduct, deleteProduct } from '@/lib/supabase-utils';
import type { ProductUI, CurrencyType } from '@/types';

interface ProductManagerProps {
  shopId: string;
  shopCurrency: CurrencyType;
  products: ProductUI[];
  onProductsChange: (products: ProductUI[]) => void;
}

export default function ProductManager({ shopId, shopCurrency, products, onProductsChange }: ProductManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductUI | null>(null);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.price.includes(searchQuery)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName.trim() || !price.trim()) return;

    // Validate price is a valid number
    if (!/^-?\d*\.?\d+$/.test(price)) {
      alert('Vui lòng nhập giá hợp lệ');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingProduct) {
        // Update existing product
        const updatedProduct = await updateProduct(editingProduct.id, { name: productName, price });
        if (updatedProduct) {
          const updatedProducts = products.map(product => 
            product.id === editingProduct.id ? updatedProduct : product
          );
          onProductsChange(updatedProducts);
        }
      } else {
        // Add new product
        const newProduct = await createProduct({ shopId, name: productName, price });
        if (newProduct) {
          onProductsChange([newProduct, ...products]);
        }
      }

      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Có lỗi xảy ra khi lưu sản phẩm. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: ProductUI) => {
    setEditingProduct(product);
    setProductName(product.name);
    setPrice(product.price);
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      const success = await deleteProduct(productId);
      if (success) {
        onProductsChange(products.filter(product => product.id !== productId));
      } else {
        alert('Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại.');
      }
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setProductName('');
    setPrice('');
  };

  const formatPrice = (price: string) => {
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) return price;
    
    if (shopCurrency === 'VND') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numericPrice);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numericPrice);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Fetch products when shopId changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (!shopId) return;
      
      setIsLoading(true);
      try {
        const fetchedProducts = await getProductsByShop(shopId);
        onProductsChange(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [shopId]);

  const getTotalValue = () => {
    return filteredProducts.reduce((sum, product) => {
      const price = parseFloat(product.price);
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Quản Lý Sản Phẩm
            </CardTitle>
            <CardDescription>
              Quản lý sản phẩm cho cửa hàng đã chọn. Giá có thể là bất kỳ kích thước nào (ví dụ: 100 tỷ).
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full md:w-64"
              />
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm Sản Phẩm
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                <DialogTitle>{editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</DialogTitle>
                <DialogDescription>
                  {editingProduct ? 'Cập nhật thông tin sản phẩm' : 'Thêm sản phẩm mới vào cửa hàng'}
                </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="product-name">Tên Sản Phẩm</Label>
                      <Input
                        id="product-name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Nhập tên sản phẩm"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="price">
                        Giá ({shopCurrency === 'USD' ? 'USD' : 'VND'})
                      </Label>
                      <Input
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder={`Nhập giá bằng ${shopCurrency}`}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Hỗ trợ bất kỳ kích thước nào (ví dụ: 100000000000 cho 100 tỷ)
                      </p>
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
                      ) : editingProduct ? (
                        'Cập Nhật'
                      ) : (
                        'Thêm Sản Phẩm'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tổng Sản Phẩm</p>
              <p className="text-2xl font-bold">{filteredProducts.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng Giá Trị</p>
              <p className="text-2xl font-bold">{formatPrice(getTotalValue().toString())}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tiền Tệ</p>
              <Badge variant={shopCurrency === 'USD' ? 'default' : 'secondary'}>
                {shopCurrency === 'USD' ? '$ USD' : '₫ VND'}
              </Badge>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Đang tải sản phẩm...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">
              {searchQuery ? 'Không tìm thấy sản phẩm' : 'Chưa có sản phẩm nào'}
            </p>
            <p className="text-sm">
              {searchQuery ? 'Thử từ khóa tìm kiếm khác' : 'Thêm sản phẩm đầu tiên để bắt đầu'}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên Sản Phẩm</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Ngày Tạo</TableHead>
                  <TableHead>Ngày Cập Nhật</TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <span className="font-semibold">{formatPrice(product.price)}</span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(product.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(product.updatedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Sửa
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Xóa
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
