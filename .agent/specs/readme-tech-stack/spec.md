---
title: README Landing Page và Tech Stack
status: APPROVED
version: 1.0.0
created: 2026-07-17
---

## 1. Overview

Tạo lại README để mô tả nhất quán thiết kế landing page thiệp mời tốt nghiệp, hệ màu pastel và tech stack triển khai mượt, gọn, phù hợp Docker-first.

## 2. User Scenarios

- **US1**: Là chủ dự án, tôi muốn nhìn thấy định hướng thiết kế và màu sắc rõ ràng, để giao diện được triển khai nhất quán.
- **US2**: Là lập trình viên, tôi muốn biết công nghệ nào cần dùng và vai trò của từng công nghệ, để triển khai landing page không dư thừa dependency.
- **US3**: Là khách mời, tôi muốn trải nghiệm mở thiệp mượt và dễ sử dụng trên điện thoại, để xem thông tin và phản hồi thuận tiện.

## 3. Functional Requirements

- **FR01**: README phải ghi đúng bốn màu `#FBEFEF`, `#FFE2E2`, `#F5CBCB`, `#C5B3D3` và vai trò của từng màu.
- **FR02**: README phải mô tả luồng mở thiệp, xem thông tin lễ tốt nghiệp và phản hồi RSVP.
- **FR03**: README phải nêu Next.js App Router, TypeScript, React, Tailwind CSS, animation, SEO và Docker trong tech stack.
- **FR04**: README phải phân biệt công nghệ cốt lõi với thư viện chỉ dùng khi cần.
- **FR05**: README phải nêu mục tiêu hiệu năng, responsive và accessibility có thể kiểm tra.

## 4. Non-Functional Requirements

- **NFR01**: README không tuyên bố source/runtime đã tồn tại khi repository chưa có ứng dụng.
- **NFR02**: Không đề xuất backend, database hoặc state library nếu landing page chưa cần lưu RSVP.
- **NFR03**: Mọi URL và port runtime tương lai phải cấu hình qua ENV, tuân thủ Constitution.

## 5. Failure Cases

- Nếu animation bị giảm hoặc tắt bởi thiết lập hệ điều hành, nội dung và RSVP vẫn phải sử dụng được.
- Nếu thiếu tên khách mời trong URL, giao diện phải dùng lời chào chung thay vì lỗi hoặc hiển thị dữ liệu rỗng.

## 6. Success Criteria

- [X] **SC01**: README chứa đầy đủ concept, palette, UX flow, tech stack và nguyên tắc hiệu năng.
- [X] **SC02**: Tech stack tối giản, không có dependency không phục vụ trực tiếp landing page.
- [X] **SC03**: Nội dung phù hợp Constitution và không chứa secret/URL hard-code.
