# Research — Thiệp mời và RSVP

Ngày: 2026-07-17

## Kết luận kỹ thuật

- Next.js App Router hiện yêu cầu Node.js ≥20.9 và hỗ trợ TypeScript, Tailwind CSS, App Router theo cấu hình mặc định chính thức.
- Tailwind CSS hiện dùng `tailwindcss` và `@tailwindcss/postcss`, import bằng `@import "tailwindcss"`.
- Vercel hỗ trợ Next.js zero-config; không cần `vercel.json` nếu không có rewrite/header đặc biệt.
- GitHub repository kết nối Vercel sẽ tự tạo deployment theo push; `main` dùng làm Production branch.
- `totnghiep.vanhbe.io.vn` là subdomain, nên Vercel yêu cầu CNAME. Giá trị CNAME cụ thể phải lấy từ Project → Settings → Domains hoặc `vercel domains inspect`, không ghi đoán trong repository.
- Google Sheet được người dùng cung cấp có tiêu đề **Vanhbe Tốt nghiệp** và truy cập được qua link chia sẻ. Không có Codex Sheets session để chỉnh trực tiếp, nên tích hợp bằng Apps Script web app.

## Dependency baseline đã xác minh trong container

- Next.js `16.2.10`, React/React DOM `19.2.7`.
- Tailwind CSS và PostCSS plugin `4.3.3`.
- Motion `12.42.2`, canvas-confetti `1.9.4`, Three.js `0.185.1`, React Three Fiber `9.6.1`.
- TypeScript `6.0.3`, ESLint `9.39.5`, eslint-config-next `16.2.10`.

## Quyết định thiết kế

- Dùng Three.js qua React Three Fiber cho mô hình phong thư 3D; giữ nội dung thiệp là HTML để SEO và fallback.
- Dùng một Client Component cho state nhỏ (`intro`, `invitation`, `submitting`, `result`); không thêm state library.
- Dùng Motion cho mở panel 3D, CSS cho ánh sáng và sparkles; reduced-motion tắt WebGL và chuyển động không thiết yếu.
- Apps Script URL chỉ tồn tại trong server ENV. Browser gọi `/api/rsvp`, route này validate và forward payload.
- Local bật `RSVP_DRY_RUN=true` để kiểm thử UI mà không ghi dòng giả vào Sheet; Production không bật dry-run.

## Rủi ro

- Apps Script deployment hiện có phải chấp nhận POST JSON theo contract; repository cung cấp `Code.gs` chuẩn để người dùng cập nhật nếu script hiện tại không tương thích.
- Phiên bản hiện tại chủ động không hiển thị ảnh theo yêu cầu cập nhật của người dùng. Ảnh thật sẽ được thêm bằng task riêng sau khi người dùng xác nhận asset.
