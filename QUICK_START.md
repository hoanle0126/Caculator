# ⚡ Hướng Dẫn Nhanh Supabase

## TL;DR - Các bước cần làm ngay:

### 1. Tạo Supabase Project
```bash
# Truy cập: https://supabase.com
# Tạo tài khoản miễn phí
# Tạo project mới
```

### 2. Lấy API Keys
Trong Supabase Dashboard:
- Project Settings > API
- Copy **Project URL** và **anon public** key

### 3. Tạo File .env.local
```bash
# Tạo file .env.local trong thư mục gốc
echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key" >> .env.local
```

### 4. Tạo Database Tables
Chạy SQL queries trong [SUPABASE_SETUP.md](./SUPABASE_SETUP.md#bước-5-tạo-database-tables)

### 5. Khởi động ứng dụng
```bash
npm run dev
```

## 🚨 Lỗi Thường Gặp & Cách Khắc Phục

### Lỗi "Missing Supabase environment variables"
```bash
# Kiểm tra file .env.local
cat .env.local

# Đảm bảo đã restart server sau khi tạo file
npm run dev
```

### Lỗi "permission denied for table shops"
```bash
# Chạy lại SQL queries trong Supabase SQL Editor
# Đảm bảo đã chạy phần "Cấp quyền truy cập"
```

### Ứng dụng hiển thị "Đang tải dữ liệu..." mãi
```bash
# Kiểm tra console (F12) trong browser
# Kiểm tra network requests
# Đảm bảo API keys đúng
```

## ✅ Kiểm Tra Kết Nối

1. Mở http://localhost:3000
2. Mở Browser Console (F12)
3. Kiểm tra không có lỗi Supabase
4. Thử tạo cửa hàng đầu tiên

## 📞 Cần Hỗ Trợ?

1. Đọc [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) đầy đủ
2. Kiểm tra console errors
3. Xem Supabase Dashboard > Table Editor
4. Kiểm tra Network tab trong browser

## 🎯 Production Ready

Khi deploy lên production:
1. Sử dụng **Service Role Key** thay vì Anon Key
2. Bật Row Level Security phù hợp
3. Cấu hình CORS trong Supabase
4. Bật database backups

---

**Mẹo:** Bạn có thể test Supabase connection bằng cách tạo file test:

```typescript
// test-supabase.ts
import { supabase } from './lib/supabase'

async function testConnection() {
  const { data, error } = await supabase.from('shops').select('count')
  console.log('Test result:', { data, error })
}
```
