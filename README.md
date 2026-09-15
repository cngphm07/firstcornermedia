# FIRST CORNER MEDIA — Portfolio Website

Website showcase nhiếp ảnh & phim kiến trúc, phong cách **minimalism**: nền trắng, chữ mảnh đen, hover điểm nhấn màu cam.

Được tối ưu để không lưu trữ tài nguyên ảnh nặng cục bộ, thay vào đó toàn bộ hình ảnh và video được kéo tự động thông qua CDN Proxy (`wsrv.nl`) từ Google Drive, giúp mã nguồn siêu nhẹ và hoàn toàn miễn phí khi host trên GitHub Pages.

## Cấu trúc thư mục

```text
index.html          — Trang chính (SPA nhẹ, không cần build)
css/style.css       — Toàn bộ styling CSS
js/app.js           — File logic giao diện chính (filters, modal, lightbox, v.v.)
js/data.js          — File chứa dữ liệu JSON của toàn bộ website (TỰ SINH, không sửa tay)
tools/              — Chứa các script Python để crawl ảnh/video từ Google Drive
manifest.json       — Dữ liệu thô từ Google Drive (TỰ SINH)
cache/              — Thư mục lưu cache kết quả crawl của script Python
```

## Chạy thử ở máy tính (Local)

Mở terminal tại thư mục dự án và chạy server:
```bash
python -m http.server 8000
```
Sau đó truy cập trình duyệt: `http://localhost:8000`

## Cách cập nhật nội dung (khi có ảnh/video mới trên Drive)

**1. Tự động hóa hoàn toàn (Đã thiết lập sẵn):**
Hệ thống đã được tích hợp luồng GitHub Actions (`.github/workflows/update-drive.yml`). Cứ mỗi **30 phút**, robot của GitHub sẽ tự động quét Drive của bạn và cập nhật website lên phiên bản mới nhất nếu có ảnh/video mới được thêm vào. Bạn không cần làm gì thêm!
Bạn cũng có thể vào tab **Actions** trên GitHub, chọn "Sync Google Drive" và bấm **Run workflow** để ép nó cập nhật ngay lập tức.

**2. Nếu bạn muốn cập nhật thủ công ở máy tính:**
Mở Terminal tại dự án và chạy:

```bash
python tools/enumerate.py       # Quét Drive để lấy danh sách file mới
python tools/build_data.py      # Sinh lại js/data.js để website hiển thị
```

## Cách Deploy lên GitHub Pages

1. Đăng nhập GitHub và tạo một repository mới (ví dụ: `kham-media.github.io` hoặc `khammedia`).
2. Mở Terminal tại dự án và gõ các lệnh sau:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPONAME.git
   git push -u origin main
   ```
3. Lên giao diện GitHub > Settings > Pages. Ở phần **Build and deployment**, mục **Source** chọn "Deploy from a branch", và nhánh (branch) chọn `main`. Bấm Save.
4. Chờ 1-2 phút, GitHub sẽ cấp cho bạn một đường link website có dạng `https://username.github.io/reponame`. Trang web của bạn đã online!

## Lưu ý

- Video phim được stream trực tiếp từ Google Drive qua iframe preview (`drive.google.com/file/d/<id>/preview`). Do đó thư mục chứa video trên Google Drive **bắt buộc phải được Share (Anyone with the link)** để video có thể phát được.
- Hình ảnh cũng vậy, Google Drive folder chứa ảnh phải được mở Share public.
- Bạn có thể đổi tên hiển thị của các dự án hoặc video thông qua biến `RENAME` hoặc `TITLE_MAP` bên trong script `tools/build_data.py`.
