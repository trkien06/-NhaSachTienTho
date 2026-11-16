const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const fmt = n => n.toLocaleString("vi-VN") + "đ";
const CART_KEY = "tientho_cart";
const TOKEN_KEY = "tientho_token";
const USER_KEY = "tientho_user";
const PAGE_SIZE = 9;

let db = { books: [], cats: [] };
let adminBooks = [];
let adminUsers = [];
let adminOrders = [];
let adminPromos = [];
let adminStats = null;
let myOrdersCache = [];
let cart = {};
try { cart = JSON.parse(localStorage.getItem(CART_KEY) || "{}"); } catch (e) { cart = {}; }
let token = localStorage.getItem(TOKEN_KEY) || null;
let session = null;
try { session = JSON.parse(localStorage.getItem(USER_KEY) || "null"); } catch (e) { session = null; }
let query = "";
let shopPage = 1;
let appliedPromo = null;

function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function api(path, opts) {
    opts = opts || {};
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = "Bearer " + token;
    const res = await fetch("/api" + path, {
        method: opts.method || "GET",
        headers: headers,
        body: opts.body ? JSON.stringify(opts.body) : undefined
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Có lỗi xảy ra, thử lại sau.");
    return data;
}

function setSession(tok, user) {
    token = tok;
    session = user;
    if (tok) {
        localStorage.setItem(TOKEN_KEY, tok);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
}

async function loadCatalog() {
    const results = await Promise.all([api("/books"), api("/categories")]);
    db.books = results[0];
    db.cats = results[1];
}

async function loadAdminData() {
    const r = await Promise.all([api("/admin/books"), api("/admin/users"), api("/admin/orders"), api("/admin/promos"), api("/admin/stats")]);
    adminBooks = r[0];
    adminUsers = r[1];
    adminOrders = r[2];
    adminPromos = r[3];
    adminStats = r[4];
}

async function loadMyOrders() {
    if (session) {
        myOrdersCache = await api("/orders/mine");
    } else {
        const phone = sessionStorage.getItem("tientho_last_phone");
        myOrdersCache = phone ? await api("/orders/lookup?phone=" + encodeURIComponent(phone)) : [];
    }
}

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

const ICON_CART = '<svg viewBox="0 0 24 24"><circle cx="9.5" cy="20.5" r="1.5"/><circle cx="17" cy="20.5" r="1.5"/><path d="M2.5 3h2l2.5 12.2a1.6 1.6 0 0 0 1.6 1.3h7.7a1.6 1.6 0 0 0 1.6-1.3L20 7.5H6"/></svg>';
const ICON_HOME = '<svg viewBox="0 0 24 24"><path d="M4 11l8-7 8 7"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/></svg>';
const ICON_BOOK = '<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/></svg>';
const ICON_BOX = '<svg viewBox="0 0 24 24"><path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/></svg>';
const ICON_SLIDERS = '<svg viewBox="0 0 24 24"><path d="M4 8h9M19 8h1M4 16h3M13 16h7"/><circle cx="16" cy="8" r="2.2"/><circle cx="10" cy="16" r="2.2"/></svg>';
const ICON_SEARCH_BIG = '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.8-3.8"/></svg>';

function discPct(b) {
    return b.list && b.list > b.price ? Math.round((1 - b.price / b.list) * 100) : 0;
}

function coverTag(b) {
    if (b.cover) return `<img class="cover-img" src="${b.cover}" alt="Bìa sách ${b.title}" loading="lazy">`;
    return `<span class="mini-cover" style="background:${b.color}"><span class="mc-title">${b.title}</span><span class="mc-author">${b.author}</span></span>`;
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
    const cartLink = `<a class="nav-link" data-navlink="cart">${ICON_CART} Giỏ hàng${count ? `<span class="cart-badge">${count}</span>` : ""}</a>`;
    let right = "";
    if (session) {
        right = `
        <a class="nav-link" data-navlink="home">${ICON_HOME} Trang chủ</a>
        <a class="nav-link" data-navlink="shop">${ICON_BOOK} Cửa hàng</a>
        ${cartLink}
        <a class="nav-link" data-navlink="orders">${ICON_BOX} Đơn hàng</a>
        ${session.role === "admin" ? `<a class="nav-link" data-navlink="admin">${ICON_SLIDERS} Quản trị</a>` : ""}
        <a class="nav-avatar" data-navlink="orders" title="${session.name}"><span class="avatar-circle">${session.name.charAt(0).toUpperCase()}</span></a>
        <button class="btn btn-sm btn-outline-danger" data-navlink="logout">Đăng xuất</button>`;
    } else {
        right = `
        <a class="nav-link" data-navlink="home">${ICON_HOME} Trang chủ</a>
        <a class="nav-link" data-navlink="shop">${ICON_BOOK} Cửa hàng</a>
        ${cartLink}
        <button class="btn btn-sm btn-ghost" data-navlink="login">Đăng nhập</button>
        <button class="btn btn-sm btn-primary" data-navlink="register">Đăng ký</button>`;
    }
    nav.innerHTML = `
    <div class="nav-inner">
      <a class="nav-logo" data-navlink="home">
        <span class="logo-icon"><img src="logo-symbol.png" alt="Nhà sách Tiến Thọ"></span>
        <span class="logo-text"><span class="logo-name">Tiến <span>Thọ</span></span><span class="logo-sub">Nhà sách</span></span>
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
    const pct = discPct(b);
    const badge = out ? '<span class="thumb-badge out">Hết hàng</span>'
        : (b.isNew ? '<span class="thumb-badge">Mới</span>' : (b.sold >= 400 ? '<span class="thumb-badge hot">Bán chạy</span>' : ""));
    return `<div class="course-card">
      <a class="card-thumb-wrap" data-act="view" data-id="${b.id}">
        ${coverTag(b)}
        ${pct ? `<span class="disc-badge">-${pct}%</span>` : ""}
        ${badge}
      </a>
      <div class="card-body">
        <span class="card-cat">${b.cat}</span>
        <h3 class="card-title"><a data-act="view" data-id="${b.id}">${b.title}</a></h3>
        <p class="card-instructor">${b.author}</p>
        <div class="star-line">${stars(b.rating)} <span class="rating-num">${b.rating}</span> <span class="sold">(${b.sold} đã bán)</span></div>
        <div class="stock-line ${out ? "out" : ""}">${out ? "Hết hàng" : "Còn " + b.stock + " cuốn"}</div>
        <div class="card-footer">
          <span class="price-box"><span class="price">${fmt(b.price)}</span>${pct ? `<span class="price-old">${fmt(b.list)}</span>` : ""}</span>
          <span class="card-actions">
            <button class="add-btn" data-act="add" data-id="${b.id}" title="Thêm vào giỏ hàng" ${out ? "disabled" : ""}>${ICON_CART}</button>
          </span>
        </div>
      </div>
    </div>`;
}

function renderHome() {
    const pub = db.books.filter(b => b.status !== "pending");
    const best = [...pub].sort((a, b) => b.sold - a.sold).slice(0, 8);
    const news = pub.filter(b => b.isNew).concat([...pub].sort((a, b) => b.id - a.id)).filter((v, i, a) => a.indexOf(v) === i).slice(0, 8);
    $("#bestGrid").innerHTML = best.map(bookCard).join("");
    $("#newGrid").innerHTML = news.map(bookCard).join("");
}

function filteredBooks() {
    const cat = $("#categoryFilter").value;
    const rf = $("#ratingFilter").value;
    let list = db.books.filter(b => {
        if (b.status === "pending") return false;
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
        box.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICON_SEARCH_BIG}</div><p class="empty-text">Không tìm thấy sách phù hợp. Thử từ khóa hoặc danh mục khác nhé.</p></div>`;
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
        box.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICON_CART}</div><p class="empty-text">Giỏ hàng đang trống.</p></div>`;
    } else {
        box.innerHTML = ids.map(id => {
            const b = bookById(id);
            if (!b) return "";
            return `<div class="cart-item">
                <div class="thumb">${b.cover ? `<img src="${b.cover}" alt="">` : `<div class="thumb-fallback" style="background:${b.color}">${b.title}</div>`}</div>
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
    const pct = discPct(b);
    $("#bookDetail").innerHTML = `<div class="detail">
        <div class="detail-cover">${b.cover ? `<img src="${b.cover}" alt="Bìa sách ${b.title}">` : `<div class="dc-fallback" style="background:${b.color}"><span class="dc-title">${b.title}</span><span class="dc-author">${b.author}</span></div>`}</div>
        <div>
            <span class="card-cat">${b.cat}</span>
            <h2>${b.title}</h2>
            <p class="d-author">Tác giả: <b>${b.author}</b></p>
            <div class="star-line">${stars(b.rating)} <span class="rating-num">${b.rating}</span> <span class="sold">(Đã bán ${b.sold} cuốn)</span></div>
            <div class="price-block">
                <span class="price">${fmt(b.price)}</span>
                ${pct ? `<span class="price-old">${fmt(b.list)}</span><span class="disc-chip">-${pct}%</span>` : ""}
            </div>
            <div class="meta">
                Danh mục: ${b.cat}<br>
                Số trang: ${b.pages} · Năm xuất bản: ${b.year}<br>
                Tình trạng: ${b.stock > 0 ? "Còn " + b.stock + " cuốn" : "Hết hàng"}
            </div>
            <p class="desc">${b.desc}</p>
            <div class="qty-row">
                Số lượng:
                <button class="qty-btn" id="dMinus">−</button>
                <b id="dQty">1</b>
                <button class="qty-btn" id="dPlus">+</button>
                <button class="btn btn-primary" id="dAdd" ${b.stock <= 0 ? "disabled" : ""}>Thêm vào giỏ hàng</button>
            </div>
            <div class="detail-trust">
                <span>Giao nội thành trong 24h</span>
                <span>Đổi trả 7 ngày nếu sách lỗi</span>
                <span>Miễn phí giao hàng từ 200.000đ</span>
            </div>
        </div>
    </div>`;
    $("#bookModal").hidden = false;
    renderBookSocial(b);
    let q = 1;
    $("#dMinus").onclick = () => { q = Math.max(1, q - 1); $("#dQty").textContent = q; };
    $("#dPlus").onclick = () => { q = Math.min(b.stock || 1, q + 1); $("#dQty").textContent = q; };
    $("#dAdd").onclick = () => { addToCart(b.id, q); $("#bookModal").hidden = true; };
}

function checkoutTotals() {
    const sub = cartSubtotal();
    const disc = appliedPromo ? Math.round(sub * appliedPromo.pct / 100) : 0;
    const ship = sub === 0 || sub >= 200000 ? 0 : 25000;
    return { sub: sub, disc: disc, ship: ship, total: sub - disc + ship };
}

async function renderBookSocial(b) {
    const box = $("#bookSocial");
    box.innerHTML = '<p class="muted">Đang tải đánh giá và bình luận...</p>';
    let data;
    try {
        data = await api("/books/" + b.id + "/social");
    } catch (e) {
        box.innerHTML = '<p class="muted">Không tải được đánh giá và bình luận.</p>';
        return;
    }
    const revs = data.reviews;
    const cms = data.comments;
    const avg = revs.length ? (revs.reduce((s, r) => s + r.rating, 0) / revs.length) : 0;
    let html = `<div class="social">
      <h3>Đánh giá sách ${revs.length ? `<span class="rv-stars">${stars(avg)}</span> <span class="rating-num">${avg.toFixed(1)}/5</span> <span class="sold">(${revs.length} đánh giá)</span>` : '<span class="sold">(chưa có đánh giá)</span>'}</h3>`;
    html += revs.length ? revs.slice().reverse().map(r => `<div class="rv-item">
        <div class="rv-head"><b>${esc(r.name)}</b><span class="rv-stars">${stars(r.rating)}</span></div>
        <p>${esc(r.text)}</p><span class="muted">${esc(r.date)}</span>
      </div>`).join("") : '<p class="muted">Hãy là người đầu tiên đánh giá cuốn sách này.</p>';
    if (!data.loggedIn) {
        html += '<p class="muted">Đăng nhập để viết đánh giá và bình luận.</p>';
    } else if (!data.canReview) {
        html += '<p class="muted">Bạn chỉ có thể đánh giá những cuốn sách đã mua tại Tiến Thọ. Bình luận và trao đổi ở ngay bên dưới thì ai cũng tham gia được.</p>';
    } else {
        html += `<div class="rv-form">
          <label class="fld">Số sao
            <select id="rvRating" class="form-control">
              <option value="5">5 sao — Rất hay</option><option value="4">4 sao — Hay</option>
              <option value="3">3 sao — Tạm được</option><option value="2">2 sao — Chưa hay</option>
              <option value="1">1 sao — Không hay</option>
            </select></label>
          <label class="fld">Nhận xét của bạn<textarea id="rvText" class="form-control" rows="2" placeholder="Chia sẻ cảm nhận về cuốn sách..."></textarea></label>
          <button class="btn btn-primary btn-sm" data-rvsubmit data-id="${b.id}">Gửi đánh giá</button>
        </div>`;
    }
    html += `<h3>Bình luận và trao đổi <span class="sold">(${cms.length})</span></h3>`;
    html += cms.length ? cms.slice().reverse().map(c => `<div class="cm-item">
        <div class="cm-head"><b>${esc(c.name)}</b><span class="muted">${esc(c.date)}</span></div>
        <p>${esc(c.text)}</p>
      </div>`).join("") : '<p class="muted">Chưa có bình luận nào.</p>';
    if (data.loggedIn) {
        html += `<div class="cm-form">
          <label class="fld">Bình luận với tên ${esc(session.name)}<textarea id="cmText" class="form-control" rows="2" placeholder="Trao đổi về cuốn sách này..."></textarea></label>
          <button class="btn btn-outline btn-sm" data-cmsubmit data-id="${b.id}">Gửi bình luận</button>
        </div>`;
    }
    html += "</div>";
    box.innerHTML = html;
}

function renderCheckout() {
    const ids = Object.keys(cart);
    $("#coItems").innerHTML = ids.length ? ids.map(id => {
        const b = bookById(id);
        return b ? `<div class="co-item"><span>${b.title} × ${cart[id]}</span><b>${fmt(b.price * cart[id])}</b></div>` : "";
    }).join("") : '<p class="muted">Giỏ hàng trống.</p>';
    const t = checkoutTotals();
    $("#coSub").textContent = fmt(t.sub);
    $("#coShip").textContent = t.ship === 0 ? "Miễn phí" : fmt(t.ship);
    $("#coDiscRow").hidden = t.disc <= 0;
    if (t.disc > 0) {
        $("#coDiscCode").textContent = appliedPromo.code;
        $("#coDisc").textContent = "-" + fmt(t.disc);
    }
    $("#coTotal").textContent = fmt(t.total);
    if (session) $("#coName").value = session.name;
}

const PAYLOAD_MOMO = "00020101021138630010A000000727013300069710250119PSP26018191000000160208QRIBFTTA53037045802VN62190515MOMOW2W7599462763045FEE";
const PAYLOAD_ZALO = "00020101021126400010vn.zalopay0115RG4ZsrssmLscWiW020300238620010A00000072701320006970454011899ZP24201M346856330208QRIBFTTA5204739953037045802VN63042718";
function crc16qr(str) {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
        crc ^= str.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xFFFF : (crc << 1) & 0xFFFF;
    }
    return crc;
}
function dynamicPayload(base, amount) {
    let p = base.slice(0, -8);
    p = p.slice(0, 6) + "010212" + p.slice(12);
    const amt = String(amount);
    const tag54 = "54" + String(amt.length).padStart(2, "0") + amt;
    const idx = p.indexOf("5802VN");
    p = p.slice(0, idx) + tag54 + p.slice(idx) + "6304";
    return p + crc16qr(p).toString(16).toUpperCase().padStart(4, "0");
}
function makeQR(pay, total) {
    const data = dynamicPayload(pay === "MoMo" ? PAYLOAD_MOMO : PAYLOAD_ZALO, total);
    const qr = qrcode(0, "M");
    qr.addData(data);
    qr.make();
    $("#qrPattern").innerHTML = qr.createSvgTag({ cellSize: 5, margin: 4, scalable: true });
    $("#qrText").textContent = `Mở ứng dụng ${pay} quét mã: số tiền ${fmt(total)} đã được điền sẵn, người nhận Vũ Đoàn Trung Kiên (Nhà sách Tiến Thọ). Kiểm tra đúng số tiền rồi xác nhận chuyển khoản, sau đó bấm nút Đặt hàng bên dưới để hoàn tất.`;
}

async function placeOrder(e) {
    e.preventDefault();
    if (!Object.keys(cart).length) {
        toast("Giỏ hàng đang trống.");
        return;
    }
    const pay = document.querySelector('input[name="pay"]:checked').value;
    try {
        const order = await api("/orders", { method: "POST", body: {
            name: $("#coName").value.trim(),
            phone: $("#coPhone").value.trim(),
            addr: $("#coAddr").value.trim(),
            pay: pay,
            promo: appliedPromo ? appliedPromo.code : "",
            items: Object.keys(cart).map(id => ({ bookId: Number(id), qty: cart[id] }))
        } });
        cart = {};
        saveCart();
        appliedPromo = null;
        $("#promoCode").value = "";
        $("#promoMsg").textContent = "";
        sessionStorage.setItem("tientho_last_phone", order.phone);
        await loadCatalog();
        await loadMyOrders();
        renderCart();
        renderHome();
        renderShop();
        toast(`Đặt hàng thành công! Mã đơn ${order.id}. Cảm ơn bạn đã mua sách tại Tiến Thọ.`);
        show("orders");
        renderOrders();
    } catch (err) {
        toast(err.message);
    }
}

function myOrdersList() {
    return myOrdersCache;
}

function orderHTML(o) {
    return `<div class="order-card">
        <b>${o.id}</b> · ${o.date} · <span class="status">${o.status}</span><br>
        Người nhận: ${o.name} — ${o.phone} — ${o.addr}<br>
        ${o.items.map(i => `${i.title} × ${i.qty} (${fmt(i.price * i.qty)})`).join("<br>")}
        ${o.discount ? `<br>Giảm giá (${esc(o.promo)}): -${fmt(o.discount)}` : ""}
        <br>Thanh toán: ${o.pay} · <b>Tổng: ${fmt(o.total)}</b>
    </div>`;
}

function renderOrders() {
    const list = myOrdersList();
    $("#myOrders").innerHTML = list.length ? list.slice().reverse().map(orderHTML).join("") : `<div class="empty-state"><div class="empty-icon">${ICON_BOX}</div><p class="empty-text">Bạn chưa có đơn hàng nào.</p></div>`;
}

function renderAdmin() {
    if (adminStats) {
        $("#statUsers").textContent = adminStats.users;
        $("#statBooks").textContent = adminStats.books;
        $("#statOrders").textContent = adminStats.orders;
        $("#statRevenue").textContent = fmt(adminStats.revenue);
    }
    const bt = `<tr><th>Mã</th><th>Bìa</th><th>Tiêu đề</th><th>Tác giả</th><th>Danh mục</th><th class="num">Giá bán</th><th class="num">Tồn kho</th><th>Trạng thái</th><th>Thao tác</th></tr>`;
    $("#bookTable").innerHTML = bt + adminBooks.map(b => `<tr>
        <td>#${b.id}</td>
        <td>${coverTag(b, "cover-sm")}</td>
        <td><b>${esc(b.title)}</b></td>
        <td>${esc(b.author)}</td>
        <td>${esc(b.cat)}</td>
        <td class="num">${fmt(b.price)}</td>
        <td class="num">${b.stock}</td>
        <td>${b.status === "pending" ? '<span class="badge bg-amber">Chờ duyệt</span>' : '<span class="badge bg-teal">Đang bán</span>'}</td>
        <td><button class="mini-btn" data-bact="edit" data-id="${b.id}">Sửa</button><button class="mini-btn red" data-bact="del" data-id="${b.id}">Xóa</button></td></tr>`).join("");
    const pending = adminBooks.filter(b => b.status === "pending");
    $("#approveTable").innerHTML = `<tr><th>Mã</th><th>Bìa</th><th>Tiêu đề</th><th>Tác giả</th><th>Danh mục</th><th class="num">Giá bán</th><th class="num">Tồn kho</th><th>Thao tác</th></tr>` + (pending.length ? pending.map(b => `<tr>
        <td>#${b.id}</td>
        <td>${coverTag(b, "cover-sm")}</td>
        <td><b>${esc(b.title)}</b></td>
        <td>${esc(b.author)}</td>
        <td>${esc(b.cat)}</td>
        <td class="num">${fmt(b.price)}</td>
        <td class="num">${b.stock}</td>
        <td><button class="mini-btn" data-aact="ok" data-id="${b.id}">Duyệt bán</button><button class="mini-btn red" data-aact="no" data-id="${b.id}">Từ chối</button></td></tr>`).join("") : '<tr><td colspan="8" class="muted">Không có sách nào đang chờ duyệt.</td></tr>');
    $("#catTable").innerHTML = `<tr><th>Tên danh mục</th><th class="num">Số sách</th><th>Thao tác</th></tr>` + db.cats.map(c => `<tr>
        <td><b>${esc(c)}</b></td>
        <td class="num">${adminBooks.filter(b => b.cat === c).length}</td>
        <td><button class="mini-btn" data-cact2="edit" data-name="${esc(c)}">Sửa</button><button class="mini-btn red" data-cact2="del" data-name="${esc(c)}">Xóa</button></td></tr>`).join("");
    $("#userTable").innerHTML = `<tr><th>Họ tên</th><th>Email</th><th>Vai trò</th><th>Trạng thái</th><th>Thao tác</th></tr>` + adminUsers.map(u => `<tr>
        <td><b>${esc(u.name)}</b></td>
        <td>${esc(u.email)}</td>
        <td>${u.role === "admin" ? '<span class="badge bg-navy">Quản trị viên</span>' : '<span class="badge bg-teal">Khách hàng</span>'}</td>
        <td>${u.locked ? '<span class="badge bg-amber">Đã khóa</span>' : '<span class="badge bg-teal">Hoạt động</span>'}</td>
        <td>${u.role === "admin" ? '<span class="muted">Tài khoản quản trị</span>' : `<button class="mini-btn ${u.locked ? "" : "red"}" data-uact="toggle" data-email="${esc(u.email)}">${u.locked ? "Mở khóa" : "Khóa"}</button>`}</td></tr>`).join("");
    $("#promoTable").innerHTML = `<tr><th>Mã</th><th class="num">Giảm (%)</th><th>Trạng thái</th><th>Thao tác</th></tr>` + adminPromos.map(p => `<tr>
        <td><b>${esc(p.code)}</b></td>
        <td class="num">${p.pct}%</td>
        <td>${p.active ? '<span class="badge bg-teal">Đang áp dụng</span>' : '<span class="badge bg-amber">Đã tắt</span>'}</td>
        <td><button class="mini-btn" data-pact="edit" data-code="${esc(p.code)}">Sửa</button><button class="mini-btn" data-pact="toggle" data-code="${esc(p.code)}">${p.active ? "Tắt" : "Bật"}</button><button class="mini-btn red" data-pact="del" data-code="${esc(p.code)}">Xóa</button></td></tr>`).join("");
    $("#orderTable").innerHTML = `<tr><th>Mã đơn</th><th>Khách hàng</th><th>Chi tiết</th><th>Mã giảm</th><th class="num">Tổng tiền</th><th>Thanh toán</th><th>Trạng thái</th></tr>` + adminOrders.slice().reverse().map(o => `<tr>
        <td><b>${o.id}</b><br><span class="muted">${esc(o.date)}</span></td>
        <td>${esc(o.name)}<br><span class="muted">${esc(o.phone)}</span><br><span class="muted">${esc(o.addr)}</span></td>
        <td>${o.items.map(i => `${esc(i.title)} × ${i.qty}`).join("<br>")}</td>
        <td>${o.promo ? `<b>${esc(o.promo)}</b><br><span class="muted">-${fmt(o.discount)}</span>` : '<span class="muted">—</span>'}</td>
        <td class="num">${fmt(o.total)}</td>
        <td>${esc(o.pay)}</td>
        <td><select class="form-control admin-status" data-ostatus="${o.id}">
            ${["Đang xử lý", "Đang giao", "Hoàn thành", "Đã hủy"].map(s => `<option value="${s}" ${o.status === s ? "selected" : ""}>${s}</option>`).join("")}
            ${o.status.startsWith("Đã thanh toán") ? `<option value="${o.status}" selected>${o.status}</option>` : ""}
        </select></td></tr>`).join("");
}

function resetBookForm() {
    $("#bookForm").reset();
    $("#bId").value = "";
    $("#bColor").value = "#b01e24";
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

async function doLogout() {
    try { await api("/auth/logout", { method: "POST" }); } catch (e) { }
    setSession(null, null);
    adminBooks = [];
    adminUsers = [];
    adminOrders = [];
    adminPromos = [];
    adminStats = null;
    myOrdersCache = [];
    renderNavbar();
    toast("Đã đăng xuất.");
    show("home");
}

document.addEventListener("click", async e => {
    const nav = e.target.closest("[data-nav]");
    if (nav) {
        e.preventDefault();
        if (nav.dataset.nav === "shop") { shopPage = 1; renderShop(); }
        show(nav.dataset.nav);
        return;
    }
    const catLink = e.target.closest("[data-catlink]");
    if (catLink) {
        e.preventDefault();
        $("#categoryFilter").value = catLink.dataset.catlink;
        query = "";
        $("#q").value = "";
        shopPage = 1;
        renderShop();
        show("shop");
        return;
    }
    const nl = e.target.closest("[data-navlink]");
    if (nl) {
        const k = nl.dataset.navlink;
        if (k === "home") show("home");
        if (k === "shop") { shopPage = 1; renderShop(); show("shop"); }
        if (k === "cart") { renderCart(); $("#cartDrawer").hidden = false; }
        if (k === "orders") { await loadMyOrders(); renderOrders(); show("orders"); }
        if (k === "admin") { await loadAdminData(); renderAdmin(); show("admin"); }
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
        const b = adminBooks.find(x => x.id === Number(bact.dataset.id));
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
                try {
                    await api("/books/" + b.id, { method: "DELETE" });
                    delete cart[b.id];
                    saveCart();
                    await loadCatalog();
                    await loadAdminData();
                    renderAll();
                    toast("Đã xóa sách.");
                } catch (err) { toast(err.message); }
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
            if (confirm(`Xóa danh mục "${name}"?`)) {
                try {
                    await api("/categories/" + encodeURIComponent(name), { method: "DELETE" });
                    await loadCatalog();
                    await loadAdminData();
                    renderAll();
                    toast("Đã xóa danh mục.");
                } catch (err) { toast(err.message); }
            }
        }
        return;
    }
    const rvBtn = e.target.closest("[data-rvsubmit]");
    if (rvBtn) {
        const b = bookById(rvBtn.dataset.id);
        const text = $("#rvText").value.trim();
        if (!text) { toast("Bạn chưa nhập nhận xét."); return; }
        try {
            await api("/books/" + b.id + "/reviews", { method: "POST", body: { rating: Number($("#rvRating").value), text: text } });
            renderBookSocial(b);
            toast("Đã gửi đánh giá. Cảm ơn bạn!");
        } catch (err) { toast(err.message); }
        return;
    }
    const cmBtn = e.target.closest("[data-cmsubmit]");
    if (cmBtn) {
        const b = bookById(cmBtn.dataset.id);
        const text = $("#cmText").value.trim();
        if (!text) { toast("Bạn chưa nhập bình luận."); return; }
        try {
            await api("/books/" + b.id + "/comments", { method: "POST", body: { text: text } });
            renderBookSocial(b);
            toast("Đã gửi bình luận.");
        } catch (err) { toast(err.message); }
        return;
    }
    const aact = e.target.closest("[data-aact]");
    if (aact) {
        const b = adminBooks.find(x => x.id === Number(aact.dataset.id));
        if (!b) return;
        try {
            if (aact.dataset.aact === "ok") {
                await api("/books/" + b.id + "/approve", { method: "POST" });
                await loadCatalog();
                await loadAdminData();
                renderAll();
                toast(`Đã duyệt bán sách "${b.title}".`);
            }
            if (aact.dataset.aact === "no") {
                if (confirm(`Từ chối và xóa sách "${b.title}" khỏi danh sách đăng bán?`)) {
                    await api("/books/" + b.id + "/reject", { method: "POST" });
                    await loadCatalog();
                    await loadAdminData();
                    renderAll();
                    toast("Đã từ chối sách.");
                }
            }
        } catch (err) { toast(err.message); }
        return;
    }
    const uact = e.target.closest("[data-uact]");
    if (uact) {
        const u = adminUsers.find(x => x.email === uact.dataset.email);
        if (!u || u.role === "admin") return;
        try {
            await api("/admin/users/" + encodeURIComponent(u.email) + "/lock", { method: "PATCH", body: { locked: !u.locked } });
            await loadAdminData();
            renderAdmin();
            toast(!u.locked ? `Đã khóa tài khoản ${u.email}.` : `Đã mở khóa tài khoản ${u.email}.`);
        } catch (err) { toast(err.message); }
        return;
    }
    const pact = e.target.closest("[data-pact]");
    if (pact) {
        const p = adminPromos.find(x => x.code === pact.dataset.code);
        if (!p) return;
        try {
            if (pact.dataset.pact === "toggle") {
                await api("/admin/promos/" + encodeURIComponent(p.code), { method: "PUT", body: { active: !p.active } });
                await loadAdminData();
                renderAdmin();
            }
            if (pact.dataset.pact === "del") {
                if (confirm(`Xóa mã giảm giá "${p.code}"?`)) {
                    await api("/admin/promos/" + encodeURIComponent(p.code), { method: "DELETE" });
                    await loadAdminData();
                    renderAdmin();
                    toast("Đã xóa mã giảm giá.");
                }
            }
        } catch (err) { toast(err.message); }
        if (pact.dataset.pact === "edit") {
            $("#pOld").value = p.code;
            $("#pCode").value = p.code;
            $("#pPct").value = p.pct;
            $("#pCancel").hidden = false;
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
    }
    const tab = e.target.closest(".tab[data-tab]");
    if (tab) {
        $$(".tab[data-tab]").forEach(t => t.classList.toggle("active", t === tab));
        ["books", "approve", "cats", "users", "orders", "promos", "sys"].forEach(k => { $("#tab-" + k).hidden = k !== tab.dataset.tab; });
        return;
    }
});

document.addEventListener("change", async e => {
    const sel = e.target.closest("[data-ostatus]");
    if (sel) {
        try {
            const o = await api("/admin/orders/" + sel.dataset.ostatus + "/status", { method: "PATCH", body: { status: sel.value } });
            await loadAdminData();
            renderAdmin();
            await loadMyOrders();
            toast(`Đã cập nhật trạng thái đơn ${o.id}: ${o.status}.`);
        } catch (err) { toast(err.message); }
    }
});

$("#promoForm").addEventListener("submit", async e => {
    e.preventDefault();
    const code = $("#pCode").value.trim().toUpperCase();
    const pct = Number($("#pPct").value);
    const old = $("#pOld").value;
    if (!code || !(pct >= 1 && pct <= 90)) { toast("Mã hoặc mức giảm chưa hợp lệ (1-90%)."); return; }
    if (old && code !== old) { toast("Không đổi được tên mã. Hãy xóa mã cũ và tạo mã mới."); return; }
    try {
        if (old) { await api("/admin/promos/" + encodeURIComponent(old), { method: "PUT", body: { pct: pct } }); toast("Đã cập nhật mã giảm giá."); }
        else { await api("/admin/promos", { method: "POST", body: { code: code, pct: pct } }); toast("Đã tạo mã giảm giá " + code + "."); }
        $("#pOld").value = ""; $("#pCode").value = ""; $("#pPct").value = "";
        $("#pCancel").hidden = true;
        await loadAdminData();
        renderAdmin();
    } catch (err) { toast(err.message); }
});
$("#pCancel").onclick = () => {
    $("#pOld").value = ""; $("#pCode").value = ""; $("#pPct").value = "";
    $("#pCancel").hidden = true;
};

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
    const total = checkoutTotals().total;
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
$("#btnPromo").onclick = async () => {
    const code = $("#promoCode").value.trim().toUpperCase();
    if (!code) { $("#promoMsg").textContent = ""; return; }
    try {
        const r = await api("/promos/validate", { method: "POST", body: { code: code, sub: cartSubtotal() } });
        if (!r.valid) {
            appliedPromo = null;
            $("#promoMsg").textContent = "Mã giảm giá không hợp lệ hoặc đã hết hiệu lực.";
        } else {
            appliedPromo = { code: r.code, pct: r.pct };
            $("#promoMsg").textContent = "Đã áp dụng mã " + r.code + ": giảm " + r.pct + "% trên tạm tính.";
        }
    } catch (e) {
        $("#promoMsg").textContent = "Không kiểm tra được mã giảm giá.";
    }
    renderCheckout();
    updatePayUI();
};
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

$("#loginForm").addEventListener("submit", async e => {
    e.preventDefault();
    try {
        const r = await api("/auth/login", { method: "POST", body: { email: $("#liEmail").value.trim(), pass: $("#liPass").value } });
        setSession(r.token, r.user);
        $("#authModal").hidden = true;
        renderNavbar();
        toast("Xin chào " + session.name + "!");
        if (session.role === "admin") { await loadAdminData(); renderAdmin(); show("admin"); }
    } catch (err) { toast(err.message); }
});

$("#regForm").addEventListener("submit", async e => {
    e.preventDefault();
    try {
        const r = await api("/auth/register", { method: "POST", body: { name: $("#rgName").value.trim(), email: $("#rgEmail").value.trim(), pass: $("#rgPass").value } });
        setSession(r.token, r.user);
        $("#authModal").hidden = true;
        renderNavbar();
        toast("Đăng ký thành công. Xin chào " + session.name + "!");
    } catch (err) { toast(err.message); }
});

$("#bookForm").addEventListener("submit", async e => {
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
    const id = $("#bId").value;
    try {
        if (id) { await api("/books/" + id, { method: "PUT", body: data }); }
        else { await api("/books", { method: "POST", body: data }); }
        await loadCatalog();
        await loadAdminData();
        resetBookForm();
        renderAll();
        toast(id ? "Đã cập nhật sách." : "Đã đăng bán sách mới. Sách sẽ hiển thị sau khi được kiểm duyệt.");
    } catch (err) { toast(err.message); }
});
$("#bCancel").onclick = resetBookForm;

$("#catForm").addEventListener("submit", async e => {
    e.preventDefault();
    const name = $("#cName").value.trim();
    const old = $("#cOld").value;
    if (!name) return;
    try {
        if (old) { await api("/categories/" + encodeURIComponent(old), { method: "PUT", body: { name: name } }); }
        else { await api("/categories", { method: "POST", body: { name: name } }); }
        await loadCatalog();
        await loadAdminData();
        $("#cOld").value = "";
        $("#cName").value = "";
        $("#cCancel").hidden = true;
        renderAll();
        toast(old ? "Đã sửa danh mục." : "Đã thêm danh mục.");
    } catch (err) { toast(err.message); }
});
$("#cCancel").onclick = () => {
    $("#cOld").value = "";
    $("#cName").value = "";
    $("#cCancel").hidden = true;
};

$("#btnReset").onclick = async () => {
    if (!confirm("Khôi phục toàn bộ dữ liệu về trạng thái gốc? Sách, danh mục, tài khoản tự đăng ký và đơn hàng sẽ bị đặt lại.")) return;
    try { await api("/admin/reset", { method: "POST" }); } catch (e) { toast(e.message); return; }
    setSession(null, null);
    adminBooks = [];
    adminUsers = [];
    adminOrders = [];
    adminPromos = [];
    adminStats = null;
    myOrdersCache = [];
    localStorage.removeItem(CART_KEY);
    cart = {};
    appliedPromo = null;
    await loadCatalog();
    resetBookForm();
    renderAll();
    toast("Đã khôi phục dữ liệu gốc. Vui lòng đăng nhập lại.");
    show("home");
};

(async function init() {
    try {
        await loadCatalog();
    } catch (e) {
        toast("Không kết nối được máy chủ. Hãy chắc chắn backend đang chạy (npm start).");
    }
    if (token && session) {
        try {
            const me = await api("/auth/me");
            session = me.user;
            localStorage.setItem(USER_KEY, JSON.stringify(session));
            if (session.role === "admin") await loadAdminData();
        } catch (e) {
            setSession(null, null);
        }
    }
    renderAll();
})();
