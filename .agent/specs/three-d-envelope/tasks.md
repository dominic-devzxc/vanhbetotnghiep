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
