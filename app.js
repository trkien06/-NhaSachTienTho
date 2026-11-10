const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const fmt = n => n.toLocaleString("vi-VN") + "đ";
const DB_KEY = "tientho_db_v1";
const SESSION_KEY = "tientho_session";
const CART_KEY = "tientho_cart";
const PAGE_SIZE = 9;

function seedDB() {
    return {
        cats: ["Văn học", "Kinh tế", "Kỹ năng sống", "Thiếu nhi", "Truyện tranh", "Khoa học – Lịch sử", "Trinh thám"],
        books: [
            { id: 1, title: "Số Đỏ", author: "Vũ Trọng Phụng", cat: "Văn học", price: 85000, stock: 24, sold: 320, isNew: false, pages: 268, year: 2020, rating: 4.8, color: "#7d3c98", desc: "Tiểu thuyết trào phúng kinh điển về xã hội Việt Nam thời Pháp thuộc, xoay quanh nhân vật Xuân Tóc Đỏ từ kẻ vô danh leo lên đỉnh cao danh vọng một cách hài hước." },
            { id: 2, title: "Chí Phèo", author: "Nam Cao", cat: "Văn học", price: 62000, stock: 30, sold: 285, isNew: false, pages: 132, year: 2019, rating: 4.9, color: "#935116", desc: "Tuyển tập truyện ngắn hiện thực phê phán nổi tiếng nhất của Nam Cao, với hình tượng Chí Phèo và làng Vũ Đại ám ảnh nhiều thế hệ độc giả." },
            { id: 3, title: "Tắt Đèn", author: "Ngô Tất Tố", cat: "Văn học", price: 68000, stock: 18, sold: 190, isNew: false, pages: 216, year: 2018, rating: 4.7, color: "#616a6b", desc: "Tiểu thuyết hiện thực về cuộc đời chị Dậu trong mùa sưu thuế, bức tranh chân thực về nông thôn Việt Nam đầu thế kỷ 20." },
            { id: 4, title: "Mắt Biếc", author: "Nguyễn Nhật Ánh", cat: "Văn học", price: 110000, stock: 26, sold: 410, isNew: false, pages: 300, year: 2021, rating: 4.8, color: "#2e86c1", desc: "Câu chuyện tình đơn phương trong trẻo của Ngạn dành cho Hà Lan, từ làng Đo Đo đến những năm tháng trưởng thành đầy nuối tiếc." },
            { id: 5, title: "Cho Tôi Xin Một Vé Đi Tuổi Thơ", author: "Nguyễn Nhật Ánh", cat: "Văn học", price: 85000, stock: 22, sold: 350, isNew: false, pages: 212, year: 2020, rating: 4.7, color: "#148f77", desc: "Tập truyện đưa người đọc trở về tuổi thơ với những trò nghịch ngợm, tình bạn và bài học đầu đời qua góc nhìn dí dỏm của cu Mùi." },
            { id: 6, title: "Nhà Giả Kim", author: "Paulo Coelho", cat: "Văn học", price: 79000, stock: 20, sold: 380, isNew: false, pages: 228, year: 2019, rating: 4.6, color: "#b7950b", desc: "Hành trình của chàng chăn cừu Santiago đi tìm kho báu và khám phá truyền thuyết cá nhân của chính mình, cuốn sách truyền cảm hứng bán chạy toàn cầu." },
            { id: 7, title: "Đắc Nhân Tâm", author: "Dale Carnegie", cat: "Kỹ năng sống", price: 110000, stock: 35, sold: 520, isNew: false, pages: 320, year: 2021, rating: 4.8, color: "#a93226", desc: "Cuốn sách nghệ thuật giao tiếp và ứng xử nổi tiếng nhất mọi thời đại, gồm những nguyên tắc thực tế để thu phục lòng người." },
            { id: 8, title: "Tuổi Trẻ Đáng Giá Bao Nhiêu", author: "Rosie Nguyễn", cat: "Kỹ năng sống", price: 90000, stock: 28, sold: 300, isNew: false, pages: 288, year: 2020, rating: 4.5, color: "#ca6f1e", desc: "Những chia sẻ về học tập, trải nghiệm và dấn thân dành cho người trẻ đang loay hoay tìm hướng đi cho bản thân." },
            { id: 9, title: "Cà Phê Cùng Tony", author: "Tony Buổi Sáng", cat: "Kỹ năng sống", price: 99000, stock: 15, sold: 210, isNew: false, pages: 256, year: 2019, rating: 4.4, color: "#6e5100", desc: "Tuyển tập bài viết hài hước mà sâu sắc về khởi nghiệp, làm người và thái độ sống, qua giọng văn đặc trưng của Tony Buổi Sáng." },
            { id: 10, title: "Tôi Tự Học", author: "Nguyễn Duy Cần", cat: "Kỹ năng sống", price: 72000, stock: 12, sold: 150, isNew: false, pages: 196, year: 2018, rating: 4.7, color: "#1a5276", desc: "Tác phẩm bàn về tinh thần và phương pháp tự học của học giả Nguyễn Duy Cần, kim chỉ nam cho nhiều thế hệ trí thức Việt Nam." },
            { id: 11, title: "Cha Giàu Cha Nghèo", author: "Robert T. Kiyosaki", cat: "Kinh tế", price: 128000, stock: 25, sold: 460, isNew: false, pages: 356, year: 2021, rating: 4.7, color: "#145a32", desc: "Cuốn sách tài chính cá nhân bán chạy nhất thế giới, thay đổi cách nhìn về tiền bạc, tài sản và tiêu sản qua hai người cha." },
            { id: 12, title: "Người Giàu Có Nhất Thành Babylon", author: "George S. Clason", cat: "Kinh tế", price: 95000, stock: 19, sold: 240, isNew: false, pages: 208, year: 2020, rating: 4.6, color: "#9a7d0a", desc: "Những nguyên tắc làm giàu vượt thời gian được kể qua các câu chuyện ngụ ngôn ở thành Babylon cổ đại." },
            { id: 13, title: "Tư Duy Nhanh Và Chậm", author: "Daniel Kahneman", cat: "Kinh tế", price: 168000, stock: 10, sold: 180, isNew: false, pages: 612, year: 2019, rating: 4.6, color: "#4d5656", desc: "Tác phẩm của nhà tâm lý học đoạt giải Nobel Kinh tế về hai hệ thống tư duy chi phối cách con người phán đoán và ra quyết định." },
            { id: 14, title: "Muôn Kiếp Nhân Sinh", author: "Nguyên Phong", cat: "Kỹ năng sống", price: 139000, stock: 21, sold: 265, isNew: true, pages: 380, year: 2022, rating: 4.8, color: "#6c3483", desc: "Cuốn sách về luật nhân quả và luân hồi qua những câu chuyện tiền kiếp, gợi mở nhiều suy ngẫm về cách sống và lẽ đời." },
            { id: 15, title: "Sapiens: Lược Sử Loài Người", author: "Yuval Noah Harari", cat: "Khoa học – Lịch sử", price: 189000, stock: 14, sold: 230, isNew: false, pages: 560, year: 2021, rating: 4.8, color: "#784212", desc: "Hành trình 70.000 năm của loài người từ loài vượn vô danh đến vị trí thống trị thế giới, qua các cuộc cách mạng nhận thức, nông nghiệp và khoa học." },
            { id: 16, title: "Dế Mèn Phiêu Lưu Ký", author: "Tô Hoài", cat: "Thiếu nhi", price: 75000, stock: 32, sold: 275, isNew: false, pages: 184, year: 2020, rating: 4.9, color: "#1e8449", desc: "Tác phẩm thiếu nhi kinh điển của văn học Việt Nam, kể cuộc phiêu lưu của Dế Mèn qua thế giới loài vật với nhiều bài học về tình bạn và lòng dũng cảm." },
            { id: 17, title: "Harry Potter Và Hòn Đá Phù Thủy", author: "J.K. Rowling", cat: "Thiếu nhi", price: 150000, stock: 16, sold: 390, isNew: true, pages: 368, year: 2022, rating: 4.9, color: "#7b241c", desc: "Tập đầu tiên của bộ truyện phù thủy nổi tiếng toàn cầu: cậu bé Harry Potter phát hiện thân phận thật và bước vào trường Hogwarts." },
            { id: 18, title: "Sherlock Holmes Toàn Tập", author: "Arthur Conan Doyle", cat: "Trinh thám", price: 145000, stock: 9, sold: 175, isNew: false, pages: 928, year: 2019, rating: 4.8, color: "#212f3c", desc: "Trọn bộ các vụ án của thám tử Sherlock Holmes và bác sĩ Watson: những suy luận sắc bén đã định hình thể loại truyện trinh thám." },
            { id: 19, title: "Doraemon Truyện Dài Tập 1", author: "Fujiko F. Fujio", cat: "Truyện tranh", price: 45000, stock: 40, sold: 150, isNew: false, pages: 192, year: 2021, rating: 4.8, color: "#2471a3", desc: "Chú khủng long của Nobita: chuyến phiêu lưu đầu tiên trong loạt truyện dài Doraemon, đưa nhóm bạn trở về thời tiền sử." },
            { id: 20, title: "Thám Tử Lừng Danh Conan Tập 100", author: "Gosho Aoyama", cat: "Truyện tranh", price: 25000, stock: 50, sold: 320, isNew: true, pages: 192, year: 2023, rating: 4.9, color: "#922b21", desc: "Tập 100 cột mốc của bộ truyện tranh trinh thám được yêu thích nhất, với những vụ án mới và manh mối về tổ chức áo đen." },
            { id: 21, title: "One Piece Tập 105", author: "Eiichiro Oda", cat: "Truyện tranh", price: 35000, stock: 45, sold: 290, isNew: true, pages: 208, year: 2023, rating: 4.9, color: "#b03a2e", desc: "Băng Mũ Rơm bước vào chương mới sau trận chiến Wano, hành trình đến hòn đảo cuối cùng của Tân Thế Giới ngày càng gần." }
        ],
        users: [
            { name: "Quản trị viên", email: "admin@tientho.vn", pass: "admin123", role: "admin" }
        ],
        orders: [],
        nextBook: 22,
        nextOrder: 1
    };
}

