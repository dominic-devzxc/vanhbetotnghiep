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
- Xác minh lại trên Production ngày 2026-07-17:
  - `POST https://totnghiep.vanhbe.io.vn/api/rsvp` với payload hợp lệ trả HTTP `502` và JSON `{"ok":false,"message":"Chưa gửi được phản hồi. Bạn thử lại nhé."}`.
  - GET Apps Script `/exec` sau khi theo redirect kết thúc tại `accounts.google.com/v3/signin/identifier`, Content-Type `text/html`.
  - Vì chưa vào được `doGet()`/`doPost()`, không có bản ghi test nào được ghi vào Sheet.
  - Đọc trực tiếp sheet `Trang tính1` qua Google Visualization CSV trả HTTP `200` nhưng nội dung rỗng, khớp với việc Apps Script chưa nhận được request.
  - Xác minh lại local ngày 2026-07-17: `POST http://localhost:8900/api/rsvp` với payload hợp lệ trả HTTP `502`; URL Apps Script tiếp tục redirect tới `accounts.google.com/ServiceLogin`. ENV local có đủ hai key cấu hình, nên lỗi không phải do thiếu biến môi trường.

## Nguyên nhân gốc

Deployment Apps Script đang yêu cầu đăng nhập Google, nên server Next.js không thể gọi ẩn danh. `response.json()` nhận HTML và ném lỗi; catch của route ánh xạ lỗi này thành HTTP 502.

## Xác minh sau khi đổi quyền deployment

- URL `/exec` version 2 hiện trả JSON từ `doGet()`, nên quyền public đã đúng.
- POST hợp lệ đi vào Apps Script nhưng trả JSON `{ "ok": false, "message": "Không thể lưu phản hồi" }`.
- Cần cấu hình rõ spreadsheet cho Web App độc lập: `getActiveSpreadsheet()` không đáng tin cậy khi script không được tạo từ **Tiện ích mở rộng → Apps Script** của chính Sheet.
- Bản script trong repository dùng `SPREADSHEET_ID` trong Script Properties và `SpreadsheetApp.openById()` để mở chính xác Sheet.

## Khắc phục bên Google Apps Script

1. Dán/cập nhật `google-apps-script/Code.gs` trong Apps Script gắn với Sheet.
2. Deploy > Manage deployments > Web app.
3. Execute as: Me.
4. Who has access: Anyone (không phải Anyone with Google account).
5. Deploy phiên bản mới và dùng URL `/exec` của deployment.
6. Cập nhật `GOOGLE_APPS_SCRIPT_URL` ở local/Vercel nếu URL thay đổi, rồi redeploy/restart.
7. GET URL phải trả JSON từ `doGet()` trước khi thử POST.
