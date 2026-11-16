const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { seedData, hashPass } = require("./seed");

const DATA_FILE = path.join(__dirname, "data.json");
const PORT = process.env.PORT || 3000;

let db;
function save() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}
function load() {
    try {
        db = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    } catch (e) {
        db = seedData();
        save();
    }
}
load();

const sessions = new Map();
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function publicUser(u) {
    return { name: u.name, email: u.email, role: u.role, locked: !!u.locked };
}
function authUser(req) {
    const h = req.headers.authorization || "";
    const token = h.startsWith("Bearer ") ? h.slice(7) : null;
    if (!token || !sessions.has(token)) return null;
    return db.users.find(u => u.email === sessions.get(token)) || null;
}
function needAuth(req, res, next) {
    const u = authUser(req);
    if (!u) return res.status(401).json({ error: "Bạn cần đăng nhập." });
    req.user = u;
    next();
}
function needAdmin(req, res, next) {
    const u = authUser(req);
    if (!u) return res.status(401).json({ error: "Bạn cần đăng nhập." });
    if (u.role !== "admin") return res.status(403).json({ error: "Chỉ quản trị viên mới có quyền này." });
    req.user = u;
    next();
}
function newToken(email) {
    const t = crypto.randomBytes(24).toString("hex");
    sessions.set(t, email);
    return t;
}

app.post("/api/auth/register", (req, res) => {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const pass = String(req.body.pass || "");
    if (!name || !email || pass.length < 6) return res.status(400).json({ error: "Thông tin đăng ký chưa hợp lệ (mật khẩu tối thiểu 6 ký tự)." });
    if (db.users.some(u => u.email === email)) return res.status(400).json({ error: "Email này đã được đăng ký." });
    const salt = crypto.randomBytes(16).toString("hex");
    const u = { name, email, salt, passHash: hashPass(pass, salt), role: "customer", locked: false };
    db.users.push(u);
    save();
    res.status(201).json({ token: newToken(email), user: publicUser(u) });
});

app.post("/api/auth/login", (req, res) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    const pass = String(req.body.pass || "");
    const u = db.users.find(x => x.email === email);
    if (!u || u.passHash !== hashPass(pass, u.salt)) return res.status(401).json({ error: "Email hoặc mật khẩu chưa đúng." });
    if (u.locked) return res.status(403).json({ error: "Tài khoản này đã bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ." });
    res.json({ token: newToken(email), user: publicUser(u) });
});

app.post("/api/auth/logout", needAuth, (req, res) => {
    const h = req.headers.authorization || "";
    sessions.delete(h.slice(7));
    res.json({ ok: true });
});

app.get("/api/auth/me", needAuth, (req, res) => {
    res.json({ user: publicUser(req.user) });
});

app.get("/api/books", (req, res) => {
    res.json(db.books.filter(b => b.status !== "pending"));
});

app.get("/api/books/:id", (req, res) => {
    const b = db.books.find(x => x.id === Number(req.params.id));
    if (!b) return res.status(404).json({ error: "Không tìm thấy sách." });
    const u = authUser(req);
    if (b.status === "pending" && (!u || u.role !== "admin")) return res.status(404).json({ error: "Không tìm thấy sách." });
    res.json(b);
});

function hasPurchased(email, bookId) {
    if (!email) return false;
    return db.orders.some(o => o.email === email && o.status !== "Đã hủy" && o.items.some(i => i.bookId === Number(bookId)));
}

app.get("/api/books/:id/social", (req, res) => {
    const id = Number(req.params.id);
    const u = authUser(req);
    res.json({
        reviews: db.reviews.filter(r => r.bookId === id),
        comments: db.comments.filter(c => c.bookId === id),
        canReview: u ? hasPurchased(u.email, id) : false,
        loggedIn: !!u
    });
});

app.post("/api/books/:id/reviews", needAuth, (req, res) => {
    const id = Number(req.params.id);
    const b = db.books.find(x => x.id === id);
    if (!b) return res.status(404).json({ error: "Không tìm thấy sách." });
    if (!hasPurchased(req.user.email, id)) return res.status(403).json({ error: "Bạn chỉ có thể đánh giá những cuốn sách đã mua." });
    const rating = Number(req.body.rating);
    const text = String(req.body.text || "").trim();
    if (!(rating >= 1 && rating <= 5) || !text) return res.status(400).json({ error: "Đánh giá chưa hợp lệ." });
    const r = { id: db.nextReview++, bookId: id, email: req.user.email, name: req.user.name, rating, text, date: new Date().toLocaleDateString("vi-VN") };
    db.reviews.push(r);
    save();
    res.status(201).json(r);
});

app.post("/api/books/:id/comments", needAuth, (req, res) => {
    const id = Number(req.params.id);
    const b = db.books.find(x => x.id === id);
    if (!b) return res.status(404).json({ error: "Không tìm thấy sách." });
    const text = String(req.body.text || "").trim();
    if (!text) return res.status(400).json({ error: "Bạn chưa nhập bình luận." });
    const c = { id: db.nextComment++, bookId: id, email: req.user.email, name: req.user.name, text, date: new Date().toLocaleDateString("vi-VN") };
    db.comments.push(c);
    save();
    res.status(201).json(c);
});