function saveDB() {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function loadDB() {
    try {
        const raw = localStorage.getItem(DB_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) {}
    const fresh = seedDB();
    localStorage.setItem(DB_KEY, JSON.stringify(fresh));
    return fresh;
}

let db = loadDB();
let cart = {};
try { cart = JSON.parse(localStorage.getItem(CART_KEY) || "{}"); } catch (e) { cart = {}; }
let session = null;
try { session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch (e) { session = null; }
let query = "";
let shopPage = 1;

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function toast(msg) {
    const box = $("#toast-container");
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(() => { t.remove(); }, 2800);
}

function bookById(id) {
    return db.books.find(b => b.id === Number(id));
}

function stars(r) {
    const full = Math.round(r);
    return "★★★★★".slice(0, full) + "☆☆☆☆☆".slice(0, 5 - full);
}

function show(view) {
    ["home", "shop", "checkout", "orders", "admin"].forEach(v => {
        $("#view-" + v).hidden = v !== view;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderNavbar() {
    const nav = $("#navbar");
    const count = cartCount();
    let right = "";
    if (session) {
        right = `
        <a class="nav-link" data-navlink="home">🏠 Trang chủ</a>
        <a class="nav-link" data-navlink="cart">🛒 Giỏ hàng${count ? `<span class="cart-badge">${count}</span>` : ""}</a>
        <a class="nav-link" data-navlink="orders">📦 Đơn hàng</a>
        ${session.role === "admin" ? '<a class="nav-link" data-navlink="admin">⚙️ Quản trị</a>' : ""}
        <a class="nav-avatar" data-navlink="orders" title="${session.name}"><span class="avatar-circle">${session.name.charAt(0).toUpperCase()}</span></a>
        <button class="btn btn-sm btn-outline-danger" data-navlink="logout">Đăng xuất</button>`;
    } else {
        right = `
        <a class="nav-link" data-navlink="home">🏠 Trang chủ</a>
        <a class="nav-link" data-navlink="cart">🛒 Giỏ hàng${count ? `<span class="cart-badge">${count}</span>` : ""}</a>
        <button class="btn btn-sm btn-ghost" data-navlink="login">Đăng nhập</button>
        <button class="btn btn-sm btn-primary" data-navlink="register">Đăng ký</button>`;
    }
    nav.innerHTML = `
    <div class="nav-inner">
      <a class="nav-logo" data-navlink="home" style="cursor:pointer">
        <span class="logo-icon">📚</span>
        <span class="logo-text">Tiến <span>Thọ</span></span>
      </a>
      <div class="nav-links">${right}</div>
    </div>`;
}

function renderUser() {
    renderNavbar();
}

function renderCats() {
    const sel = $("#categoryFilter");
    const cur = sel.value;
    sel.innerHTML = '<option value="">Tất cả danh mục</option>' + db.cats.map(c => `<option value="${c}">${c}</option>`).join("");
    if (db.cats.includes(cur)) sel.value = cur;
    $("#bCat").innerHTML = db.cats.map(c => `<option value="${c}">${c}</option>`).join("");
}

function bookCard(b) {
    const out = b.stock <= 0;
    const badge = out ? '<span class="thumb-badge out">HẾT HÀNG</span>'
        : (b.isNew ? '<span class="thumb-badge">MỚI</span>' : (b.sold >= 400 ? '<span class="thumb-badge hot">BÁN CHẠY</span>' : ""));
    return `<div class="course-card">
      <a class="card-thumb-wrap" data-act="view" data-id="${b.id}">
        <span class="thumb-bg" style="background:linear-gradient(135deg, ${b.color}, #1a2235)"></span>
        <span class="mini-cover" style="background:${b.color}">
          <span class="mc-title">${b.title}</span>
          <span class="mc-author">${b.author}</span>
        </span>
        ${badge}
      </a>
      <div class="card-body">
        <h3 class="card-title"><a data-act="view" data-id="${b.id}">${b.title}</a></h3>
        <p class="card-instructor">👤 ${b.author}</p>
        <div class="card-badges">
          <span class="badge badge-outline">${b.cat}</span>
          ${b.isNew ? '<span class="badge badge-new">Sách mới</span>' : ""}
        </div>
        <div class="star-line">${stars(b.rating)} <span class="rating-num">${b.rating}</span> <span class="sold">(Đã bán ${b.sold})</span></div>
        <div class="stock-line ${out ? "out" : ""}">${out ? "Hết hàng" : "Còn " + b.stock + " cuốn"}</div>
        <div class="card-footer">
          <span class="price">${fmt(b.price)}</span>
          <span class="card-actions">
            <button class="icon-btn" data-act="add" data-id="${b.id}" title="Thêm vào giỏ" ${out ? "disabled" : ""}>🛒</button>
            <button class="btn btn-sm btn-primary" data-act="view" data-id="${b.id}">Xem chi tiết</button>
          </span>
        </div>
      </div>
    </div>`;
}

function renderHome() {
    const best = [...db.books].sort((a, b) => b.sold - a.sold).slice(0, 8);
    const news = db.books.filter(b => b.isNew).concat([...db.books].sort((a, b) => b.id - a.id)).filter((v, i, a) => a.indexOf(v) === i).slice(0, 8);
    $("#bestGrid").innerHTML = best.map(bookCard).join("");
    $("#newGrid").innerHTML = news.map(bookCard).join("");
}

function filteredBooks() {
    const cat = $("#categoryFilter").value;
    const rf = $("#ratingFilter").value;
    let list = db.books.filter(b => {
        if (cat && b.cat !== cat) return false;
        if (rf && b.rating < Number(rf)) return false;
        if (query) {
            const q = query.toLowerCase();
            if (!(b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))) return false;
        }
        const pf = $("#priceFilter").value;
        if (pf) {
            const parts = pf.split("-");
            const min = Number(parts[0]), max = Number(parts[1]);
            if (b.price < min || b.price > max) return false;
        }
        return true;
    });
    const s = $("#sortBy").value;
    if (s === "pop") list.sort((a, b) => b.sold - a.sold);
    if (s === "new") list.sort((a, b) => b.id - a.id);
    if (s === "asc") list.sort((a, b) => a.price - b.price);
    if (s === "desc") list.sort((a, b) => b.price - a.price);
    return list;
}

function renderShop() {
    const list = filteredBooks();
    const cat = $("#categoryFilter").value;
    $("#shopTitle").textContent = query ? `Kết quả tìm kiếm: "${query}"` : (cat || "Tất cả sách");
    const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (shopPage > totalPages) shopPage = totalPages;
    const pageItems = list.slice((shopPage - 1) * PAGE_SIZE, shopPage * PAGE_SIZE);
    const box = $("#books-container");
    if (!list.length) {
        box.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><p class="empty-text">Không tìm thấy sách phù hợp. Thử từ khóa hoặc danh mục khác nhé.</p></div>`;
    } else {
        box.innerHTML = `<div class="courses-grid">${pageItems.map(bookCard).join("")}</div>
        <p style="color:var(--text-dim);font-size:.85rem;margin-top:12px">Tìm thấy <strong>${list.length}</strong> cuốn sách</p>`;
    }
    const pg = $("#pagination");
    if (totalPages <= 1) { pg.innerHTML = ""; return; }
    pg.innerHTML = `
      <button class="btn btn-outline btn-sm" data-page="${shopPage - 1}" ${shopPage === 1 ? "disabled" : ""}>← Trước</button>
      <span class="page-info">Trang ${shopPage} / ${totalPages}</span>
      <button class="btn btn-outline btn-sm" data-page="${shopPage + 1}" ${shopPage === totalPages ? "disabled" : ""}>Sau →</button>`;
}

function cartCount() {
    return Object.values(cart).reduce((a, b) => a + b, 0);
}

function cartSubtotal() {
    return Object.keys(cart).reduce((sum, id) => {
        const b = bookById(id);
        return b ? sum + b.price * cart[id] : sum;
    }, 0);
}

function renderCart() {
    renderNavbar();
    const box = $("#cartItems");
    const ids = Object.keys(cart);
    if (!ids.length) {
        box.innerHTML = '<div class="empty-state"><div class="empty-icon">🛒</div><p class="empty-text">Giỏ hàng đang trống.</p></div>';
    } else {
        box.innerHTML = ids.map(id => {
            const b = bookById(id);
            if (!b) return "";
            return `<div class="cart-item">
                <div class="thumb" style="background:${b.color}">${b.title}</div>
                <div class="info">
                    <b>${b.title}</b><br>
                    <span class="muted">${fmt(b.price)}</span>
                    <div class="qty">
                        <button data-cact="dec" data-id="${b.id}">−</button>
                        <span>${cart[id]}</span>
                        <button data-cact="inc" data-id="${b.id}">+</button>
                        <button class="mini-btn red" data-cact="del" data-id="${b.id}">Xóa</button>
                    </div>
                </div>
                <b>${fmt(b.price * cart[id])}</b>
            </div>`;
        }).join("");
    }
    $("#cartTotal").textContent = fmt(cartSubtotal());
}

function addToCart(id, qty) {
    const b = bookById(id);
    if (!b) return;
    const cur = cart[id] || 0;
    if (cur + qty > b.stock) {
        toast(`"${b.title}" chỉ còn ${b.stock} cuốn trong kho.`);
        return;
    }
    cart[id] = cur + qty;
    saveCart();
    renderCart();
    toast(`Đã thêm "${b.title}" vào giỏ hàng.`);
}

function openDetail(id) {
    const b = bookById(id);
    if (!b) return;
    $("#bookDetail").innerHTML = `<div class="detail">
        <div class="detail-cover" style="background:${b.color}">
            <span class="dc-title">${b.title}</span>
            <span class="dc-author">${b.author}</span>
        </div>
        <div>
            <h2>${b.title}</h2>
            <div class="star-line">${stars(b.rating)} <span class="rating-num">${b.rating}</span> <span class="sold">(Đã bán ${b.sold} cuốn)</span></div>
            <div class="card-badges" style="margin-top:10px">
              <span class="badge badge-outline">${b.cat}</span>
              ${b.isNew ? '<span class="badge badge-new">Sách mới</span>' : ""}
            </div>
            <div class="meta">
                Tác giả: <b>${b.author}</b><br>
                Danh mục: ${b.cat}<br>
                Số trang: ${b.pages} · Năm xuất bản: ${b.year}<br>
                Tình trạng: ${b.stock > 0 ? "Còn " + b.stock + " cuốn" : "Hết hàng"}
            </div>
            <p class="desc">${b.desc}</p>
            <div class="price" style="font-size:1.4rem;margin-top:14px">${fmt(b.price)}</div>
            <div class="qty-row">
                Số lượng:
                <button class="qty-btn" id="dMinus">−</button>
                <b id="dQty">1</b>
                <button class="qty-btn" id="dPlus">+</button>
                <button class="btn btn-primary" id="dAdd" ${b.stock <= 0 ? "disabled" : ""}>🛒 Thêm vào giỏ</button>
            </div>
        </div>
    </div>`;
    $("#bookModal").hidden = false;
    let q = 1;
    $("#dMinus").onclick = () => { q = Math.max(1, q - 1); $("#dQty").textContent = q; };
    $("#dPlus").onclick = () => { q = Math.min(b.stock || 1, q + 1); $("#dQty").textContent = q; };
    $("#dAdd").onclick = () => { addToCart(b.id, q); $("#bookModal").hidden = true; };
}

function renderCheckout() {
    const ids = Object.keys(cart);
    $("#coItems").innerHTML = ids.length ? ids.map(id => {
        const b = bookById(id);
        return b ? `<div class="co-item"><span>${b.title} × ${cart[id]}</span><b>${fmt(b.price * cart[id])}</b></div>` : "";
    }).join("") : '<p class="muted">Giỏ hàng trống.</p>';
    const sub = cartSubtotal();
    const ship = sub === 0 || sub >= 200000 ? 0 : 25000;
    $("#coSub").textContent = fmt(sub);
    $("#coShip").textContent = ship === 0 ? "Miễn phí" : fmt(ship);
    $("#coTotal").textContent = fmt(sub + ship);
    if (session) $("#coName").value = session.name;
}

function makeQR(pay, total) {
    let h = 0;
    const s = pay + total;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973;
    let html = "";
    for (let i = 0; i < 81; i++) {
        h = (h * 1103515245 + 12345) % 2147483648;
        const on = (h >> 8) % 2 === 0;
        const corner = (i < 3 || (i % 9 < 3 && i < 27) || (i % 9 > 5 && i < 27) || i > 53 && i % 9 < 3);
        html += `<i style="background:${on || corner ? "#263238" : "#fff"}"></i>`;
    }
    $("#qrPattern").innerHTML = html;
    $("#qrText").textContent = `Thanh toán ${fmt(total)} cho Nhà sách Tiến Thọ qua ${pay} (môi trường demo/sandbox).`;
}

function placeOrder(e) {
    e.preventDefault();
    if (!Object.keys(cart).length) {
        toast("Giỏ hàng đang trống.");
        return;
    }
    const pay = document.querySelector('input[name="pay"]:checked').value;
    const sub = cartSubtotal();
    const ship = sub >= 200000 ? 0 : 25000;
    const order = {
        id: "DH" + String(db.nextOrder).padStart(4, "0"),
        date: new Date().toLocaleString("vi-VN"),
        email: session ? session.email : "",
        name: $("#coName").value.trim(),
        phone: $("#coPhone").value.trim(),
        addr: $("#coAddr").value.trim(),
        items: Object.keys(cart).map(id => {
            const b = bookById(id);
            return { title: b.title, price: b.price, qty: cart[id] };
        }),
        total: sub + ship,
        pay: pay,
        status: pay === "COD" ? "Đang xử lý" : "Đã thanh toán (" + pay + ")"
    };
    Object.keys(cart).forEach(id => {
        const b = bookById(id);
        if (b) { b.stock -= cart[id]; b.sold += cart[id]; }
    });
    db.nextOrder++;
    db.orders.push(order);
    saveDB();
    cart = {};
    saveCart();
    sessionStorage.setItem("tientho_last_phone", order.phone);
    renderCart();
    renderHome();
    toast(`Đặt hàng thành công! Mã đơn ${order.id}. Cảm ơn bạn đã mua sách tại Tiến Thọ.`);
    show("orders");
    renderOrders();
}

function myOrdersList() {
    if (session) return db.orders.filter(o => o.email === session.email);
    const phone = sessionStorage.getItem("tientho_last_phone");
    return phone ? db.orders.filter(o => o.phone === phone) : [];
}

function orderHTML(o) {
    return `<div class="order-card">
        <b>${o.id}</b> · ${o.date} · <span class="status">${o.status}</span><br>
        Người nhận: ${o.name} — ${o.phone} — ${o.addr}<br>
        ${o.items.map(i => `${i.title} × ${i.qty} (${fmt(i.price * i.qty)})`).join("<br>")}
        <br>Thanh toán: ${o.pay} · <b>Tổng: ${fmt(o.total)}</b>
    </div>`;
}

function renderOrders() {
    const list = myOrdersList();
    $("#myOrders").innerHTML = list.length ? list.slice().reverse().map(orderHTML).join("") : '<div class="empty-state"><div class="empty-icon">📦</div><p class="empty-text">Bạn chưa có đơn hàng nào.</p></div>';
}

function renderAdmin() {
    $("#bookTable").innerHTML = `<tr><th>Tên sách</th><th>Tác giả</th><th>Danh mục</th><th>Giá</th><th>Tồn kho</th><th>Đã bán</th><th></th></tr>` +
        db.books.map(b => `<tr>
            <td><b>${b.title}</b>${b.isNew ? ' <span class="status">MỚI</span>' : ""}</td>
            <td>${b.author}</td><td>${b.cat}</td><td>${fmt(b.price)}</td><td>${b.stock}</td><td>${b.sold}</td>
            <td><button class="mini-btn" data-bact="edit" data-id="${b.id}">Sửa</button><button class="mini-btn red" data-bact="del" data-id="${b.id}">Xóa</button></td>
        </tr>`).join("");
    $("#catTable").innerHTML = `<tr><th>Danh mục</th><th>Số sách</th><th></th></tr>` +
        db.cats.map(c => `<tr>
            <td><b>${c}</b></td><td>${db.books.filter(b => b.cat === c).length}</td>
            <td><button class="mini-btn" data-cact2="edit" data-name="${c}">Sửa</button><button class="mini-btn red" data-cact2="del" data-name="${c}">Xóa</button></td>
        </tr>`).join("");
    $("#orderTable").innerHTML = `<tr><th>Mã đơn</th><th>Khách hàng</th><th>Sản phẩm</th><th>Thanh toán</th><th>Tổng</th><th>Trạng thái</th></tr>` +
        (db.orders.length ? db.orders.slice().reverse().map(o => `<tr>
            <td><b>${o.id}</b><br><span class="muted">${o.date}</span></td>
            <td>${o.name}<br><span class="muted">${o.phone}</span></td>
            <td>${o.items.map(i => `${i.title} × ${i.qty}`).join("<br>")}</td>
            <td>${o.pay}</td><td><b>${fmt(o.total)}</b></td><td>${o.status}</td>
        </tr>`).join("") : '<tr><td colspan="6">Chưa có đơn hàng nào.</td></tr>');
}

function resetBookForm() {
    $("#bookForm").reset();
    $("#bId").value = "";
    $("#bColor").value = "#6366f1";
    $("#bookFormTitle").textContent = "Thêm sách mới";
    $("#bCancel").hidden = true;
}

function doSearch() {
    query = $("#q").value.trim();
    shopPage = 1;
    renderShop();
    show("shop");
}

function resetFilters() {
    $("#q").value = "";
    query = "";
    $("#categoryFilter").value = "";
    $("#priceFilter").value = "";
    $("#ratingFilter").value = "";
    $("#sortBy").value = "pop";
    shopPage = 1;
    renderShop();
}

function doLogout() {
    session = null;
    localStorage.removeItem(SESSION_KEY);
    renderNavbar();
    toast("Đã đăng xuất.");
    show("home");
}

document.addEventListener("click", e => {
    const nav = e.target.closest("[data-nav]");
    if (nav) {
        e.preventDefault();
        if (nav.dataset.nav === "shop") { shopPage = 1; renderShop(); }
        show(nav.dataset.nav);
        return;
    }
    const nl = e.target.closest("[data-navlink]");
    if (nl) {
        const k = nl.dataset.navlink;
        if (k === "home") show("home");
        if (k === "cart") { renderCart(); $("#cartDrawer").hidden = false; }
        if (k === "orders") { renderOrders(); show("orders"); }
        if (k === "admin") { renderAdmin(); show("admin"); }
        if (k === "login") { $("#authModal").hidden = false; $("#tabLoginBtn").click(); }
        if (k === "register") { $("#authModal").hidden = false; $("#tabRegBtn").click(); }
        if (k === "logout") doLogout();
        return;
    }
    const pgBtn = e.target.closest("[data-page]");
    if (pgBtn && !pgBtn.disabled) {
        shopPage = Number(pgBtn.dataset.page);
        renderShop();
        return;
    }
    const act = e.target.closest("[data-act]");
    if (act) {
        if (act.dataset.act === "view") openDetail(act.dataset.id);
        if (act.dataset.act === "add") addToCart(act.dataset.id, 1);
        return;
    }
    const cact = e.target.closest("[data-cact]");
    if (cact) {
        const id = cact.dataset.id;
        if (cact.dataset.cact === "inc") {
            const b = bookById(id);
            if (b && cart[id] < b.stock) cart[id]++;
            else toast("Đã đạt số lượng tồn kho tối đa.");
        }
        if (cact.dataset.cact === "dec") {
            cart[id]--;
            if (cart[id] <= 0) delete cart[id];
        }
        if (cact.dataset.cact === "del") delete cart[id];
        saveCart();
        renderCart();
        return;
    }
    const close = e.target.closest("[data-close]");
    if (close) { $("#" + close.dataset.close).hidden = true; return; }
    const bact = e.target.closest("[data-bact]");
    if (bact) {
        const b = bookById(bact.dataset.id);
        if (!b) return;
        if (bact.dataset.bact === "edit") {
            $("#bId").value = b.id;
            $("#bTitle").value = b.title;
            $("#bAuthor").value = b.author;
            $("#bCat").value = b.cat;
            $("#bPrice").value = b.price;
            $("#bStock").value = b.stock;
            $("#bPages").value = b.pages;
            $("#bYear").value = b.year;
            $("#bColor").value = b.color;
            $("#bDesc").value = b.desc;
            $("#bNew").checked = b.isNew;
            $("#bookFormTitle").textContent = "Sửa sách: " + b.title;
            $("#bCancel").hidden = false;
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        if (bact.dataset.bact === "del") {
            if (confirm(`Xóa sách "${b.title}" khỏi hệ thống?`)) {
                db.books = db.books.filter(x => x.id !== b.id);
                delete cart[b.id];
                saveDB(); saveCart();
                renderAll();
                toast("Đã xóa sách.");
            }
        }
        return;
    }
    const cact2 = e.target.closest("[data-cact2]");
    if (cact2) {
        const name = cact2.dataset.name;
        if (cact2.dataset.cact2 === "edit") {
            $("#cOld").value = name;
            $("#cName").value = name;
            $("#cCancel").hidden = false;
        }
        if (cact2.dataset.cact2 === "del") {
            if (db.books.some(b => b.cat === name)) {
                toast("Danh mục đang có sách, không thể xóa. Hãy chuyển sách sang danh mục khác trước.");
                return;
            }
            if (confirm(`Xóa danh mục "${name}"?`)) {
                db.cats = db.cats.filter(c => c !== name);
                saveDB();
                renderAll();
                toast("Đã xóa danh mục.");
            }
        }
        return;
    }
    const tab = e.target.closest(".tab[data-tab]");
    if (tab) {
        $$(".tab[data-tab]").forEach(t => t.classList.toggle("active", t === tab));
        ["books", "cats", "orders", "sys"].forEach(k => { $("#tab-" + k).hidden = k !== tab.dataset.tab; });
        return;
    }
});

function renderAll() {
    renderNavbar();
    renderCats();
    renderHome();
    renderShop();
    renderCart();
    renderAdmin();
}

$("#btnSearch").onclick = doSearch;
$("#btnResetFilter").onclick = resetFilters;
$("#q").addEventListener("keydown", e => { if (e.key === "Enter") doSearch(); });
["categoryFilter", "priceFilter", "ratingFilter", "sortBy"].forEach(id => {
    $("#" + id).addEventListener("change", () => { shopPage = 1; renderShop(); });
});

$("#btnCloseCart").onclick = () => { $("#cartDrawer").hidden = true; };
$("#btnGoCheckout").onclick = () => {
    if (!Object.keys(cart).length) { toast("Giỏ hàng đang trống."); return; }
    $("#cartDrawer").hidden = true;
    renderCheckout();
    updatePayUI();
    show("checkout");
};

function updatePayUI() {
    const pay = document.querySelector('input[name="pay"]:checked').value;
    const sub = cartSubtotal();
    const total = sub + (sub >= 200000 || sub === 0 ? 0 : 25000);
    if (pay === "COD") {
        $("#qrBox").hidden = true;
        $("#btnPlaceOrder").textContent = "Đặt hàng";
    } else {
        $("#qrBox").hidden = false;
        makeQR(pay, total);
        $("#btnPlaceOrder").textContent = "Tôi đã thanh toán — Hoàn tất đặt hàng";
    }
}
$$('input[name="pay"]').forEach(r => r.addEventListener("change", updatePayUI));
$("#checkoutForm").addEventListener("submit", placeOrder);

$("#tabLoginBtn").onclick = () => {
    $("#tabLoginBtn").classList.add("active");
    $("#tabRegBtn").classList.remove("active");
    $("#loginForm").hidden = false;
    $("#regForm").hidden = true;
};
$("#tabRegBtn").onclick = () => {
    $("#tabRegBtn").classList.add("active");
    $("#tabLoginBtn").classList.remove("active");
    $("#loginForm").hidden = true;
    $("#regForm").hidden = false;
};

$("#loginForm").addEventListener("submit", e => {
    e.preventDefault();
    const u = db.users.find(x => x.email === $("#liEmail").value.trim().toLowerCase() && x.pass === $("#liPass").value);
    if (!u) { toast("Email hoặc mật khẩu chưa đúng."); return; }
    session = { name: u.name, email: u.email, role: u.role };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    $("#authModal").hidden = true;
    renderNavbar();
    toast("Xin chào " + u.name + "!");
});

$("#regForm").addEventListener("submit", e => {
    e.preventDefault();
    const email = $("#rgEmail").value.trim().toLowerCase();
    if (db.users.some(x => x.email === email)) { toast("Email này đã được đăng ký."); return; }
    const u = { name: $("#rgName").value.trim(), email: email, pass: $("#rgPass").value, role: "customer" };
    db.users.push(u);
    saveDB();
    session = { name: u.name, email: u.email, role: u.role };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    $("#authModal").hidden = true;
    renderNavbar();
    toast("Đăng ký thành công. Xin chào " + u.name + "!");
});

$("#bookForm").addEventListener("submit", e => {
    e.preventDefault();
    const data = {
        title: $("#bTitle").value.trim(),
        author: $("#bAuthor").value.trim(),
        cat: $("#bCat").value,
        price: Number($("#bPrice").value),
        stock: Number($("#bStock").value),
        pages: Number($("#bPages").value) || 0,
        year: Number($("#bYear").value) || new Date().getFullYear(),
        color: $("#bColor").value,
        desc: $("#bDesc").value.trim(),
        isNew: $("#bNew").checked
    };
    if ($("#bId").value) {
        const b = bookById($("#bId").value);
        Object.assign(b, data);
        toast("Đã cập nhật sách.");
    } else {
        db.books.push(Object.assign({ id: db.nextBook++, sold: 0, rating: 4.5 }, data));
        toast("Đã thêm sách mới.");
    }
    saveDB();
    resetBookForm();
    renderAll();
});
$("#bCancel").onclick = resetBookForm;

$("#catForm").addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#cName").value.trim();
    const old = $("#cOld").value;
    if (!name) return;
    if (old) {
        if (db.cats.some(c => c === name && name !== old)) { toast("Tên danh mục đã tồn tại."); return; }
        db.cats = db.cats.map(c => c === old ? name : c);
        db.books.forEach(b => { if (b.cat === old) b.cat = name; });
        toast("Đã sửa danh mục.");
    } else {
        if (db.cats.includes(name)) { toast("Danh mục đã tồn tại."); return; }
        db.cats.push(name);
        toast("Đã thêm danh mục.");
    }
    $("#cOld").value = "";
    $("#cName").value = "";
    $("#cCancel").hidden = true;
    saveDB();
    renderAll();
});
$("#cCancel").onclick = () => {
    $("#cOld").value = "";
    $("#cName").value = "";
    $("#cCancel").hidden = true;
};

$("#btnReset").onclick = () => {
    if (!confirm("Khôi phục toàn bộ dữ liệu về trạng thái gốc? Sách, danh mục, tài khoản tự đăng ký và đơn hàng sẽ bị đặt lại.")) return;
    localStorage.removeItem(DB_KEY);
    localStorage.removeItem(CART_KEY);
    db = loadDB();
    cart = {};
    resetBookForm();
    renderAll();
    toast("Đã khôi phục dữ liệu gốc.");
};

renderAll();
