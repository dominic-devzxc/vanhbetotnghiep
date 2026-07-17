# Debug: RSVP trả 502 từ Google Apps Script

## Hiện tượng

- Mong đợi: `POST /api/rsvp` chuyển dữ liệu sang Apps Script và nhận JSON `{ "ok": true }`.
- Thực tế: browser nhận `502 Bad Gateway` từ `/api/rsvp`.
- Tái hiện: nhập tên, chọn tham dự hoặc không, gửi phản hồi.

## Kiểm tra

- Route Next.js có `GOOGLE_APPS_SCRIPT_URL` trong container và `RSVP_DRY_RUN` không bật.
- Route chỉ trả 502 khi fetch Apps Script lỗi, timeout, trả HTTP lỗi hoặc không trả JSON `{ok:true}`.
- Gọi GET trực tiếp tới deployment URL từ container trả:
  - HTTP: `200`
  - Content-Type: `text/html; charset=utf-8`
  - Nội dung bắt đầu bằng trang đăng nhập `accounts.google.com`.

## Nguyên nhân gốc

Deployment Apps Script đang yêu cầu đăng nhập Google, nên server Next.js không thể gọi ẩn danh. `response.json()` nhận HTML và ném lỗi; catch của route ánh xạ lỗi này thành HTTP 502.

## Khắc phục bên Google Apps Script

1. Dán/cập nhật `google-apps-script/Code.gs` trong Apps Script gắn với Sheet.
2. Deploy > Manage deployments > Web app.
3. Execute as: Me.
4. Who has access: Anyone (không phải Anyone with Google account).
5. Deploy phiên bản mới và dùng URL `/exec` của deployment.
6. Cập nhật `GOOGLE_APPS_SCRIPT_URL` ở local/Vercel nếu URL thay đổi, rồi redeploy/restart.
7. GET URL phải trả JSON từ `doGet()` trước khi thử POST.
