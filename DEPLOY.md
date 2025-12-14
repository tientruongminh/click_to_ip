# 🚀 Hướng Dẫn Deploy Lên Vercel

## ⚠️ Lưu Ý Quan Trọng

Vercel sử dụng **serverless functions**, điều này có nghĩa:
- ❌ File `tracking_data.json` sẽ KHÔNG được lưu vĩnh viễn
- ❌ Endpoints `/report` và `/api/stats` sẽ không hoạt động đúng
- ✅ Tính năng gửi email vẫn hoạt động bình thường

## 📝 Bước 1: Chuẩn Bị

### 1.1. Cài Vercel CLI (nếu chưa có)
```bash
npm install -g vercel
```

### 1.2. Login vào Vercel
```bash
vercel login
```

## 🔧 Bước 2: Cấu Hình Environment Variables

Sau khi deploy, vào Vercel Dashboard để thêm biến môi trường:

1. Truy cập: https://vercel.com/dashboard
2. Chọn project của bạn
3. Vào **Settings** → **Environment Variables**
4. Thêm các biến:
   - `EMAIL_USER`: Email Gmail của bạn
   - `EMAIL_PASSWORD`: App Password của Gmail

## 🚀 Bước 3: Deploy

### Deploy lần đầu
```bash
cd /workspaces/click_to_ip
vercel
```

Làm theo hướng dẫn:
1. Setup and deploy? → **Yes**
2. Which scope? → Chọn account của bạn
3. Link to existing project? → **No**
4. Project name? → **click-to-ip** (hoặc tên bạn muốn)
5. Directory? → **./` (nhấn Enter)
6. Override settings? → **No**

### Deploy production
```bash
vercel --prod
```

## 🌐 Bước 4: Sau Khi Deploy

Vercel sẽ cho bạn URL, ví dụ: `https://click-to-ip.vercel.app`

### Kiểm tra:
- Truy cập URL để xem trang chủ
- Click vào nút quay để test
- Kiểm tra email xem có nhận được không

## 💡 Giải Pháp Lưu Trữ Dữ Liệu

Nếu muốn lưu trữ dữ liệu tracking lâu dài, có các lựa chọn:

### Option 1: Vercel KV (Redis)
```bash
npm install @vercel/kv
```

### Option 2: MongoDB Atlas (Free)
```bash
npm install mongodb
```

### Option 3: Supabase (Free)
```bash
npm install @supabase/supabase-js
```

### Option 4: Google Sheets API
Lưu trực tiếp vào Google Sheets

## 🔄 Update Code Sau Deploy

Mỗi khi thay đổi code:
```bash
git add .
git commit -m "Update"
git push
vercel --prod
```

Hoặc kết nối Git repo với Vercel để auto-deploy khi push code.

## 🔗 Kết Nối GitHub (Tự Động Deploy)

1. Vào Vercel Dashboard
2. Chọn project → **Settings** → **Git**
3. Connect với GitHub repository
4. Mỗi lần push code, Vercel sẽ tự động deploy

## 📊 Giải Pháp Báo Cáo

Vì không lưu được file local, bạn có thể:
1. **Gửi email mỗi lần** có người truy cập (đang làm vậy rồi)
2. **Lưu vào Google Sheets** qua API
3. **Sử dụng database** như MongoDB Atlas (free tier)

## 🆘 Troubleshooting

### Lỗi: Module not found
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
vercel --prod
```

### Lỗi: Environment variables
- Kiểm tra lại trong Vercel Dashboard
- Đảm bảo đã thêm `EMAIL_USER` và `EMAIL_PASSWORD`

### Lỗi: Email không gửi được
- Kiểm tra Gmail App Password
- Kiểm tra 2-Step Verification đã bật chưa

## 📞 Support

Nếu gặp vấn đề, kiểm tra logs:
```bash
vercel logs
```

Hoặc xem logs trên Vercel Dashboard → Project → Deployments → View Function Logs
