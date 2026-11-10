import os
from xml.sax.saxutils import escape

BOOKS = [
    (1, "Số Đỏ", "Vũ Trọng Phụng", "Văn học", "#7d3c98"),
    (2, "Chí Phèo", "Nam Cao", "Văn học", "#935116"),
    (3, "Tắt Đèn", "Ngô Tất Tố", "Văn học", "#616a6b"),
    (4, "Mắt Biếc", "Nguyễn Nhật Ánh", "Văn học", "#2e86c1"),
    (5, "Cho Tôi Xin Một Vé Đi Tuổi Thơ", "Nguyễn Nhật Ánh", "Văn học", "#148f77"),
    (6, "Nhà Giả Kim", "Paulo Coelho", "Văn học", "#b7950b"),
    (7, "Đắc Nhân Tâm", "Dale Carnegie", "Kỹ năng sống", "#a93226"),
    (8, "Tuổi Trẻ Đáng Giá Bao Nhiêu", "Rosie Nguyễn", "Kỹ năng sống", "#ca6f1e"),
    (9, "Cà Phê Cùng Tony", "Tony Buổi Sáng", "Kỹ năng sống", "#6e5100"),
    (10, "Tôi Tự Học", "Nguyễn Duy Cần", "Kỹ năng sống", "#1a5276"),
    (11, "Cha Giàu Cha Nghèo", "Robert T. Kiyosaki", "Kinh tế", "#145a32"),
    (12, "Người Giàu Có Nhất Thành Babylon", "George S. Clason", "Kinh tế", "#9a7d0a"),
    (13, "Tư Duy Nhanh Và Chậm", "Daniel Kahneman", "Kinh tế", "#4d5656"),
    (14, "Muôn Kiếp Nhân Sinh", "Nguyên Phong", "Kỹ năng sống", "#6c3483"),
    (15, "Sapiens: Lược Sử Loài Người", "Yuval Noah Harari", "Khoa học – Lịch sử", "#784212"),
    (16, "Dế Mèn Phiêu Lưu Ký", "Tô Hoài", "Thiếu nhi", "#1e8449"),
    (17, "Harry Potter Và Hòn Đá Phù Thủy", "J.K. Rowling", "Thiếu nhi", "#7b241c"),
    (18, "Sherlock Holmes Toàn Tập", "Arthur Conan Doyle", "Trinh thám", "#212f3c"),
    (19, "Doraemon Truyện Dài Tập 1", "Fujiko F. Fujio", "Truyện tranh", "#2471a3"),
    (20, "Thám Tử Lừng Danh Conan Tập 100", "Gosho Aoyama", "Truyện tranh", "#922b21"),
    (21, "One Piece Tập 105", "Eiichiro Oda", "Truyện tranh", "#b03a2e"),
]

PUBLISHER = {
    "Văn học": "NXB VĂN HỌC",
    "Kỹ năng sống": "NXB TRẺ",
    "Kinh tế": "NXB TRẺ",
    "Thiếu nhi": "NXB KIM ĐỒNG",
    "Truyện tranh": "NXB KIM ĐỒNG",
    "Khoa học – Lịch sử": "NXB TRI THỨC",
    "Trinh thám": "NXB VĂN HỌC",
}
PUBLISHER_OVERRIDE = {4: "NXB TRẺ", 5: "NXB TRẺ", 17: "NXB TRẺ"}

SERIF = "Georgia, 'Times New Roman', serif"
SANS = "'Segoe UI', Arial, sans-serif"
GOLD = "#d9b45c"


def shade(hex_color, factor):
    h = hex_color.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    r, g, b = (max(0, min(255, round(c * factor))) for c in (r, g, b))
    return f"#{r:02x}{g:02x}{b:02x}"


def wrap_title(title, font_size, max_width=492):
    words = title.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if len(trial) * font_size * 0.54 <= max_width or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def title_layout(title):
    for size in (57, 51, 45, 39):
        lines = wrap_title(title, size)
        if len(lines) <= 3:
            return size, lines
    return 39, wrap_title(title, 39)


