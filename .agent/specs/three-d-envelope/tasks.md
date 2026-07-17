# Tasks

## Phase 1: Setup

- [X] T001 [P] [US1] Chuẩn hóa đặc tả và kế hoạch redesign trong `.agent/specs/three-d-envelope/spec.md`, `.agent/specs/three-d-envelope/plan.md`, `.agent/specs/three-d-envelope/tasks.md`.

## Phase 2: Foundation

- [X] T002 [P] [US1] Tạo repro kiểm tra cấu trúc dấu cũ và xác nhận luồng callback không đổi trong `components/EnvelopeScene.tsx`.

## Phase 3: Phong thư và con dấu

- [X] T003 [US1] Thay cụm sphere bằng đĩa sáp mép hữu cơ và họa tiết dập nổi, đồng thời tinh chỉnh palette giấy trong `components/EnvelopeScene.tsx`.
- [X] T004 [US2] Bỏ nhãn che dấu, đồng bộ phong thư fallback và loading frame trong `components/InvitationCover.tsx`.

## Phase 4: Reduced motion

- [X] T005 [US3] Xác minh fallback tĩnh vẫn có nút accessible và không che con dấu trong `components/InvitationCover.tsx`.

## Final Phase: Polish

- [X] T006 [P] Chạy type-check/build bằng Docker, rà soát diff và cập nhật trạng thái task trong `.agent/specs/three-d-envelope/tasks.md`.
- [X] T007 [P] [US1] Loại bỏ pulse/glow gây nhấp nháy và tách lớp sâu của thiệp khỏi nếp gấp trong `components/EnvelopeScene.tsx`.
- [X] T008 [P] Chạy repro chiều sâu, type-check, Docker build và kiểm tra render trong `components/EnvelopeScene.tsx`.
- [X] T009 [P] [US1] Sửa paper texture, color-space và palette mở thư trong `components/EnvelopeScene.tsx`.
- [X] T010 [P] [US2] Giữ thiệp sau lớp bao thư và chạy Docker gate trong `components/EnvelopeScene.tsx`.
- [X] T011 [P] [US1] Redesign dấu sáp 3D nhiều lớp với vòng, hạt, nguyệt quế và mũ tốt nghiệp dập nổi trong `components/EnvelopeScene.tsx`.
- [X] T012 [P] [US1] Chuyển phong bì và dấu sáp sang palette pastel sáng, cân lại ánh sáng trong `components/EnvelopeScene.tsx`.
- [X] T013 [P] [US2] Xóa thiệp mini và timeline trượt khỏi `components/EnvelopeScene.tsx`, đồng bộ props tại `components/InvitationCover.tsx`.
- [X] T014 [P] [US1] Áp dụng palette theo ảnh tham chiếu và vòng sáng tĩnh quanh dấu trong `components/EnvelopeScene.tsx`, `components/InvitationCover.tsx`.
- [X] T015 [P] [US1] Tạo và tách nền khung hoa pastel tại `public/images/pastel-floral-frame.png`.
- [X] T016 [P] [US1] Tích hợp khung hoa, medallion header và input viền kép trong `app/page.tsx`, `components/InvitationCover.tsx`.
- [X] T017 [P] [US1] Tăng độ đậm lavender, kích thước phong bì và dấu sáp theo ảnh tham chiếu trong `components/EnvelopeScene.tsx`.
