---
title: Governance, SEO and GEO Audit
status: APPROVED
version: 1.0.0
created: 2026-07-17
---

## 1. Overview

Cập nhật Hiến pháp dự án bằng Tech Stack và phân bổ Docker ports đã được khai báo, đồng thời đánh giá mức sẵn sàng Technical SEO và GEO của repository theo checklist nội bộ.

## 2. User Scenarios

- **US1**: Là chủ dự án, tôi muốn AI nhận diện đúng dự án và các ràng buộc hạ tầng, để các thay đổi sau này dùng đúng công nghệ và cổng dịch vụ.
- **US2**: Là chủ dự án, tôi muốn biết các thiếu sót Technical SEO có mức độ ưu tiên rõ ràng, để có thể triển khai website theo thứ tự ít rủi ro nhất.
- **US3**: Là chủ dự án, tôi muốn biết mức sẵn sàng cho công cụ tìm kiếm AI, để nội dung tương lai có khả năng được thu thập và trích dẫn.

## 3. Functional Requirements

- **FR01**: Constitution phải ghi rõ stack được chọn trong README và trạng thái triển khai thực tế của stack.
- **FR02**: Constitution phải ánh xạ frontend, admin và API tới biến môi trường cùng cổng mặc định hiện có.
- **FR03**: Báo cáo SEO phải kiểm tra toàn bộ mục Technical SEO, Core Web Vitals và crawlability, phân loại Critical/Warning/Info và có điểm 0–100.
- **FR04**: Báo cáo GEO phải kiểm tra AI crawlability, E-E-A-T, định dạng nội dung và topic authority.
- **FR05**: Mọi tiêu chí không thể xác minh do thiếu mã ứng dụng phải được ghi là chưa đạt hoặc chưa thể đo, không được suy đoán là đạt.

## 4. Non-Functional Requirements

- **NFR01**: Không đọc hoặc ghi lộ giá trị bí mật trong `.env`.
- **NFR02**: Không chạy Node.js/Python trực tiếp trên host; mọi build/runtime check phải qua Docker.
- **NFR03**: Mỗi tác vụ ảnh hưởng tối đa 3 tệp và có thể hoàn thành trong 15 phút.

## 5. Failure Cases

- Nếu chưa có public pages hoặc Docker Compose, audit phải nêu rõ pre-condition chưa đạt và đưa ra bước khắc phục thay vì tạo kết quả giả.
- Nếu Git push không có remote/quyền truy cập, commit vẫn phải được tạo và blocker push phải được báo cáo.

## 6. Success Criteria

- [X] **SC01**: Constitution có các điều khoản cụ thể, kiểm chứng được về stack, ports, bảo mật, Docker deployment, build safety và pre-deploy.
- [X] **SC02**: Báo cáo SEO có điểm tổng, bằng chứng repository và danh sách khắc phục theo ưu tiên.
- [X] **SC03**: Báo cáo GEO có kết luận điều kiện tiên quyết cùng danh sách khắc phục theo checklist.
- [X] **SC04**: Không thay đổi mã ứng dụng hoặc dữ liệu người dùng ngoài phạm vi audit.
