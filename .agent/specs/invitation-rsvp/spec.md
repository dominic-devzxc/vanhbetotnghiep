---
title: Thiệp mời tốt nghiệp và RSVP Google Sheet
status: APPROVED
version: 1.0.0
created: 2026-07-17
---

## 1. Overview

Xây dựng landing page thiệp mời tốt nghiệp mobile-first cho Đào Vân Anh. Khách nhập tên, mở thư, xem thông tin buổi lễ, chọn tham dự hoặc không và phản hồi được ghi vào Google Sheet qua Apps Script.

## 2. User Scenarios

- **US1**: Là khách mời, tôi muốn nhập tên thường được Vân Anh gọi và mở thư, để nhận lời mời mang tính cá nhân.
- **US2**: Là khách mời, tôi muốn đọc rõ lời mời, thời gian và địa điểm trên điện thoại, để quyết định có tham dự hay không.
- **US3**: Là khách mời, tôi muốn chọn Có hoặc Không và nhận thông báo xác nhận, để biết phản hồi của mình đã được ghi nhận.
- **US4**: Là Vân Anh, tôi muốn mỗi phản hồi có tên, lựa chọn tham dự và thời gian gửi trong Google Sheet, để theo dõi danh sách khách mời.

## 3. Functional Requirements

- **FR01**: Màn hình đầu phải có input tên, nút Mở thư và hỗ trợ phím Enter.
- **FR02**: Tên từ query `to` phải điền sẵn nhưng vẫn có thể chỉnh sửa; tên dài tối đa 80 ký tự.
- **FR03**: Sau khi mở, thiệp phải hiển thị lời mời, ngày 21/07/2026, thời gian 09:00–12:00 và Học viện Quản lý Giáo dục.
- **FR04**: Trải nghiệm dùng chuyển cảnh mềm, ánh sáng pastel và mô hình phong thư Three.js 3D; sau loading, khách thấy phong thư, nhập tên rồi phong thư mở ra, màn hình bừng sáng trước khi nội dung thiệp xuất hiện. Nội dung thiệp vẫn phải đọc được không cần WebGL.
- **FR05**: RSVP phải có hai lựa chọn duy nhất: `yes` và `no`; mỗi lần gửi chứa `guestName`, `attendance`, `submittedAt`.
- **FR06**: Next.js API phải chuyển RSVP tới Google Apps Script URL lấy từ ENV và trả trạng thái thành công/thất bại rõ ràng.
- **FR07**: Khi gửi thành công, lựa chọn Yes hiển thị lời cảm ơn; No hiển thị lời hẹn gặp lại.
- **FR08**: Khi Apps Script lỗi hoặc timeout, giao diện phải giữ lựa chọn và cho phép thử lại mà không reload trang.

## 4. Non-Functional Requirements

- **NFR01**: Thiết kế ưu tiên viewport 320–430 px, không có horizontal scroll và CTA tối thiểu 44 px.
- **NFR02**: Tôn trọng `prefers-reduced-motion`; 3D WebGL và animation phải có fallback HTML khi animation bị giảm hoặc WebGL không khả dụng.
- **NFR03**: API endpoint của Apps Script không được gửi xuống browser bundle.
- **NFR04**: LCP mục tiêu <2.5 giây, INP <200 ms, CLS <0.1; ảnh phải có kích thước cố định và được Next.js tối ưu.
- **NFR05**: Ứng dụng phải build thành công trong Docker và tương thích Vercel zero-config.

## 5. Failure Cases

- Tên rỗng hoặc chỉ có khoảng trắng: không mở thư và hiển thị lỗi tại input.
- Tên vượt quá 80 ký tự hoặc attendance ngoài `yes`/`no`: API trả 400.
- Thiếu `GOOGLE_APPS_SCRIPT_URL`: API trả 503 mà không lộ cấu hình nội bộ.
- Apps Script không phản hồi trong 8 giây: API hủy request và trả lỗi có thể thử lại.
- Gửi RSVP nhiều lần nhanh: nút bị khóa trong lúc request đang chạy.

## 6. Success Criteria

- [X] **SC01**: Luồng nhập tên → mở thư → RSVP hoạt động ở viewport 320, 390 và 430 px.
- [X] **SC02**: Yes/No gửi đủ ba trường và hiển thị đúng hai kết quả sau thành công.
- [X] **SC03**: Docker build, lint và production runtime đều thành công.
- [X] **SC04**: Metadata, canonical, robots, sitemap và `llms.txt` có mặt trong build.
- [X] **SC05**: Repository có hướng dẫn kết nối Apps Script, deploy Vercel và domain `totnghiep.vanhbe.io.vn`.
