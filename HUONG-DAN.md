# Hướng dẫn chạy và demo bản fullstack

## 1. Chạy website

1. Mở thư mục `website-nha-sach-tien-tho-fullstack` bằng VS Code (hoặc terminal).
2. Mở Terminal trong thư mục này, chạy lần lượt:

```bash
npm install
npm start
```

3. Thấy dòng "Nha sach Tien Tho dang chay tai http://localhost:3000" là server đã lên. Mở trình duyệt vào http://localhost:3000 để dùng web.
4. Tắt server: nhấn `Ctrl + C` trong terminal.

Lỗi thường gặp:

- "Port 3000 is already in use": đang có chương trình khác chiếm cổng 3000 (ví dụ project CourseDemy). Tắt chương trình đó, hoặc chạy `PORT=4000 npm start` rồi mở http://localhost:4000.
- "Cannot find module 'express'": chưa chạy `npm install`, hoặc đang đứng sai thư mục (phải đứng đúng thư mục có file package.json).

## 2. Tài khoản demo

- Admin: admin@tientho.vn / admin123
- Khách: an@gmail.com / 123456 (đã mua Mắt Biếc), binh@gmail.com / 123456 (đã mua Đắc Nhân Tâm)
- Mã giảm giá: GIAM10 (10%), SACHMOI20 (20%)

## 3. Kịch bản demo theo từng chức năng

**Đăng ký / đăng nhập (US-01):** Đăng ký một tài khoản mới → tự đăng nhập. Đăng xuất rồi đăng nhập lại. Thử đăng nhập sai mật khẩu → server báo lỗi.

**Tìm kiếm, lọc, chi tiết (US-02, 03, 04):** Gõ tên sách ở ô tìm kiếm; vào Cửa hàng lọc theo danh mục, khoảng giá, số sao; bấm vào bìa sách xem chi tiết.

**Giỏ hàng và thanh toán (US-05, 06):** Thêm Đắc Nhân Tâm vào giỏ → Thanh toán → nhập mã GIAM10 bấm Áp dụng (server kiểm tra mã) → chọn MoMo (hiện mã QR MoMo của cửa hàng, đã gắn sẵn số tiền đơn) → Đặt hàng → vào mục Đơn hàng thấy đơn mới. Tổng tiền do server tính: tạm tính − giảm giá + phí ship (miễn phí từ 200.000đ).

**Đánh giá và bình luận (US-10, 11):** Đăng nhập an@gmail.com → mở Mắt Biếc → có form đánh giá vì An đã mua sách này. Mở một cuốn An chưa mua (ví dụ Số Đỏ) → chỉ bình luận được, không có form đánh giá. Đây là server kiểm tra lịch sử mua hàng, không phải giao diện tự ẩn.

**Quản lý sách và đăng bán (US-07, 08):** Đăng nhập admin → tab Quản lý sách → sửa giá/tồn kho một cuốn, hoặc thêm sách mới bằng form đăng bán.

**Kiểm duyệt sách (US-12):** Sách vừa đăng bán chưa hiện ở Cửa hàng. Admin vào tab Kiểm duyệt sách → Duyệt bán → ra Cửa hàng thấy sách xuất hiện. Bấm Từ chối thì sách bị xóa khỏi danh sách đăng bán.

**Quản lý người dùng (US-09):** Admin → tab Quản lý người dùng → Khóa tài khoản binh@gmail.com → đăng xuất, thử đăng nhập bằng tài khoản Bình → bị chặn với thông báo tài khoản đã bị khóa. Mở khóa lại thì đăng nhập bình thường.

**Quản lý thanh toán (US-13):** Admin → tab Quản lý thanh toán → đổi trạng thái đơn (Đang xử lý → Đang giao → Hoàn thành). Khách mở mục Đơn hàng sẽ thấy trạng thái mới.

**Mã giảm giá (US-14):** Admin → tab Mã giảm giá → tạo mã mới (ví dụ DEMO30 giảm 30%), bật/tắt hoặc xóa mã. Ra cửa hàng mua hàng và áp mã vừa tạo ở bước thanh toán.

**Thống kê (US-15):** Hàng số liệu đầu trang quản trị (người dùng, đầu sách, đơn hàng, doanh thu) do server tính trực tiếp từ dữ liệu — đặt thêm một đơn là doanh thu thay đổi ngay.

**Khôi phục dữ liệu:** Tab Hệ thống → Khôi phục dữ liệu gốc khi muốn demo lại từ đầu.

## 4. Điểm nói khi thuyết trình

- Kiến trúc 2 lớp rõ ràng: frontend gọi REST API, backend xử lý nghiệp vụ và lưu dữ liệu tập trung ở server (file data.json).
- Các kiểm tra nghiệp vụ quan trọng nằm ở server chứ không tin giao diện: quyền đánh giá theo lịch sử mua, tài khoản bị khóa bị chặn khi đăng nhập, tồn kho và tổng tiền do server tính, API quản trị bắt buộc token admin.
- Thanh toán MoMo/ZaloPay: web tự sinh QR động (chuẩn VietQR) gắn sẵn số tiền từng đơn vào tài khoản nhận tiền thật của cửa hàng; web không tự xác nhận giao dịch như cổng merchant.
