# Website bán sách Nhà sách Tiến Thọ — Hướng dẫn chạy và demo

## Cách chạy

- Cách 1 (đơn giản): mở file `index.html` bằng trình duyệt Chrome.
- Cách 2 (nên dùng khi demo): mở thư mục này bằng Visual Studio Code, cài extension **Live Server**, bấm chuột phải vào `index.html` → **Open with Live Server**.
- Không cần cài thêm gì, không cần server hay cơ sở dữ liệu riêng. Toàn bộ dữ liệu (sách, tài khoản, đơn hàng) lưu ngay trong trình duyệt (localStorage).

## Tài khoản mẫu

- Quản trị viên: `admin@tientho.vn` / `admin123` — có thêm nút **Quản trị** (thêm/sửa/xóa sách, quản lý danh mục, xem mọi đơn hàng).
- Khách hàng: tự bấm **Đăng nhập** → **Đăng ký** để tạo tài khoản mới.

## Kịch bản demo khớp 10 user story trong báo cáo

| User story | Thao tác demo |
|---|---|
| US-01 Xem sách theo danh mục | Vào trang cửa hàng (nút Khám phá kho sách), chọn danh mục trong ô lọc **Tất cả danh mục** ở thanh lọc |
| US-02 Tìm kiếm theo tên/tác giả | Ở trang cửa hàng, gõ "Nam Cao" hoặc "Số Đỏ" vào ô tìm kiếm trên thanh lọc rồi bấm Tìm kiếm |
| US-03 Xem chi tiết sách | Bấm vào bìa hoặc tên sách: xem mô tả, giá, tồn kho, số trang |
| US-04 Đăng ký tài khoản | Đăng nhập → tab Đăng ký → tạo tài khoản |
| US-05 Đăng nhập/đăng xuất | Đăng nhập bằng tài khoản vừa tạo, bấm Đăng xuất |
| US-06 Quản lý danh mục | Đăng nhập admin → Quản trị → tab Quản lý danh mục (thêm/sửa/xóa) |
| US-07 Quản lý sách | Đăng nhập admin → Quản trị → tab Quản lý sách (thêm/sửa/xóa, cập nhật tồn kho) |
| US-08 Sách bán chạy, sách mới | Trang chủ có 2 mục: Sách bán chạy và Sách mới về |
| US-09 Lọc/sắp xếp kết quả tìm kiếm | Lọc theo khoảng giá, lọc theo số sao đánh giá và sắp xếp (bán chạy nhất, mới nhất, giá tăng dần/giảm dần) ở thanh lọc trang cửa hàng; kết quả phân trang 9 cuốn/trang |
| US-10 Thanh toán MoMo/ZaloPay | Thêm sách vào giỏ → Thanh toán → chọn MoMo hoặc ZaloPay → hiện mã QR → bấm "Tôi đã thanh toán" → đơn được ghi nhận, tồn kho tự trừ |

## Lưu ý khi demo

- Nếu dữ liệu bị rối (xóa nhầm sách, đơn hàng rác), đăng nhập admin → Quản trị → tab **Hệ thống** → **Khôi phục dữ liệu gốc**.
- Thanh toán MoMo/ZaloPay là môi trường demo (QR mô phỏng), không trừ tiền thật — khi thuyết trình nói rõ đây là bản tích hợp ở mức giao diện + ghi nhận trạng thái thanh toán.
- Muốn cả nhóm mở được bằng link: nén thư mục này tải lên Netlify Drop (app.netlify.com/drop) là có link ngay, không cần cài đặt.
