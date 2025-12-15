# 🎯 Hệ Thống Tracking Liên Tục

## 🚀 Tính Năng Mới

### 1️⃣ Gửi Email Mỗi Lần Quay
✅ **Mỗi lần user click nút "Quay Ngay!"** → Gửi email ngay lập tức với thông tin:
- IP address
- Vị trí (thành phố, quốc gia)
- Thiết bị, trình duyệt
- Thời gian click
- Vị trí chuột khi click

### 2️⃣ Tracking Tự Động Mỗi 3 Phút
✅ **Sau khi click lần đầu** → Bắt đầu tracking liên tục:
- Gửi dữ liệu mỗi **3 phút** tự động
- Không cần user làm gì thêm
- Tiếp tục tracking ngay cả khi user reload trang
- Tracking mãi mãi cho đến khi user xóa localStorage

## 🔄 Luồng Hoạt Động

### Lần Đầu Tiên User Vào Trang:
```
1. User vào trang web
2. Trang web chờ user click "Quay Ngay!"
3. User click → Gửi email ngay lập tức
4. Bật tracking tự động → Gửi mỗi 3 phút
```

### User Reload Trang (F5):
```
1. Kiểm tra localStorage
2. Nếu đã bật tracking → Tiếp tục tracking tự động
3. Vẫn gửi mỗi 3 phút như bình thường
```

### User Đóng Tab Rồi Mở Lại:
```
1. Mở lại tab
2. Kiểm tra localStorage
3. Tiếp tục tracking tự động
4. Không bị mất tiến trình
```

## 📊 Dữ Liệu Được Gửi

### Lần Đầu Click (Có Thông Tin Click):
- ✅ Vị trí chuột (x, y, pageX, pageY, screenX, screenY)
- ✅ Thời gian click chính xác
- ✅ IP + Geo location
- ✅ Device info
- ✅ Browser info
- ✅ Screen resolution
- ✅ Hardware info

### Tracking Tự Động (Mỗi 3 Phút):
- ✅ IP + Geo location (có thể thay đổi nếu user đổi mạng)
- ✅ Device info
- ✅ Browser info
- ✅ Screen resolution (có thể thay đổi nếu resize)
- ✅ Hardware info
- ❌ Không có thông tin click (vì không có click)

## 🛠️ Kiểm Tra Log

Mở Console trong trình duyệt (F12) để xem:

### Lần Đầu Vào Trang:
```
⏳ Waiting for user to click spin button...
```

### Sau Khi Click:
```
🎯 Continuous tracking started - Will send data every 3 minutes
```

### Mỗi 3 Phút:
```
📊 Auto-tracking: Data sent at 15/12/2025, 10:30:45
```

### Khi Reload Trang:
```
✅ Resuming continuous tracking...
🎯 Continuous tracking started - Will send data every 3 minutes
```

## ⚙️ Cấu Hình

### Thay Đổi Thời Gian Tracking

Trong file `index.html`, tìm dòng:
```javascript
}, 180000); // 3 minutes
```

Thay đổi:
- **1 phút**: `60000`
- **3 phút**: `180000` (mặc định)
- **5 phút**: `300000`
- **10 phút**: `600000`

### Tắt Tracking

User có thể tắt bằng cách:
```javascript
// Trong Console (F12)
localStorage.removeItem('lucky_spin_tracking');
location.reload();
```

Hoặc xóa localStorage trong DevTools:
1. F12 → Application tab
2. Storage → Local Storage
3. Xóa key `lucky_spin_tracking`

## 📧 Email Nhận Được

### Tiêu Đề Email:
- **Click lần đầu**: `🎯 Lucky Spin - New Player: [IP] ([Device])`
- **Tracking tự động**: Giống nhau

### Phân Biệt Email:
- Check trường **Click info** trong email:
  - Có thông tin click = User click nút quay
  - Không có thông tin click = Tracking tự động

## 🎮 Demo Scenario

### User A:
```
10:00 - Vào trang, không làm gì → Không gửi email
10:05 - Click "Quay Ngay!" → Gửi email #1 (có thông tin click)
10:08 - Tracking tự động → Gửi email #2
10:11 - Tracking tự động → Gửi email #3
10:14 - Tracking tự động → Gửi email #4
...mãi mãi
```

### User B:
```
10:00 - Vào trang, click ngay → Gửi email #1
10:01 - Reload trang → Resume tracking
10:03 - Tracking tự động → Gửi email #2
10:06 - Đóng tab
10:30 - Mở lại tab → Resume tracking, gửi ngay email #3
10:33 - Tracking tự động → Gửi email #4
```

## 🔒 Bảo Mật & Privacy

### LocalStorage Keys:
- `lucky_spin_tracking`: `'active'` hoặc null
- `lucky_spin_start_time`: ISO timestamp

### Dữ Liệu Lưu:
- ❌ Không lưu thông tin cá nhân
- ❌ Không lưu mật khẩu
- ✅ Chỉ lưu trạng thái tracking
- ✅ User có thể xóa bất cứ lúc nào

## 💡 Lợi Ích

✅ **Tracking liên tục**: Biết được user online trong bao lâu  
✅ **Phát hiện di chuyển**: Nếu IP/location thay đổi  
✅ **Không cần tương tác**: Tự động gửi data  
✅ **Persistent**: Không mất tracking khi reload  
✅ **Detailed**: Thông tin đầy đủ mỗi lần gửi  

## ⚠️ Lưu Ý

### Gmail Quota:
- Gmail free có limit: ~500 emails/day
- Nếu tracking nhiều user: Cân nhắc dùng database thay vì email

### Tính Toán:
```
1 user tracking 24h = 24 * 60 / 3 = 480 emails
10 users = 4,800 emails/day → Vượt quota!
```

### Giải Pháp:
1. **Tăng interval**: 5-10 phút thay vì 3 phút
2. **Dùng database**: MongoDB, Supabase, Firebase
3. **Email summary**: Gửi 1 email tổng hợp mỗi giờ

## 🔧 Troubleshooting

### Tracking không hoạt động?
1. Kiểm tra Console log
2. Kiểm tra LocalStorage
3. Kiểm tra Network tab (F12) xem có gửi request không

### Email không nhận được?
1. Kiểm tra server log trên Vercel
2. Kiểm tra environment variables
3. Kiểm tra Gmail quota

### Muốn reset tracking?
```javascript
localStorage.clear();
location.reload();
```

---

**🎊 Hoàn thành!** Hệ thống tracking liên tục đã sẵn sàng!
