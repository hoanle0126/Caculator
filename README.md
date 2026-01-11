# 🛒 Hệ Thống Quản Lý Sản Phẩm

Một ứng dụng web hiện đại để quản lý cửa hàng và sản phẩm với hỗ trợ giá trị không giới hạn, được xây dựng bằng Next.js 14+ và shadcn/ui.

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-0.8.0+-000000?style=for-the-badge)

## ✨ Tính Năng Nổi Bật

### 🏪 Quản Lý Cửa Hàng

- **Tạo & Quản lý** nhiều cửa hàng với tiền tệ riêng (USD/VND)
- **Giao diện trực quan** với card hiển thị thông tin chi tiết
- **Chỉnh sửa & Xóa** cửa hàng dễ dàng
- **Hỗ trợ đa tiền tệ** với định dạng phù hợp

### 📦 Quản Lý Sản Phẩm

- **Thêm sản phẩm** với giá trị không giới hạn (hỗ trợ số lớn đến hàng tỷ)
- **Tìm kiếm** sản phẩm nhanh chóng
- **Chỉnh sửa & Xóa** sản phẩm trực quan
- **Tính tổng giá trị** tự động theo từng cửa hàng

### 💰 Hỗ Trợ Giá Trị Lớn

- **Không giới hạn** giá trị số (ví dụ: 100000000000 = 100 tỷ)
- **Định dạng tiền tệ** thông minh (USD: $1,299.99, VND: 150.000₫)
- **Tính toán chính xác** với số lớn

### 🎨 Giao Diện Hiện Đại

- **Responsive design** hoạt động trên mọi thiết bị
- **Animations mượt mà** với Framer Motion
- **Dark/Light mode** sẵn sàng
- **UI/UX tối ưu** với shadcn/ui components

## 🚀 Công Nghệ Sử Dụng

### Frontend

- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
- **Ngôn ngữ:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Font:** [Geist](https://vercel.com/font)

### Backend & Database

- **Backend:** [Supabase](https://supabase.com/) (PostgreSQL + REST API)
- **Database:** PostgreSQL với Row Level Security
- **Authentication:** Supabase Auth (sẵn sàng tích hợp)
- **Realtime:** Supabase Realtime (sẵn sàng tích hợp)

## 📦 Cài Đặt & Chạy Dự Án

### 1. Clone repository

```bash
git clone https://github.com/your-username/product-management-system.git
cd product-management-system
```

### 2. Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### 3. Thiết lập Supabase (Backend)

Ứng dụng sử dụng **Supabase** làm backend. Làm theo hướng dẫn trong [SUPABASE_SETUP.md](./SUPABASE_SETUP.md):

1. Tạo tài khoản Supabase miễn phí
2. Tạo project mới
3. Lấy API keys
4. Tạo file `.env.local` với credentials
5. Chạy SQL queries để tạo database tables

### 4. Chạy development server

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

### 5. Mở trình duyệt

Truy cập [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 🏗️ Cấu Trúc Dự Án

```
product-management-system/
├── app/
│   ├── layout.tsx          # Layout chính với metadata
│   ├── page.tsx            # Trang chính với dashboard
│   └── globals.css         # Global styles
├── components/
│   ├── ShopManager.tsx     # Component quản lý cửa hàng
│   ├── ProductManager.tsx  # Component quản lý sản phẩm
│   └── ui/                 # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ... (các component khác)
├── lib/
│   └── utils.ts            # Utility functions
├── types/
│   └── index.ts            # TypeScript interfaces
├── public/                 # Static assets
└── package.json
```

## 📝 Cách Sử Dụng

### 1. Tạo Cửa Hàng

1. Nhấn nút **"Thêm Cửa Hàng"**
2. Nhập tên cửa hàng
3. Chọn tiền tệ (USD hoặc VND)
4. Nhấn **"Thêm Cửa Hàng"**

### 2. Quản Lý Sản Phẩm

1. Chọn cửa hàng từ tab **"Cửa hàng"**
2. Chuyển sang tab **"Sản phẩm"**
3. Nhấn **"Thêm Sản Phẩm"**
4. Nhập tên sản phẩm và giá
5. Giá có thể là bất kỳ số nào (ví dụ: 100000000000 cho 100 tỷ)

### 3. Tính Năng Tìm Kiếm

- Sử dụng ô tìm kiếm trong phần quản lý sản phẩm
- Tìm theo tên sản phẩm hoặc giá

## 🎯 Tính Năng Kỹ Thuật

### Định Dạng Tiền Tệ Thông Minh

```typescript
// Định dạng USD: $1,299.99
new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(price);

// Định dạng VND: 150.000₫
new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}).format(price);
```

### Hỗ Trợ Số Lớn

- Sử dụng `BigInt` hoặc string để xử lý số lớn
- Không giới hạn độ dài số
- Đảm bảo tính chính xác trong tính toán

### State Management

- Sử dụng React Hooks (useState, useEffect)
- Quản lý state cục bộ cho từng component
- Truyền props giữa các component

## 📱 Responsive Design

Ứng dụng được thiết kế để hoạt động trên mọi kích thước màn hình:

- **Mobile:** Hiển thị 1 cột, menu dạng hamburger
- **Tablet:** Hiển thị 2 cột, layout tối ưu
- **Desktop:** Hiển thị 3+ cột, đầy đủ tính năng

## 🎨 Customization

### Thay Đổi Theme

1. Mở file `tailwind.config.js`
2. Chỉnh sửa colors trong phần `theme.extend`
3. Cập nhật CSS variables trong `globals.css`

### Thêm Tiền Tệ Mới

1. Mở file `types/index.ts`
2. Thêm currency type mới vào `CurrencyType`
3. Cập nhật component `ShopManager` và `ProductManager`

### Thêm Tính Năng Mới

1. Tạo component mới trong thư mục `components/`
2. Import và sử dụng trong `app/page.tsx`
3. Cập nhật types nếu cần

## 🤝 Đóng Góp

Chào mừng đóng góp! Vui lòng làm theo các bước sau:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 Giấy Phép

Dự án này được cấp phép theo [MIT License](LICENSE).

## 👥 Tác Giả

- **Lê Văn Xuân Hoàn** - [GitHub](https://github.com/your-username)
- **Email** - hoanle0126@gmail.com

## 🙏 Cảm Ơn

- [Next.js Team](https://nextjs.org/) cho framework tuyệt vời
- [shadcn/ui](https://ui.shadcn.com/) cho các component chất lượng
- [Tailwind CSS](https://tailwindcss.com/) cho utility classes
- [Framer Motion](https://www.framer.com/motion/) cho animations

---

**⭐ Nếu bạn thấy dự án này hữu ích, hãy cho nó một star trên GitHub!**

---

<div align="center">
  <sub>Được xây dựng với ❤️ bằng Next.js & shadcn/ui</sub>
</div>
