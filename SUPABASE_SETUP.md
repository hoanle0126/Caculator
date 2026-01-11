# 🚀 Hướng Dẫn Cài Đặt Supabase

Hướng dẫn này sẽ giúp bạn thiết lập Supabase làm backend cho ứng dụng Hệ Thống Quản Lý Sản Phẩm.

## 📋 Bước 1: Tạo Tài Khoản Supabase

1. Truy cập [https://supabase.com](https://supabase.com)
2. Nhấn "Start your project"
3. Đăng nhập bằng GitHub, GitLab, hoặc email
4. Tạo tài khoản miễn phí

## 🏗️ Bước 2: Tạo Project Mới

1. Nhấn "New project"
2. Đặt tên project: `product-management-system`
3. Chọn region gần bạn (ví dụ: Singapore)
4. Nhập mật khẩu database (lưu lại an toàn)
5. Nhấn "Create new project"

## 🔑 Bước 3: Lấy API Keys

1. Sau khi project được tạo, vào **Project Settings** (biểu tượng bánh răng)
2. Chọn tab **API**
3. Copy các giá trị sau:
   - **Project URL**: `https://[project-id].supabase.co`
   - **anon public**: Key bắt đầu bằng `eyJ...`

## ⚙️ Bước 4: Cấu Hình Environment Variables

Tạo file `.env.local` trong thư mục gốc của dự án:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

**Lưu ý:** Thay `[project-id]` bằng ID thực tế từ Supabase dashboard.

## 🗄️ Bước 5: Tạo Database Tables

### 5.1 Truy cập SQL Editor
1. Trong Supabase dashboard, chọn **SQL Editor** từ menu bên trái
2. Nhấn "New query"

### 5.2 Tạo bảng `shops`
Chạy query sau:

```sql
-- Tạo bảng shops
CREATE TABLE shops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('USD', 'VND')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tạo trigger để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_shops_updated_at 
    BEFORE UPDATE ON shops 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### 5.3 Tạo bảng `products`
Chạy query sau:

```sql
-- Tạo bảng products
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tạo trigger để tự động cập nhật updated_at
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Tạo index để tối ưu query theo shop_id
CREATE INDEX idx_products_shop_id ON products(shop_id);
```

### 5.4 Cấp quyền truy cập
Chạy query sau để cho phép anonymous access:

```sql
-- Cấp quyền cho bảng shops
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read access" ON shops
  FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access" ON shops
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update access" ON shops
  FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete access" ON shops
  FOR DELETE USING (true);

-- Cấp quyền cho bảng products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read access" ON products
  FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access" ON products
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update access" ON products
  FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete access" ON products
  FOR DELETE USING (true);
```

## 🧪 Bước 6: Kiểm Tra Kết Nối

### 6.1 Khởi động lại dev server
```bash
npm run dev
```

### 6.2 Kiểm tra console
Mở browser console (F12) và kiểm tra:
- Không có lỗi Supabase
- Dữ liệu được tải thành công

### 6.3 Thử tạo cửa hàng đầu tiên
1. Mở ứng dụng tại http://localhost:3000
2. Nhấn "Thêm Cửa Hàng"
3. Nhập tên và chọn tiền tệ
4. Nhấn "Thêm Cửa Hàng"

## 🔍 Bước 7: Xác Minh Dữ Liệu

### 7.1 Kiểm tra trong Supabase
1. Vào Supabase dashboard
2. Chọn **Table Editor**
3. Chọn bảng `shops`
4. Bạn sẽ thấy cửa hàng vừa tạo

### 7.2 Kiểm tra bảng `products`
1. Tạo sản phẩm trong ứng dụng
2. Quay lại Table Editor
3. Chọn bảng `products`
4. Kiểm tra sản phẩm đã được tạo

## 🛠️ Bước 8: Xử Lý Sự Cố

### Lỗi "Missing Supabase environment variables"
```bash
# Kiểm tra file .env.local
cat .env.local

# Đảm bảo biến môi trường đã được set
echo $NEXT_PUBLIC_SUPABASE_URL
```

### Lỗi kết nối database
1. Kiểm tra Project URL và API Key
2. Đảm bảo đã chạy SQL queries để tạo bảng
3. Kiểm tra Row Level Security policies

### Lỗi "permission denied"
1. Vào **Authentication** > **Policies** trong Supabase
2. Kiểm tra các policies đã được tạo
3. Đảm bảo có policy cho anonymous access

## 📊 Bước 9: Thêm Dữ Liệu Mẫu (Optional)

Chạy query sau để thêm dữ liệu mẫu:

```sql
-- Thêm cửa hàng mẫu
INSERT INTO shops (name, currency) VALUES
  ('Cửa Hàng Chính', 'USD'),
  ('Chi Nhánh Việt Nam', 'VND');

-- Thêm sản phẩm mẫu
INSERT INTO products (shop_id, name, price) VALUES
  ((SELECT id FROM shops WHERE name = 'Cửa Hàng Chính'), 'Laptop Pro', '1299.99'),
  ((SELECT id FROM shops WHERE name = 'Cửa Hàng Chính'), 'Chuột Không Dây', '49.99'),
  ((SELECT id FROM shops WHERE name = 'Chi Nhánh Việt Nam'), 'Áo Thun', '150000'),
  ((SELECT id FROM shops WHERE name = 'Chi Nhánh Việt Nam'), 'Quần Jeans', '450000');
```

## 🎉 Hoàn Thành!

Bây giờ ứng dụng của bạn đã được kết nối với Supabase backend. Dữ liệu sẽ được lưu trữ an toàn và có thể truy cập từ bất kỳ đâu.

## 🔒 Bảo Mật Nâng Cao (Optional)

Khi sẵn sàng cho production, bạn nên:
1. Sử dụng **Service Role Key** thay vì Anon Key
2. Triển khai authentication với Supabase Auth
3. Tạo policies phức tạp hơn cho từng user
4. Bật database backups

## 📞 Hỗ Trợ

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

---

**Lưu ý:** Hướng dẫn này sử dụng chế độ anonymous access cho mục đích phát triển. Cho production, hãy triển khai authentication đầy đủ.
