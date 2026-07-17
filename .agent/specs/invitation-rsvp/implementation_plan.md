# Implementation Plan — Thiệp mời tốt nghiệp

## Mục tiêu

Khởi tạo một Next.js App Router app mobile-first, triển khai luồng thiệp mời và RSVP Google Sheet, có Docker build gate và sẵn sàng deploy Vercel tại `totnghiep.vanhbe.io.vn`.

## Blast Radius

- **Mức:** lớn — repository chuyển từ tài liệu sang ứng dụng deployable.
- **Phạm vi:** app source, public assets, API route, Apps Script, Docker, ENV docs, SEO/GEO và deployment docs.
- **Không tác động:** dữ liệu Sheet hiện có; local test dùng dry-run và không append dòng.

## Thứ tự triển khai

1. Cập nhật governance cho Vercel exception đã được người dùng yêu cầu.
2. Khởi tạo Next.js/Tailwind/TypeScript với dependency versions đã xác minh.
3. Xây design tokens và mobile app shell.
4. Xây intro input và invitation content không 3D.
5. Tích hợp API route → Apps Script, error/retry và local dry-run.
6. Thêm SEO/GEO, Docker và deployment documentation.
7. Chạy Docker lint/build/runtime, sau đó browser test ở ba mobile widths.
8. Commit/push `main`; kiểm tra domain nếu Vercel project đã kết nối.

## Rollback

- Revert commit feature để trở về repository tài liệu-only.
- Apps Script và Sheet không bị thay đổi tự động; `Code.gs` chỉ là file hướng dẫn cho người dùng copy/deploy.
- `.env` không được commit, nên endpoint local không đi vào lịch sử Git.

## Deviation rules

- Nếu dependency mới không cần thiết, loại bỏ thay vì thêm workaround.
- Nếu Apps Script hiện có không khớp contract, giữ route và cung cấp `Code.gs` chuẩn; không ghi thử vào Sheet.
- Nếu Vercel/DNS cần đăng nhập hoặc quyền domain, dừng ở trạng thái code deployable và báo đúng bước handoff.