app.get("/api/categories", (req, res) => {
    res.json(db.cats);
});

app.post("/api/categories", needAdmin, (req, res) => {
    const name = String(req.body.name || "").trim();
    if (!name) return res.status(400).json({ error: "Tên danh mục trống." });
    if (db.cats.includes(name)) return res.status(400).json({ error: "Danh mục đã tồn tại." });
    db.cats.push(name);
    save();
    res.status(201).json({ name });
});

app.put("/api/categories/:name", needAdmin, (req, res) => {
    const old = decodeURIComponent(req.params.name);
    const name = String(req.body.name || "").trim();
    if (!db.cats.includes(old)) return res.status(404).json({ error: "Không tìm thấy danh mục." });
    if (!name || (db.cats.includes(name) && name !== old)) return res.status(400).json({ error: "Tên danh mục đã tồn tại." });
    db.cats = db.cats.map(c => (c === old ? name : c));
    db.books.forEach(b => { if (b.cat === old) b.cat = name; });
    save();
    res.json({ name });
});

app.delete("/api/categories/:name", needAdmin, (req, res) => {
    const name = decodeURIComponent(req.params.name);
    if (db.books.some(b => b.cat === name)) return res.status(400).json({ error: "Danh mục đang có sách, không thể xóa." });
    db.cats = db.cats.filter(c => c !== name);
    save();
    res.json({ ok: true });
});

app.get("/api/admin/books", needAdmin, (req, res) => {
    res.json(db.books);
});

app.post("/api/books", needAdmin, (req, res) => {
    const d = req.body || {};
    const b = {
        id: db.nextBook++,
        title: String(d.title || "").trim(),
        author: String(d.author || "").trim(),
        cat: String(d.cat || ""),
        price: Number(d.price) || 0,
        stock: Number(d.stock) || 0,
        sold: 0,
        isNew: !!d.isNew,
        pages: Number(d.pages) || 0,
        year: Number(d.year) || new Date().getFullYear(),
        rating: 4.5,
        color: String(d.color || "#b01e24"),
        desc: String(d.desc || "").trim(),
        cover: null,
        list: 0,
        status: "pending"
    };
    b.list = Math.round(b.price / 0.82 / 1000) * 1000;
    if (!b.title || !b.author || !b.cat || b.price < 1000) return res.status(400).json({ error: "Thông tin sách chưa hợp lệ." });
    db.books.push(b);
    save();
    res.status(201).json(b);
});

app.put("/api/books/:id", needAdmin, (req, res) => {
    const b = db.books.find(x => x.id === Number(req.params.id));
    if (!b) return res.status(404).json({ error: "Không tìm thấy sách." });
    const d = req.body || {};
    ["title", "author", "cat", "desc", "color"].forEach(k => { if (d[k] !== undefined) b[k] = String(d[k]); });
    ["price", "stock", "pages", "year"].forEach(k => { if (d[k] !== undefined) b[k] = Number(d[k]) || 0; });
    if (d.isNew !== undefined) b.isNew = !!d.isNew;
    b.list = Math.round(b.price / 0.82 / 1000) * 1000;
    save();
    res.json(b);
});

app.delete("/api/books/:id", needAdmin, (req, res) => {
    const id = Number(req.params.id);
    db.books = db.books.filter(b => b.id !== id);
    save();
    res.json({ ok: true });
});

app.post("/api/books/:id/approve", needAdmin, (req, res) => {
    const b = db.books.find(x => x.id === Number(req.params.id));
    if (!b) return res.status(404).json({ error: "Không tìm thấy sách." });
    b.status = "approved";
    save();
    res.json(b);
});

app.post("/api/books/:id/reject", needAdmin, (req, res) => {
    const id = Number(req.params.id);
    db.books = db.books.filter(b => b.id !== id);
    save();
    res.json({ ok: true });
});

app.get("/api/admin/users", needAdmin, (req, res) => {
    res.json(db.users.map(publicUser));
});

app.patch("/api/admin/users/:email/lock", needAdmin, (req, res) => {
    const u = db.users.find(x => x.email === decodeURIComponent(req.params.email));
    if (!u) return res.status(404).json({ error: "Không tìm thấy người dùng." });
    if (u.role === "admin") return res.status(400).json({ error: "Không thể khóa tài khoản quản trị viên." });
    u.locked = !!req.body.locked;
    save();
    res.json(publicUser(u));
});

app.post("/api/promos/validate", (req, res) => {
    const code = String(req.body.code || "").trim().toUpperCase();
    const sub = Number(req.body.sub) || 0;
    const p = db.promos.find(x => x.code === code);
    if (!p || !p.active) return res.json({ valid: false });
    res.json({ valid: true, code: p.code, pct: p.pct, discount: Math.round(sub * p.pct / 100) });
});

