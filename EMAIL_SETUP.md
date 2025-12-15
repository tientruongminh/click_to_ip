# 📧 Hướng Dẫn Cấu Hình Email

## 🎯 Tính Năng Bật/Tắt Email

Giờ bạn có thể **BẬT hoặc TẮT** tính năng gửi email bất cứ khi nào muốn!

## 🔧 Cách Sử Dụng

### 1️⃣ Local Development (Máy Local)

Tạo file `.env` trong thư mục gốc:

```bash
# Tắt email (chỉ lưu data, không gửi email)
EMAIL_ENABLED=false

# Hoặc bật email
EMAIL_ENABLED=true
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 2️⃣ Vercel Deployment

#### Tắt Email (Không Gửi Email)
1. Vào Vercel Dashboard: https://vercel.com/dashboard
2. Chọn project của bạn
3. **Settings** → **Environment Variables**
4. Thêm biến:
   - `EMAIL_ENABLED` = `false`

#### Bật Email (Gửi Email)
1. Vào Vercel Dashboard
2. **Settings** → **Environment Variables**
3. Thêm các biến:
   - `EMAIL_ENABLED` = `true`
   - `EMAIL_USER` = `your-email@gmail.com`
   - `EMAIL_PASSWORD` = `your-app-password`

**Lưu ý:** Sau khi thay đổi biến môi trường, click **Redeploy** để áp dụng.

## 🚀 Test Ngay

### Chạy Local
```bash
# Tắt email
echo "EMAIL_ENABLED=false" > .env
npm start

# Bật email
echo "EMAIL_ENABLED=true" > .env
echo "EMAIL_USER=your-email@gmail.com" >> .env
echo "EMAIL_PASSWORD=your-app-password" >> .env
npm start
```

## 📊 Kiểm Tra Trạng Thái

Khi server chạy, bạn sẽ thấy log:
- ✅ Email service enabled (nếu bật)
- ⚠️ Email service disabled (nếu tắt)

Khi có người click:
- ✅ Email sent successfully (nếu bật và gửi thành công)
- ℹ️ Email disabled - Data saved (nếu tắt)

## 🎮 Ví Dụ Sử Dụng

### Tình Huống 1: Test Website (Không Cần Email)
```
EMAIL_ENABLED=false
```
→ Dữ liệu vẫn được lưu vào `tracking_data.json` nhưng không gửi email

### Tình Huống 2: Production (Cần Nhận Email)
```
EMAIL_ENABLED=true
EMAIL_USER=youremail@gmail.com
EMAIL_PASSWORD=yourapppassword
```
→ Mỗi lần có người click sẽ gửi email báo cáo

### Tình Huống 3: Tạm Tắt Email (Đang Fix Bug)
Chỉ cần đổi:
```
EMAIL_ENABLED=false
```
Không cần xóa EMAIL_USER và EMAIL_PASSWORD

## 🔐 Bảo Mật

- ❌ **KHÔNG** commit file `.env` lên Git
- ✅ File `.env.example` chỉ là mẫu
- ✅ Trên Vercel, quản lý biến môi trường qua Dashboard
- ✅ Sử dụng Gmail App Password, không dùng mật khẩu thật

## 🆘 Troubleshooting

### Email không gửi nhưng website vẫn chạy bình thường?
→ Đúng rồi! Nếu `EMAIL_ENABLED=false`, email sẽ không được gửi.

### Muốn bật email nhưng không thấy gửi?
1. Kiểm tra `EMAIL_ENABLED=true`
2. Kiểm tra `EMAIL_USER` và `EMAIL_PASSWORD` đã điền đúng
3. Xem log server để biết lỗi cụ thể

### Lỗi "Email service disabled"?
→ Server đang chạy ở chế độ không gửi email. Nếu muốn bật, đổi `EMAIL_ENABLED=true`

## 📞 Lợi Ích

✅ **Tiết kiệm quota email** khi đang test  
✅ **Linh hoạt** bật/tắt bất cứ lúc nào  
✅ **Không lỗi** khi thiếu email credentials  
✅ **Data vẫn được lưu** dù email có bật hay không  
