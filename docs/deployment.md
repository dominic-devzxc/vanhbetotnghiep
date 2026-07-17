# Deploy Vercel và Google Sheet RSVP

## 1. Cài Apps Script vào Google Sheet

1. Mở Google Sheet **Vanhbe Tốt nghiệp**.
2. Chọn **Tiện ích mở rộng → Apps Script**.
3. Dán nội dung từ `google-apps-script/Code.gs`, lưu project.
4. Chọn **Triển khai → Trang web**, chạy với quyền chủ sở hữu Sheet và cho phép bất kỳ ai có link truy cập.
5. Sao chép URL kết thúc bằng `/exec`.

Script sẽ tạo header nếu Sheet đang trống và ghi ba cột: `Thời gian gửi`, `Tên khách mời`, `Tham dự`.

## 2. Cấu hình Vercel

1. Import repository GitHub `dominic-devzxc/vanhbetotnghiep` trên Vercel.
2. Giữ Framework Preset là **Next.js** và Production Branch là `main`.
3. Tại **Settings → Environment Variables**, tạo:

| Biến | Production value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://totnghiep.vanhbe.io.vn` |
| `GOOGLE_APPS_SCRIPT_URL` | URL `/exec` từ Apps Script |
| `RSVP_DRY_RUN` | `false` |

4. Deploy project. Vercel tự nhận diện Next.js, không cần `vercel.json`.

## 3. Gắn domain

1. Mở **Project → Settings → Domains** và thêm `totnghiep.vanhbe.io.vn`.
2. Vercel sẽ hiển thị một giá trị CNAME riêng cho project.
3. Ở DNS provider của `vanhbe.io.vn`, tạo record:

| Type | Host | Value |
|---|---|---|
| `CNAME` | `totnghiep` | Sao chép chính xác giá trị Vercel hiển thị |

4. Chờ Vercel xác minh DNS và cấp SSL. Không dùng một CNAME đoán sẵn vì Vercel có thể cấp giá trị riêng cho project.

## 4. Checklist sau deploy

- Mở `https://totnghiep.vanhbe.io.vn?to=Tên%20khách` trên điện thoại.
- Nhập tên, mở thư và gửi một RSVP thật.
- Xác nhận Google Sheet có tên, `Có`/`Không` và thời gian gửi.
- Kiểm tra `/robots.txt`, `/sitemap.xml`, `/llms.txt`.