app.get("/api/admin/promos", needAdmin, (req, res) => {
    res.json(db.promos);
});

app.post("/api/admin/promos", needAdmin, (req, res) => {
    const code = String(req.body.code || "").trim().toUpperCase();
    const pct = Number(req.body.pct);
    if (!code || !(pct >= 1 && pct <= 90)) return res.status(400).json({ error: "Mã hoặc mức giảm chưa hợp lệ (1-90%)." });
    if (db.promos.some(x => x.code === code)) return res.status(400).json({ error: "Mã này đã tồn tại." });
    const p = { code, pct, active: true };
    db.promos.push(p);
    save();
    res.status(201).json(p);
});

app.put("/api/admin/promos/:code", needAdmin, (req, res) => {
    const p = db.promos.find(x => x.code === decodeURIComponent(req.params.code));
    if (!p) return res.status(404).json({ error: "Không tìm thấy mã giảm giá." });
    if (req.body.pct !== undefined) {
        const pct = Number(req.body.pct);
        if (!(pct >= 1 && pct <= 90)) return res.status(400).json({ error: "Mức giảm chưa hợp lệ (1-90%)." });
        p.pct = pct;
    }
    if (req.body.active !== undefined) p.active = !!req.body.active;
    save();
    res.json(p);
});

app.delete("/api/admin/promos/:code", needAdmin, (req, res) => {
    const code = decodeURIComponent(req.params.code);
    db.promos = db.promos.filter(x => x.code !== code);
    save();
    res.json({ ok: true });
});

app.post("/api/orders", (req, res) => {
    const u = authUser(req);
    const d = req.body || {};
    const items = Array.isArray(d.items) ? d.items : [];
    if (!items.length) return res.status(400).json({ error: "Giỏ hàng đang trống." });
    const name = String(d.name || "").trim();
    const phone = String(d.phone || "").trim();
    const addr = String(d.addr || "").trim();
    const pay = ["COD", "MoMo", "ZaloPay"].includes(d.pay) ? d.pay : "COD";
    if (!name || !phone || !addr) return res.status(400).json({ error: "Thiếu thông tin giao hàng." });
    let sub = 0;
    const lines = [];
    for (const it of items) {
        const b = db.books.find(x => x.id === Number(it.bookId));
        if (!b || b.status === "pending") return res.status(400).json({ error: "Có sách không hợp lệ trong giỏ hàng." });
        const qty = Number(it.qty) || 0;
        if (qty < 1 || qty > b.stock) return res.status(400).json({ error: `Sách "${b.title}" chỉ còn ${b.stock} cuốn trong kho.` });
        sub += b.price * qty;
        lines.push({ bookId: b.id, title: b.title, price: b.price, qty });
    }
    let discount = 0;
    let promoCode = "";
    if (d.promo) {
        const p = db.promos.find(x => x.code === String(d.promo).trim().toUpperCase() && x.active);
        if (p) {
            discount = Math.round(sub * p.pct / 100);
            promoCode = p.code;
        }
    }
    const ship = sub >= 200000 ? 0 : 25000;
    const order = {
        id: "DH" + String(db.nextOrder).padStart(4, "0"),
        date: new Date().toLocaleString("vi-VN"),
        email: u ? u.email : "",
        name, phone, addr,
        items: lines,
        total: sub - discount + ship,
        pay,
        status: pay === "COD" ? "Đang xử lý" : "Đã thanh toán (" + pay + ")",
        promo: promoCode,
        discount
    };
    lines.forEach(l => {
        const b = db.books.find(x => x.id === l.bookId);
        b.stock -= l.qty;
        b.sold += l.qty;
    });
    db.nextOrder++;
    db.orders.push(order);
    save();
    res.status(201).json(order);
});

app.get("/api/orders/mine", needAuth, (req, res) => {
    res.json(db.orders.filter(o => o.email === req.user.email));
});

app.get("/api/orders/lookup", (req, res) => {
    const phone = String(req.query.phone || "").trim();
    if (!phone) return res.json([]);
    res.json(db.orders.filter(o => o.phone === phone));
});

app.get("/api/admin/orders", needAdmin, (req, res) => {
    res.json(db.orders);
});

app.patch("/api/admin/orders/:id/status", needAdmin, (req, res) => {
    const o = db.orders.find(x => x.id === req.params.id);
    if (!o) return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
    o.status = String(req.body.status || o.status);
    save();
    res.json(o);
});

app.get("/api/admin/stats", needAdmin, (req, res) => {
    res.json({
        users: db.users.length,
        books: db.books.length,
        orders: db.orders.length,
        revenue: db.orders.filter(o => o.status !== "Đã hủy").reduce((s, o) => s + o.total, 0)
    });
});

app.post("/api/admin/reset", needAdmin, (req, res) => {
    db = seedData();
    sessions.clear();
    save();
    res.json({ ok: true });
});

app.listen(PORT, () => {
    console.log("Nha sach Tien Tho dang chay tai http://localhost:" + PORT);
});
