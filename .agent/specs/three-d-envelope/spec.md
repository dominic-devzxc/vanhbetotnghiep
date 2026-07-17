---
title: Phong thư và con dấu sáp 3D
status: DRAFT
version: 1.1.0
created: 2026-07-17
---

## 1. Overview

Màn mở đầu phải thể hiện rõ một phong thư giấy cao cấp với con dấu sáp dập nổi, đồng thời giữ nguyên luồng nhập tên và mở thiệp không tải lại trang.

## 2. User Scenarios

- **US1**: Là khách mời, tôi muốn nhận ra ngay phong thư và con dấu sáp để trải nghiệm mở thiệp có cảm giác trang trọng, chân thực.
- **US2**: Là khách mời, tôi muốn nhập tên rồi bấm đúng con dấu để mở thư, nhờ đó luồng tương tác rõ ràng và có chủ đích.
- **US3**: Là khách mời hạn chế chuyển động, tôi muốn thấy phiên bản tĩnh tương đương để vẫn mở được thiệp thuận tiện.

## 3. Functional Requirements

- **FR01**: Phong thư phải có thân, hai nếp gấp bên, nếp gấp dưới và nắp trên phân biệt được bằng sắc độ giấy.
- **FR02**: Con dấu phải là một khối sáp đơn có mép hữu cơ, mặt dập nổi và đường kính không quá 20% chiều cao phong thư.
- **FR03**: Không có nhãn hoặc nút hiển thị đè lên bề mặt con dấu.
- **FR04**: Chỉ thao tác trên con dấu mới mở thư; khi tên trống phải đưa focus về ô tên và thông báo lỗi.
- **FR05**: Khi mở, dấu biến mất, nắp xoay gần 175 độ và thiệp trượt lên trước khi chuyển màn.
- **FR06**: Phiên bản reduced-motion phải giữ hình phong thư, con dấu và thao tác mở tương đương.
- **FR07**: Nếu cảnh 3D chưa tải được, trạng thái chờ phải giữ đúng khung hình phong thư và không gây dịch chuyển bố cục.

## 4. Non-Functional Requirements

- **NFR01**: Không thêm dependency hoặc asset ảnh mới cho thay đổi này.
- **NFR02**: Canvas giới hạn DPR tối đa 2 và không tạo geometry mới trong vòng lặp animation.
- **NFR03**: CTA và trạng thái focus phải đạt WCAG AA; chuyển động phải tôn trọng `prefers-reduced-motion`.
- **NFR04**: Type-check và Docker build phải hoàn tất không lỗi.

## 5. Success Criteria

- [X] **SC01**: Ở trạng thái đóng, người xem nhận ra rõ phong thư giấy và một con dấu sáp tròn dập nổi, không còn cụm khối cầu giống bông hoa.
- [X] **SC02**: Con dấu không bị văn bản che ở desktop hoặc mobile 320 px.
- [X] **SC03**: Nhập tên, kích hoạt dấu và mở thư vẫn hoạt động như trước.
- [X] **SC04**: Phiên bản reduced-motion vẫn có thể mở thư bằng bàn phím.
- [X] **SC05**: Docker build thành công.
