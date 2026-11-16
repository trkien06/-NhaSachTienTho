# Website nhà sách Tiến Thọ — bản FULLSTACK (Frontend + Backend thật)

Bản nâng cấp của website nhà sách Tiến Thọ: giao diện giữ nguyên, phía sau là **backend Node.js + Express** với REST API thật. Mọi dữ liệu (sách, tài khoản, đơn hàng, đánh giá, bình luận, mã giảm giá) được lưu ở server trong file `data.json`, không còn nằm ở localStorage của trình duyệt nữa.

## Công nghệ

- Backend: Node.js + Express, dữ liệu lưu file JSON (`data.json`), mật khẩu băm bằng scrypt (Node crypto), đăng nhập bằng token Bearer.
- Frontend: HTML/CSS/JavaScript thuần trong thư mục `public/`, gọi API bằng `fetch`.

## Cách chạy

Yêu cầu: máy đã cài Node.js (bản 18 trở lên).

```bash
npm install
npm start
```

Mở trình duyệt: http://localhost:3000

- Lần chạy đầu tiên, server tự tạo `data.json` từ dữ liệu mẫu trong `seed.js`.
- Muốn đổi cổng: `PORT=4000 npm start` (PowerShell: `$env:PORT=4000; npm start`).
- Muốn quay về dữ liệu gốc: đăng nhập Admin → tab Hệ thống → Khôi phục dữ liệu gốc, hoặc xóa file `data.json` rồi chạy lại server.

## Tài khoản mẫu

| Vai trò | Email | Mật khẩu | Ghi chú |
|---|---|---|---|
| Quản trị viên | admin@tientho.vn | admin123 | Toàn quyền quản trị |
| Khách hàng | an@gmail.com | 123456 | Đã có đơn DH0001 (Mắt Biếc) nên đánh giá được Mắt Biếc |
| Khách hàng | binh@gmail.com | 123456 | Đã có đơn DH0002 (Đắc Nhân Tâm, MoMo, đã áp mã GIAM10) |

Mã giảm giá mẫu: `GIAM10` (giảm 10%), `SACHMOI20` (giảm 20%).

## Cấu trúc thư mục

```
website-nha-sach-tien-tho-fullstack/
  server.js        Backend Express: toàn bộ REST API + phục vụ frontend
  seed.js          Dữ liệu mẫu ban đầu (21 sách, 3 tài khoản, 2 đơn mẫu...)
  package.json
  data.json        File dữ liệu thật, server tự tạo sau lần chạy đầu
  public/          Frontend (index.html, style.css, app.js, covers/)
```

## Danh sách API

| Method | Đường dẫn | Quyền | Chức năng |
|---|---|---|---|
| POST | /api/auth/register | Công khai | Đăng ký tài khoản |
| POST | /api/auth/login | Công khai | Đăng nhập, trả về token |
| POST | /api/auth/logout | Đã đăng nhập | Đăng xuất |
| GET | /api/auth/me | Đã đăng nhập | Thông tin tài khoản hiện tại |
| GET | /api/books | Công khai | Danh sách sách đang bán |
| GET | /api/books/:id | Công khai | Chi tiết một cuốn sách |
| GET | /api/books/:id/social | Công khai | Đánh giá + bình luận của sách, quyền đánh giá của người đang xem |
| POST | /api/books/:id/reviews | Đã mua sách | Gửi đánh giá (server kiểm tra lịch sử mua) |
| POST | /api/books/:id/comments | Đã đăng nhập | Gửi bình luận |
| GET | /api/categories | Công khai | Danh sách danh mục |
| POST | /api/books | Admin | Đăng bán sách (vào trạng thái chờ duyệt) |
| PUT | /api/books/:id | Admin | Sửa sách |
| DELETE | /api/books/:id | Admin | Xóa sách |
| GET | /api/admin/books | Admin | Toàn bộ sách gồm cả chờ duyệt |
| POST | /api/books/:id/approve | Admin | Duyệt bán sách |
| POST | /api/books/:id/reject | Admin | Từ chối (xóa) sách chờ duyệt |
| POST/PUT/DELETE | /api/categories... | Admin | Thêm, sửa, xóa danh mục |
| GET | /api/admin/users | Admin | Danh sách người dùng |
| PATCH | /api/admin/users/:email/lock | Admin | Khóa / mở khóa tài khoản |
| POST | /api/orders | Công khai | Đặt hàng (server tự tính tiền, kiểm tra tồn kho, áp mã giảm) |
| GET | /api/orders/mine | Đã đăng nhập | Đơn hàng của tôi |
| GET | /api/orders/lookup?phone= | Công khai | Tra đơn của khách vãng lai theo số điện thoại |
| GET | /api/admin/orders | Admin | Tất cả đơn hàng |
| PATCH | /api/admin/orders/:id/status | Admin | Đổi trạng thái đơn |
| POST | /api/promos/validate | Công khai | Kiểm tra mã giảm giá |
| GET/POST/PUT/DELETE | /api/admin/promos... | Admin | Quản lý mã giảm giá |
| GET | /api/admin/stats | Admin | Thống kê: người dùng, đầu sách, đơn hàng, doanh thu |
| POST | /api/admin/reset | Admin | Khôi phục dữ liệu mẫu |

## Đối chiếu 15 user story

Cả 15 story của Product Backlog đều chạy trên API thật: đăng ký/đăng nhập/đăng xuất (token), tìm kiếm, xem chi tiết, lọc sách, giỏ hàng (giỏ vẫn giữ ở trình duyệt của khách, đơn hàng lưu ở server), thanh toán MoMo/ZaloPay/COD, quản lý sách, đăng bán sách, quản lý người dùng (khóa/mở khóa — tài khoản bị khóa đăng nhập bị server chặn), đánh giá sách (chỉ khách đã mua, server kiểm tra), bình luận và trao đổi, kiểm duyệt sách (sách chờ duyệt không xuất hiện ở cửa hàng), quản lý thanh toán (đổi trạng thái đơn), tạo mã giảm giá, thống kê.

Lưu ý: bước thanh toán MoMo/ZaloPay: website tự sinh mã QR động theo chuẩn VietQR từ tài khoản nhận tiền thật của cửa hàng, gắn sẵn đúng số tiền của từng đơn — khách quét là số tiền tự điền; website vẫn không tự xác nhận giao dịch như cổng thanh toán merchant. Toàn bộ phần còn lại (tính tiền, mã giảm, tồn kho, trạng thái đơn) đều xử lý thật ở server.

## Ghi chú kỹ thuật

- Mật khẩu không lưu dạng thô: server băm bằng scrypt kèm salt riêng từng tài khoản.
- Token đăng nhập lưu ở bộ nhớ server; khởi động lại server thì mọi phiên đăng nhập hết hiệu lực (đăng nhập lại là dùng tiếp).
- Server kiểm tra quyền ở mọi API quản trị: gọi API admin mà không có token admin sẽ nhận 401/403.
