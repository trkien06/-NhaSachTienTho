# NhaSachTienTho — Website Bán Sách Online

**NhaSachTienTho** là hệ thống website bán sách cho **Nhà sách Tiến Thọ** (424 Nguyễn Trãi, Thanh Xuân, Hà Nội), được xây dựng trong khuôn khổ môn học Phát triển dự án công nghệ thông tin theo mô hình **Agile Scrum** (3 Sprint, 10 user story). Dự án nhằm số hóa hoạt động bán sách của nhà sách: khách hàng xem và mua sách trực tuyến, nhà sách quản lý danh mục, kho sách và đơn hàng ngay trên website.

Dự án là **Frontend** hoàn chỉnh bằng HTML/CSS/JavaScript thuần, dữ liệu được lưu cục bộ bằng **localStorage** nên chạy ngay không cần cài đặt server hay cơ sở dữ liệu. Giao diện theo phong cách nhà sách trực tuyến chuyên nghiệp: theme sáng, tông đỏ thương hiệu, font Be Vietnam Pro và Playfair Display, bìa sách SVG thiết kế riêng cho từng đầu sách, giá bìa và phần trăm giảm giá, hero, thanh lọc và thẻ sách dạng card.

---

## 🚀 Công Nghệ Sử Dụng

| Thành phần | Công nghệ | Chi tiết |
|---|---|---|
| **Frontend** | HTML5 + CSS3 + JavaScript thuần (ES6) | Giao diện dạng Single-page, không dùng framework (React/Vue) để tối giản cấu trúc. |
| **Lưu trữ dữ liệu** | **localStorage** | Lưu sách, danh mục, tài khoản người dùng, giỏ hàng và đơn hàng ngay trong trình duyệt. |
| **Thanh toán** | Mô phỏng QR (Sandbox) | Thanh toán qua MoMo, ZaloPay ở mức giao diện + ghi nhận trạng thái, cùng tùy chọn COD. |

---

## 📂 Cấu Trúc Dự Án

```text
website-nha-sach-tien-tho/
├── index.html      # Toàn bộ giao diện: trang chủ, cửa hàng, thanh toán, quản trị
├── style.css       # CSS styling cho toàn bộ website
├── app.js          # Logic xử lý: dữ liệu mẫu, tìm kiếm, giỏ hàng, đặt hàng, quản trị
├── covers/         # Ảnh bìa SVG của 21 đầu sách (sinh tự động, chữ chuẩn tiếng Việt)
├── tools/          # Script sinh bìa sách (gen_covers.py)
├── HUONG-DAN.md    # Hướng dẫn chạy và kịch bản demo theo từng user story
└── README.md       # Tài liệu giới thiệu tổng quan (File này)
```

---

## 👥 Vai Trò & Quyền Hạn Trong Hệ Thống

Dự án phân quyền thông qua 2 vai trò chính:

1. **Khách hàng (Customer)**:
   - Xem danh sách sách theo từng danh mục, xem sách bán chạy và sách mới trên trang chủ.
   - Tìm kiếm sách theo tên, tác giả; lọc theo khoảng giá và sắp xếp kết quả.
   - Xem chi tiết sách (mô tả, giá, số lượng tồn kho, số trang, năm xuất bản).
   - Đăng ký, đăng nhập, đăng xuất tài khoản.
   - Quản lý giỏ hàng (thêm, tăng/giảm số lượng, xóa) và đặt hàng.
   - Thanh toán bằng COD, ví MoMo hoặc ZaloPay (quét mã QR mô phỏng) và xem lại đơn hàng đã đặt.
2. **Quản trị viên (Admin)**:
   - Đăng nhập bằng tài khoản Admin được cài đặt sẵn trong dữ liệu mẫu.
   - Quản lý sách: thêm, sửa, xóa sách, cập nhật giá và số lượng tồn kho.
   - Quản lý danh mục: thêm, sửa, xóa danh mục sách.
   - Xem toàn bộ đơn hàng của khách hàng.
   - Khôi phục dữ liệu gốc khi cần demo lại từ đầu.

---

## 🛠️ Hướng Dẫn Khởi Chạy Nhanh

### 1. Tải mã nguồn
Clone dự án về máy hoặc tải file ZIP từ GitHub rồi giải nén.

### 2. Mở dự án bằng Live Server (khuyên dùng)
Mở thư mục dự án bằng **Visual Studio Code**, cài extension **Live Server**, sau đó bấm chuột phải vào file `index.html` → **Open with Live Server**.

*Mở qua Live Server (localhost) giúp website chạy đúng như môi trường thật khi demo.*

### 3. Hoặc mở trực tiếp
Mở thẳng file `index.html` bằng trình duyệt. Mọi tính năng vẫn hoạt động bình thường.

### 4. Tài khoản mặc định
Sau khi mở website, hệ thống đã có sẵn dữ liệu mẫu gồm 21 đầu sách và tài khoản:
* **Admin**: `admin@tientho.vn` / `admin123`
* **Khách hàng**: tự đăng ký tài khoản mới tại mục Đăng nhập → Đăng ký.

---

## 🧪 Kịch Bản Demo Theo User Story

Toàn bộ 10 user story trong Product Backlog của báo cáo đều thao tác được trên website. Bảng đối chiếu từng user story với thao tác demo cụ thể nằm trong file [HUONG-DAN.md](HUONG-DAN.md).

Một số thao tác tiêu biểu:
1. Thanh toán MoMo/ZaloPay: thêm sách vào giỏ → Thanh toán → chọn MoMo hoặc ZaloPay → quét mã QR → xác nhận, đơn hàng được ghi nhận và tồn kho tự động trừ.
2. Quản trị: đăng nhập Admin → mục **Quản trị** để thêm/sửa/xóa sách và danh mục.

---

## 📖 Tài Liệu Chi Tiết
* Để xem hướng dẫn chạy từng bước và kịch bản demo theo 10 user story: Đọc [HUONG-DAN.md](HUONG-DAN.md).
* Báo cáo phát triển dự án (phác thảo, hợp đồng, Product Backlog, kế hoạch 3 Sprint): xem tài liệu môn học của Nhóm 13.
