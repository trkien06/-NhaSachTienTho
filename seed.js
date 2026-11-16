const crypto = require("crypto");

const RAW = {
  "cats": [
    "Văn học",
    "Kinh tế",
    "Kỹ năng sống",
    "Thiếu nhi",
    "Truyện tranh",
    "Khoa học – Lịch sử",
    "Trinh thám"
  ],
  "books": [
    {
      "id": 1,
      "title": "Số Đỏ",
      "author": "Vũ Trọng Phụng",
      "cat": "Văn học",
      "price": 44000,
      "stock": 24,
      "sold": 320,
      "isNew": false,
      "pages": 268,
      "year": 2020,
      "rating": 4.8,
      "color": "#7d3c98",
      "desc": "Tiểu thuyết trào phúng kinh điển về xã hội Việt Nam thời Pháp thuộc, xoay quanh nhân vật Xuân Tóc Đỏ từ kẻ vô danh leo lên đỉnh cao danh vọng một cách hài hước.",
      "cover": "covers/book-1.jpg",
      "list": 104000,
      "status": "approved"
    },
    {
      "id": 2,
      "title": "Chí Phèo",
      "author": "Nam Cao",
      "cat": "Văn học",
      "price": 72000,
      "stock": 30,
      "sold": 285,
      "isNew": false,
      "pages": 132,
      "year": 2019,
      "rating": 4.9,
      "color": "#935116",
      "desc": "Tuyển tập truyện ngắn hiện thực phê phán nổi tiếng nhất của Nam Cao, với hình tượng Chí Phèo và làng Vũ Đại ám ảnh nhiều thế hệ độc giả.",
      "cover": "covers/book-2.jpg",
      "list": 76000,
      "status": "approved"
    },
    {
      "id": 3,
      "title": "Tắt Đèn",
      "author": "Ngô Tất Tố",
      "cat": "Văn học",
      "price": 32000,
      "stock": 18,
      "sold": 190,
      "isNew": false,
      "pages": 216,
      "year": 2018,
      "rating": 4.7,
      "color": "#616a6b",
      "desc": "Tiểu thuyết hiện thực về cuộc đời chị Dậu trong mùa sưu thuế, bức tranh chân thực về nông thôn Việt Nam đầu thế kỷ 20.",
      "cover": "covers/book-3.jpg",
      "list": 83000,
      "status": "approved"
    },
    {
      "id": 4,
      "title": "Mắt Biếc",
      "author": "Nguyễn Nhật Ánh",
      "cat": "Văn học",
      "price": 88000,
      "stock": 26,
      "sold": 410,
      "isNew": false,
      "pages": 300,
      "year": 2021,
      "rating": 4.8,
      "color": "#2e86c1",
      "desc": "Câu chuyện tình đơn phương trong trẻo của Ngạn dành cho Hà Lan, từ làng Đo Đo đến những năm tháng trưởng thành đầy nuối tiếc.",
      "cover": "covers/book-4.jpg",
      "list": 134000,
      "status": "approved"
    },
    {
      "id": 5,
      "title": "Cho Tôi Xin Một Vé Đi Tuổi Thơ",
      "author": "Nguyễn Nhật Ánh",
      "cat": "Văn học",
      "price": 72000,
      "stock": 22,
      "sold": 350,
      "isNew": false,
      "pages": 212,
      "year": 2020,
      "rating": 4.7,
      "color": "#148f77",
      "desc": "Tập truyện đưa người đọc trở về tuổi thơ với những trò nghịch ngợm, tình bạn và bài học đầu đời qua góc nhìn dí dỏm của cu Mùi.",
      "cover": "covers/book-5.jpg",
      "list": 104000,
      "status": "approved"
    },
    {
      "id": 6,
      "title": "Nhà Giả Kim",
      "author": "Paulo Coelho",
      "cat": "Văn học",
      "price": 84000,
      "stock": 20,
      "sold": 380,
      "isNew": false,
      "pages": 228,
      "year": 2019,
      "rating": 4.6,
      "color": "#b7950b",
      "desc": "Hành trình của chàng chăn cừu Santiago đi tìm kho báu và khám phá truyền thuyết cá nhân của chính mình, cuốn sách truyền cảm hứng bán chạy toàn cầu.",
      "cover": "covers/book-6.jpg",
      "list": 96000,
      "status": "approved"
    },
    {
      "id": 7,
      "title": "Đắc Nhân Tâm",
      "author": "Dale Carnegie",
      "cat": "Kỹ năng sống",
      "price": 77000,
      "stock": 35,
      "sold": 520,
      "isNew": false,
      "pages": 320,
      "year": 2021,
      "rating": 4.8,
      "color": "#a93226",
      "desc": "Cuốn sách nghệ thuật giao tiếp và ứng xử nổi tiếng nhất mọi thời đại, gồm những nguyên tắc thực tế để thu phục lòng người.",
      "cover": "covers/book-7.jpg",
      "list": 134000,
      "status": "approved"
    },
    {
      "id": 8,
      "title": "Tuổi Trẻ Đáng Giá Bao Nhiêu",
      "author": "Rosie Nguyễn",
      "cat": "Kỹ năng sống",
      "price": 86000,
      "stock": 28,
      "sold": 300,
      "isNew": false,
      "pages": 288,
      "year": 2020,
      "rating": 4.5,
      "color": "#ca6f1e",
      "desc": "Những chia sẻ về học tập, trải nghiệm và dấn thân dành cho người trẻ đang loay hoay tìm hướng đi cho bản thân.",
      "cover": "covers/book-8.jpg",
      "list": 110000,
      "status": "approved"
    },
    {
      "id": 9,
      "title": "Cà Phê Cùng Tony",
      "author": "Tony Buổi Sáng",
      "cat": "Kỹ năng sống",
      "price": 84000,
      "stock": 15,
      "sold": 210,
      "isNew": false,
      "pages": 256,
      "year": 2019,
      "rating": 4.4,
      "color": "#6e5100",
      "desc": "Tuyển tập bài viết hài hước mà sâu sắc về khởi nghiệp, làm người và thái độ sống, qua giọng văn đặc trưng của Tony Buổi Sáng.",
      "cover": "covers/book-9.jpg",
      "list": 121000,
      "status": "approved"
    },
    {
      "id": 10,
      "title": "Tôi Tự Học",
      "author": "Nguyễn Duy Cần",
      "cat": "Kỹ năng sống",
      "price": 60000,
      "stock": 12,
      "sold": 150,
      "isNew": false,
      "pages": 196,
      "year": 2018,
      "rating": 4.7,
      "color": "#1a5276",
      "desc": "Tác phẩm bàn về tinh thần và phương pháp tự học của học giả Nguyễn Duy Cần, kim chỉ nam cho nhiều thế hệ trí thức Việt Nam.",
      "cover": "covers/book-10.jpg",
      "list": 88000,
      "status": "approved"
    },
    {
      "id": 11,
      "title": "Cha Giàu Cha Nghèo",
      "author": "Robert T. Kiyosaki",
      "cat": "Kinh tế",
      "price": 79000,
      "stock": 25,
      "sold": 460,
      "isNew": false,
      "pages": 356,
      "year": 2021,
      "rating": 4.7,
      "color": "#145a32",
      "desc": "Cuốn sách tài chính cá nhân bán chạy nhất thế giới, thay đổi cách nhìn về tiền bạc, tài sản và tiêu sản qua hai người cha.",
      "cover": "covers/book-11.jpg",
      "list": 156000,
      "status": "approved"
    },
    {
      "id": 12,
      "title": "Người Giàu Có Nhất Thành Babylon",
      "author": "George S. Clason",
      "cat": "Kinh tế",
      "price": 77000,
      "stock": 19,
      "sold": 240,
      "isNew": false,
      "pages": 208,
      "year": 2020,
      "rating": 4.6,
      "color": "#9a7d0a",
      "desc": "Những nguyên tắc làm giàu vượt thời gian được kể qua các câu chuyện ngụ ngôn ở thành Babylon cổ đại.",
      "cover": "covers/book-12.jpg",
      "list": 116000,
      "status": "approved"
    },
    {
      "id": 13,
      "title": "Tư Duy Nhanh Và Chậm",
      "author": "Daniel Kahneman",
      "cat": "Kinh tế",
      "price": 181000,
      "stock": 10,
      "sold": 180,
      "isNew": false,
      "pages": 612,
      "year": 2019,
      "rating": 4.6,
      "color": "#4d5656",
      "desc": "Tác phẩm của nhà tâm lý học đoạt giải Nobel Kinh tế về hai hệ thống tư duy chi phối cách con người phán đoán và ra quyết định.",
      "cover": "covers/book-13.jpg",
      "list": 205000,
      "status": "approved"
    },
    {
      "id": 14,
      "title": "Muôn Kiếp Nhân Sinh",
      "author": "Nguyên Phong",
      "cat": "Kỹ năng sống",
      "price": 228000,
      "stock": 21,
      "sold": 265,
      "isNew": true,
      "pages": 380,
      "year": 2022,
      "rating": 4.8,
      "color": "#6c3483",
      "desc": "Cuốn sách về luật nhân quả và luân hồi qua những câu chuyện tiền kiếp, gợi mở nhiều suy ngẫm về cách sống và lẽ đời.",
      "cover": "covers/book-14.jpg",
      "list": 170000,
      "status": "approved"
    },
    {
      "id": 15,
      "title": "Sapiens: Lược Sử Loài Người",
      "author": "Yuval Noah Harari",
      "cat": "Khoa học – Lịch sử",
      "price": 209000,
      "stock": 14,
      "sold": 230,
      "isNew": false,
      "pages": 560,
      "year": 2021,
      "rating": 4.8,
      "color": "#784212",
      "desc": "Hành trình 70.000 năm của loài người từ loài vượn vô danh đến vị trí thống trị thế giới, qua các cuộc cách mạng nhận thức, nông nghiệp và khoa học.",
      "cover": "covers/book-15.jpg",
      "list": 230000,
      "status": "approved"
    },
    {
      "id": 16,
      "title": "Dế Mèn Phiêu Lưu Ký",
      "author": "Tô Hoài",
      "cat": "Thiếu nhi",
      "price": 162000,
      "stock": 32,
      "sold": 275,
      "isNew": false,
      "pages": 184,
      "year": 2020,
      "rating": 4.9,
      "color": "#1e8449",
      "desc": "Tác phẩm thiếu nhi kinh điển của văn học Việt Nam, kể cuộc phiêu lưu của Dế Mèn qua thế giới loài vật với nhiều bài học về tình bạn và lòng dũng cảm.",
      "cover": "covers/book-16.jpg",
      "list": 91000,
      "status": "approved"
    },
    {
      "id": 17,
      "title": "Harry Potter Và Hòn Đá Phù Thủy",
      "author": "J.K. Rowling",
      "cat": "Thiếu nhi",
      "price": 150000,
      "stock": 16,
      "sold": 390,
      "isNew": true,
      "pages": 368,
      "year": 2022,
      "rating": 4.9,
      "color": "#7b241c",
      "desc": "Tập đầu tiên của bộ truyện phù thủy nổi tiếng toàn cầu: cậu bé Harry Potter phát hiện thân phận thật và bước vào trường Hogwarts.",
      "cover": "covers/book-17.jpg",
      "list": 183000,
      "status": "approved"
    },
    {
      "id": 18,
      "title": "Sherlock Holmes Toàn Tập",
      "author": "Arthur Conan Doyle",
      "cat": "Trinh thám",
      "price": 378000,
      "stock": 9,
      "sold": 175,
      "isNew": false,
      "pages": 928,
      "year": 2019,
      "rating": 4.8,
      "color": "#212f3c",
      "desc": "Trọn bộ các vụ án của thám tử Sherlock Holmes và bác sĩ Watson: những suy luận sắc bén đã định hình thể loại truyện trinh thám.",
      "cover": "covers/book-18.jpg",
      "list": 177000,
      "status": "approved"
    },
    {
      "id": 19,
      "title": "Doraemon Truyện Dài Tập 1",
      "author": "Fujiko F. Fujio",
      "cat": "Truyện tranh",
      "price": 24000,
      "stock": 40,
      "sold": 150,
      "isNew": false,
      "pages": 192,
      "year": 2021,
      "rating": 4.8,
      "color": "#2471a3",
      "desc": "Chú khủng long của Nobita: chuyến phiêu lưu đầu tiên trong loạt truyện dài Doraemon, đưa nhóm bạn trở về thời tiền sử.",
      "cover": "covers/book-19.jpg",
      "list": 55000,
      "status": "approved"
    },
    {
      "id": 20,
      "title": "Thám Tử Lừng Danh Conan Tập 100",
      "author": "Gosho Aoyama",
      "cat": "Truyện tranh",
      "price": 25000,
      "stock": 50,
      "sold": 320,
      "isNew": true,
      "pages": 192,
      "year": 2023,
      "rating": 4.9,
      "color": "#922b21",
      "desc": "Tập 100 cột mốc của bộ truyện tranh trinh thám được yêu thích nhất, với những vụ án mới và manh mối về tổ chức áo đen.",
      "cover": "covers/book-20.jpg",
      "list": 30000,
      "status": "approved"
    },
    {
      "id": 21,
      "title": "One Piece Tập 105",
      "author": "Eiichiro Oda",
      "cat": "Truyện tranh",
      "price": 21000,
      "stock": 45,
      "sold": 290,
      "isNew": true,
      "pages": 208,
      "year": 2023,
      "rating": 4.9,
      "color": "#b03a2e",
      "desc": "Băng Mũ Rơm bước vào chương mới sau trận chiến Wano, hành trình đến hòn đảo cuối cùng của Tân Thế Giới ngày càng gần.",
      "cover": "covers/book-21.jpg",
      "list": 43000,
      "status": "approved"
    }
  ],
  "users": [
    {
      "name": "Quản trị viên",
      "email": "admin@tientho.vn",
      "pass": "admin123",
      "role": "admin",
      "locked": false
    },
    {
      "name": "Nguyễn Văn An",
      "email": "an@gmail.com",
      "pass": "123456",
      "role": "customer",
      "locked": false
    },
    {
      "name": "Trần Thị Bình",
      "email": "binh@gmail.com",
      "pass": "123456",
      "role": "customer",
      "locked": false
    }
  ],
  "orders": [
    {
      "id": "DH0001",
      "date": "08/11/2026, 09:24",
      "email": "an@gmail.com",
      "name": "Nguyễn Văn An",
      "phone": "0912345678",
      "addr": "Số 12 ngõ 298 Cầu Diễn, Bắc Từ Liêm, Hà Nội",
      "items": [
        {
          "bookId": 4,
          "title": "Mắt Biếc",
          "price": 110000,
          "qty": 1
        }
      ],
      "total": 135000,
      "pay": "COD",
      "status": "Đang giao",
      "promo": "",
      "discount": 0
    },
    {
      "id": "DH0002",
      "date": "09/11/2026, 15:02",
      "email": "binh@gmail.com",
      "name": "Trần Thị Bình",
      "phone": "0987654321",
      "addr": "424 Nguyễn Trãi, Thanh Xuân, Hà Nội",
      "items": [
        {
          "bookId": 7,
          "title": "Đắc Nhân Tâm",
          "price": 110000,
          "qty": 2
        }
      ],
      "total": 198000,
      "pay": "MoMo",
      "status": "Đã thanh toán (MoMo)",
      "promo": "GIAM10",
      "discount": 22000
    }
  ],
  "reviews": [
    {
      "id": 1,
      "bookId": 4,
      "email": "an@gmail.com",
      "name": "Nguyễn Văn An",
      "rating": 5,
      "text": "Truyện buồn mà hay, đọc xong nhớ mãi mối tình của Ngạn. Sách in đẹp, giao nhanh.",
      "date": "09/11/2026"
    },
    {
      "id": 2,
      "bookId": 4,
      "email": "binh@gmail.com",
      "name": "Trần Thị Bình",
      "rating": 4,
      "text": "Nội dung cảm động, rất hợp đọc cuối tuần. Trừ một sao vì bìa hơi mỏng.",
      "date": "09/11/2026"
    },
    {
      "id": 3,
      "bookId": 1,
      "email": "binh@gmail.com",
      "name": "Trần Thị Bình",
      "rating": 5,
      "text": "Số Đỏ đọc cuốn thật sự, châm biếm sâu cay mà vẫn buồn cười.",
      "date": "07/11/2026"
    }
  ],
  "comments": [
    {
      "id": 1,
      "bookId": 4,
      "email": "binh@gmail.com",
      "name": "Trần Thị Bình",
      "text": "Có ai đọc xong phần cuối mà khóc như mình không?",
      "date": "09/11/2026"
    },
    {
      "id": 2,
      "bookId": 4,
      "email": "an@gmail.com",
      "name": "Nguyễn Văn An",
      "text": "Mình cũng vậy, đoạn Ngạn rời làng Đo Đo ám ảnh mấy ngày liền.",
      "date": "09/11/2026"
    }
  ],
  "promos": [
    {
      "code": "GIAM10",
      "pct": 10,
      "active": true
    },
    {
      "code": "SACHMOI20",
      "pct": 20,
      "active": true
    }
  ],
  "nextBook": 22,
  "nextOrder": 3,
  "nextReview": 4,
  "nextComment": 3
};

function hashPass(pass, salt) {
    return crypto.scryptSync(String(pass), salt, 64).toString("hex");
}

function seedData() {
    const data = JSON.parse(JSON.stringify(RAW));
    data.users = data.users.map(u => {
        const salt = crypto.randomBytes(16).toString("hex");
        const { pass, ...rest } = u;
        return { ...rest, salt: salt, passHash: hashPass(pass, salt) };
    });
    return data;
}

module.exports = { seedData, hashPass };
