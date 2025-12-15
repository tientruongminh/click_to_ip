# 🌐 Click to IP - IP Tracker Application

Ứng dụng web theo dõi và gửi thông tin địa chỉ IP qua email.

## 📋 Tính năng

- ✅ Giao diện web đẹp mắt và dễ sử dụng
- ✅ Tự động lấy địa chỉ IP công khai của người dùng
- ✅ Hiển thị thông tin vị trí (thành phố, quốc gia)
- ✅ Gửi thông tin chi tiết qua email tự động
- ✅ Email được format đẹp với HTML
- ✅ **BẬT/TẮT email tùy ý** - Không cần email vẫn chạy được!
- ✅ **Tracking liên tục**: Gửi email mỗi lần quay + tự động mỗi 3 phút

## 🚀 Cài đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình Gmail

**Bước quan trọng:** Bạn cần tạo **App Password** cho Gmail:

1. Đi đến [Google Account Settings](https://myaccount.google.com/)
2. Chọn **Security** (Bảo mật)
3. Bật **2-Step Verification** (Xác minh 2 bước) nếu chưa bật
4. Sau khi bật 2-Step Verification, quay lại **Security**
5. Tìm và chọn **App passwords** (Mật khẩu ứng dụng)
6. Chọn "Mail" và thiết bị của bạn
7. Google sẽ tạo mật khẩu 16 ký tự - Copy mật khẩu này

### 3. Tạo file .env

Sao chép file `.env.example` thành `.env`:

```bash
cp .env.example .env
```

Sau đó chỉnh sửa file `.env` với thông tin của bạn:

```env
# Bật/Tắt email - set 'true' để bật, 'false' để tắt
EMAIL_ENABLED=false

# Chỉ cần nếu EMAIL_ENABLED=true
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
PORT=3000
```

**💡 Mới:** Giờ bạn có thể:
- ❌ **Tắt email** (`EMAIL_ENABLED=false`) - App vẫn chạy, chỉ không gửi email
- ✅ **Bật email** (`EMAIL_ENABLED=true`) - Gửi email mỗi lần có người truy cập

**Lưu ý:** Sử dụng **App Password** (16 ký tự), KHÔNG phải mật khẩu thường của Gmail!

📖 **Chi tiết:** Xem file [EMAIL_SETUP.md](EMAIL_SETUP.md) để biết cách bật/tắt email

## 🎯 Sử dụng

### Chạy server

```bash
npm start
```

Hoặc chạy ở chế độ development với auto-reload:

```bash
npm run dev
```

### Truy cập ứng dụng

Mở trình duyệt và truy cập: `http://localhost:3000`

## 📧 Email Destination

Email sẽ được gửi đến: **truongminhtien071220005@gmail.com**

Thông tin được gửi bao gồm:
- 📍 Địa chỉ IP
- 🏙️ Thành phố
- 🗺️ Vùng/Tỉnh
- 🌍 Quốc gia
- 🏢 Tổ chức/ISP
- ⏰ Thời gian

## 📁 Cấu trúc Project

```
click_to_ip/
├── index.html          # Giao diện frontend
├── server.js           # Backend server (Node.js + Express)
├── package.json        # Dependencies
├── .env.example        # File cấu hình mẫu
├── .env               # File cấu hình thực (không commit)
├── .gitignore         # Các file bỏ qua khi commit
└── README.md          # Tài liệu hướng dẫn
```

## 🛠️ Công nghệ sử dụng

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js, Express.js
- **Email:** Nodemailer
- **API:** 
  - [ipify.org](https://api.ipify.org) - Lấy IP công khai
  - [ipapi.co](https://ipapi.co) - Lấy thông tin địa lý

## ⚠️ Lưu ý

- File `.env` chứa thông tin nhạy cảm, KHÔNG commit lên Git
- Sử dụng App Password của Gmail, không phải mật khẩu thường
- Đảm bảo đã bật 2-Step Verification cho tài khoản Gmail
- Ứng dụng cần kết nối internet để lấy thông tin IP và gửi email

## 🔒 Bảo mật

- Thông tin email được lưu trong file `.env` (không public)
- Sử dụng CORS để bảo vệ API
- App Password đảm bảo bảo mật tài khoản Gmail chính

## � Deploy Lên Vercel

### Quick Deploy
```bash
vercel
```

Xem hướng dẫn chi tiết trong [DEPLOY.md](DEPLOY.md)

**Lưu ý:** Vercel sử dụng serverless functions nên tính năng lưu file local và báo cáo sẽ không hoạt động. Tính năng gửi email vẫn hoạt động bình thường.

## �📝 License

ISC

## 👨‍💻 Support

Nếu gặp vấn đề, vui lòng kiểm tra:
1. Đã cài đặt Node.js chưa? (version 14 trở lên)
2. Đã chạy `npm install` chưa?
3. File `.env` đã được cấu hình đúng chưa?
4. App Password có đúng không?
5. Server có đang chạy không?