def motif(cat, cx=300):
    s = 'stroke="#ffffff" stroke-opacity="0.55" fill="none" stroke-width="3" stroke-linecap="round"'
    if cat == "Văn học":
        return (f'<g {s}><circle cx="{cx}" cy="252" r="26"/><path d="M{cx-78} 252 A78 78 0 0 1 {cx+78} 252"/>'
                f'<path d="M{cx-118} 252 A118 118 0 0 1 {cx+118} 252" stroke-opacity="0.3"/>'
                f'<path d="M190 282 H410" stroke-opacity="0.35"/><path d="M222 304 H378" stroke-opacity="0.2"/></g>')
    if cat == "Kinh tế":
        bars = "".join(f'<rect x="{218 + i * 44}" y="{268 - h}" width="26" height="{h}" fill="#ffffff" fill-opacity="0.35" stroke="none"/>' for i, h in enumerate((34, 56, 82, 116)))
        return (f'<g>{bars}<path d="M206 236 L286 208 L352 218 L420 168" {s}/>'
                f'<path d="M398 166 L422 164 L420 188" {s}/><path d="M196 282 H424" stroke="#ffffff" stroke-opacity="0.3" fill="none" stroke-width="3" stroke-linecap="round"/></g>')
    if cat == "Kỹ năng sống":
        return (f'<g {s}><circle cx="{cx}" cy="238" r="24"/><circle cx="{cx}" cy="238" r="52" stroke-opacity="0.4"/>'
                f'<circle cx="{cx}" cy="238" r="80" stroke-opacity="0.25"/><circle cx="{cx}" cy="238" r="5" fill="#ffffff" stroke="none" fill-opacity="0.8"/></g>')
    if cat == "Thiếu nhi":
        star = lambda x, y, r, o: f'<path d="M{x} {y-r} L{x+r*0.28} {y-r*0.28} L{x+r} {y} L{x+r*0.28} {y+r*0.28} L{x} {y+r} L{x-r*0.28} {y+r*0.28} L{x-r} {y} L{x-r*0.28} {y-r*0.28} Z" fill="#ffffff" fill-opacity="{o}" stroke="none"/>'
        return ("<g>" + star(238, 210, 17, .75) + star(330, 178, 12, .5) + star(356, 252, 14, .6) + star(268, 276, 10, .4)
                + f'<circle cx="300" cy="222" r="4" fill="#fff" fill-opacity=".5"/><circle cx="212" cy="256" r="3" fill="#fff" fill-opacity=".4"/></g>')
    if cat == "Truyện tranh":
        dots = ""
        for r_i in range(4):
            for c_i in range(5):
                dots += f'<circle cx="{196 + c_i * 30}" cy="{176 + r_i * 30}" r="{8 - r_i}" fill="#ffffff" fill-opacity="0.30"/>'
        lines = "".join(f'<path d="M{352 + i * 18} 292 L{392 + i * 18} 168" stroke="#ffffff" stroke-opacity="0.4" stroke-width="4" stroke-linecap="round"/>' for i in range(3))
        return f"<g>{dots}{lines}</g>"
    if cat == "Khoa học – Lịch sử":
        return (f'<g {s}><circle cx="{cx}" cy="232" r="30"/><ellipse cx="{cx}" cy="232" rx="104" ry="34" transform="rotate(-18 {cx} 232)" stroke-opacity="0.45"/>'
                f'<ellipse cx="{cx}" cy="232" rx="104" ry="34" transform="rotate(24 {cx} 232)" stroke-opacity="0.28"/>'
                f'<circle cx="{cx + 88}" cy="176" r="4" fill="#ffffff" stroke="none" fill-opacity="0.8"/></g>')
    return (f'<g stroke="#ffffff" fill="none" stroke-linecap="round"><circle cx="282" cy="222" r="52" stroke-opacity="0.6" stroke-width="4"/>'
            f'<path d="M322 262 L386 326" stroke-opacity="0.6" stroke-width="11"/>'
            f'<circle cx="282" cy="210" r="13" fill="#ffffff" fill-opacity="0.65" stroke="none"/><path d="M282 220 L282 248" stroke-opacity="0.65" stroke-width="7"/></g>')


def cover_svg(book):
    bid, title, author, cat, color = book
    light = shade(color, 1.22)
    dark = shade(color, 0.55)
    size, lines = title_layout(title)
    line_h = round(size * 1.22)
    start_y = 448 - (len(lines) - 1) * line_h // 2
    tspans = "".join(f'<tspan x="300" dy="{0 if i == 0 else line_h}">{escape(l)}</tspan>' for i, l in enumerate(lines))
    pub = PUBLISHER_OVERRIDE.get(bid, PUBLISHER[cat])
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" role="img" aria-label="Bìa sách {escape(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.85" y2="1">
      <stop offset="0" stop-color="{light}"/>
      <stop offset="0.55" stop-color="{color}"/>
      <stop offset="1" stop-color="{dark}"/>
    </linearGradient>
    <linearGradient id="spine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity="0.34"/>
      <stop offset="0.06" stop-color="#fff" stop-opacity="0.14"/>
      <stop offset="0.12" stop-color="#000" stop-opacity="0.10"/>
      <stop offset="0.2" stop-color="#000" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="vig" cx="0.5" cy="0.42" r="0.95">
      <stop offset="0.62" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.26"/>
    </radialGradient>
  </defs>
  <rect width="600" height="900" fill="url(#bg)"/>
  <rect x="26" y="26" width="548" height="848" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="1.5"/>
  <text x="300" y="98" text-anchor="middle" font-family="{SANS}" font-size="19" letter-spacing="6" fill="#ffffff" fill-opacity="0.78">{escape(cat.upper())}</text>
  <path d="M252 122 H348" stroke="{GOLD}" stroke-width="2.5"/>
  {motif(cat)}
  <text y="{start_y}" text-anchor="middle" font-family="{SERIF}" font-weight="bold" font-size="{size}" fill="#ffffff">{tspans}</text>
  <path d="M264 668 H336" stroke="{GOLD}" stroke-width="2.5"/>
  <text x="300" y="716" text-anchor="middle" font-family="{SANS}" font-size="23" letter-spacing="3.5" fill="#ffffff" fill-opacity="0.94">{escape(author.upper())}</text>
  <text x="300" y="838" text-anchor="middle" font-family="{SANS}" font-size="16.5" letter-spacing="4" fill="#ffffff" fill-opacity="0.72">{pub}</text>
  <rect width="600" height="900" fill="url(#vig)"/>
  <rect width="600" height="900" fill="url(#spine)"/>
</svg>
'''


def main():
    out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "covers")
    os.makedirs(out_dir, exist_ok=True)
    for book in BOOKS:
        path = os.path.join(out_dir, f"book-{book[0]}.svg")
        with open(path, "w", encoding="utf-8") as f:
            f.write(cover_svg(book))
        print("wrote", path)


if __name__ == "__main__":
    main()
